export enum TokenType {
  Name = 'Name',
  Num = 'Num',
  Str = 'Str',
  Equal = 'Equal',
  NewLine = 'NewLine',
  Multiply = 'Multiply',
  Devide = 'Devide',
  Plus = 'Plus',
  Minus = 'Minus',
  Quote = 'Quote',
  Comma = 'Comma',
  OpenBrace = 'OpenBrace',
  CloseBrace = 'CloseBrace',
  OpenBracket = 'OpenBracket',
  CloseBracket = 'CloseBracket',
  Greater = 'Greater',
  Less = 'Less',
  ExclamationMark = 'ExclamationMark',
  Colon = 'Colon',
  QuestionMark = 'QuestionMark',
  Or = 'Or',
  And = 'And',
  Cringe = 'Cringe',
  CringeSymbol = 'CringeSymbol',
  Percent = 'Percent',
}

export const getComplexTokenType = (stringView: string) => {
  if (
    (stringView[0] === '\'') &&
    (stringView[stringView.length - 1] === '\'')
  ) {
    return TokenType.Str;
  }
  if (
    (stringView[0] === '~') &&
    (stringView[stringView.length - 1] === '~')
  ) {
    return TokenType.Cringe;
  }
  if (stringView === '||') {
    return TokenType.Or;
  }
  if (stringView === '&&') {
    return TokenType.And;
  }
  const intRepresentation = parseInt(stringView, 10);
  if (isNaN(intRepresentation)) {
    return TokenType.Name;
  } else {
    return TokenType.Num;
  }
};

export const getTokenType = (stringView: string) => {
  switch (stringView) {
    case '=':
      return TokenType.Equal;
    case '*':
      return TokenType.Multiply;
    case '/':
      return TokenType.Devide;
    case '+':
      return TokenType.Plus;
    case '-':
      return TokenType.Minus;
    case '\'':
      return TokenType.Quote;
    case ',':
      return TokenType.Comma;
    case '{':
      return TokenType.OpenBrace;
    case '}':
      return TokenType.CloseBrace;
    case '(':
      return TokenType.OpenBracket;
    case ')':
      return TokenType.CloseBracket;
    case '>':
      return TokenType.Greater;
    case '<':
      return TokenType.Less;
    case '!':
      return TokenType.ExclamationMark;
    case ':':
      return TokenType.Colon;
    case '?':
      return TokenType.QuestionMark;
    case '\n':
      return TokenType.NewLine;
    case '~':
      return TokenType.CringeSymbol;
    case '%':
      return TokenType.Percent;
    default:
      return getComplexTokenType(stringView);
  }
};

export interface Token {
  type: TokenType;
  stringView: string;
}

export const getToken = (stringView: string) => {
  const tokenType = getTokenType(stringView);
  return {
    type: tokenType,
    stringView: stringView
  }
};

interface TokenizerState {
  tokens: Token[];
  charsBuffer: string;
}

const normalizeNewLines = (text: string) =>
  text.replace(/(\r\n|\r|\n)/gm, '\n');

export const tokenize = (source: string) => {
  const chars = normalizeNewLines(source).split('');
  const initialState: TokenizerState = {
    tokens: [],
    charsBuffer: ''
  };

  const tokenizedState = chars.reduce(
    (currState, currChar, charIndex) => {
      const charTokenType = getTokenType(currChar);
      const currCharsBuffer = currState.charsBuffer;
      const currToken = getToken(currCharsBuffer + currChar);
      const completeComplexTokens = [TokenType.Str, TokenType.Cringe];
      const isComplexCompleted = completeComplexTokens.includes(currToken.type);
      if (isComplexCompleted) {
        return {
          tokens: [...currState.tokens, currToken],
          charsBuffer: ''
        };
      }
      const isNotLastChar = charIndex !== chars.length - 1;
      const startComplexTokens = [TokenType.Quote, TokenType.CringeSymbol];
      const isComplexOpenedInBuffer =
        (!!currState.charsBuffer[0]) &&
        (startComplexTokens.includes(getTokenType(currState.charsBuffer[0])));
      const isComplexOpened =
        startComplexTokens.includes(charTokenType) ||
        isComplexOpenedInBuffer;
      const isNumOrNameNotCompleted =
        (charTokenType === TokenType.Num && isNotLastChar) ||
        (charTokenType === TokenType.Name && isNotLastChar);
      const isNeedFeedBuffer = currChar !== ' ';

      if (charTokenType === TokenType.Name && !isNotLastChar) {
        return {
          tokens: [...currState.tokens, currToken],
          charsBuffer: ''
        };
      }

      if (
        (isNeedFeedBuffer && isNumOrNameNotCompleted) ||
        (isComplexOpened)
      ) {
        return {
          tokens: currState.tokens,
          charsBuffer: currState.charsBuffer + currChar
        };
      }

      return {
        tokens: [
          ...currState.tokens,
          ...currCharsBuffer ? [getToken(currCharsBuffer)] : [],
          ...currChar !== ' ' ? [getToken(currChar)] : []
        ],
        charsBuffer: ''
      };
    },
    initialState
  );

  return tokenizedState.tokens;
};

