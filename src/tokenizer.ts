export enum TokenType {
  Name,            // 0
  Num,             // 1
  Str,             // 2
  Equal,           // 3
  NewLine,         // 4
  Multiply,        // 5
  Devide,          // 6
  Plus,            // 7
  Minus,           // 8
  Quote,           // 9
  Comma,           // 10
  OpenBrace,       // 11
  CloseBrace,      // 12
  OpenBracket,     // 13
  CloseBracket,    // 14
  Greater,         // 15
  Less,            // 16
  ExclamationMark, // 17
  Colon,           // 18
  QuestionMark,    // 19
}

export const getComplexTokenType = (stringView: string) => {
  if (
    (stringView[0] === '\'') &&
    (stringView[stringView.length - 1] === '\'')
  ) {
    return TokenType.Str;
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

export const removeBlankLines = (text: string) =>
  text.replace(/^\s*[\r\n]/gm, '');

export const tokenize = (source: string) => {
  const withoutBlankLines = removeBlankLines(source);
  const chars = withoutBlankLines.split('');
  const initialState: TokenizerState = {
    tokens: [],
    charsBuffer: ''
  };

  const tokenizedState = chars.reduce(
    (currState, currChar, charIndex) => {
      const charTokenType = getTokenType(currChar);
      const currToken = getToken(currState.charsBuffer.trim() + currChar);
      const isStringCompleted = currToken.type === TokenType.Str;
      if (isStringCompleted) {
        return {
          tokens: [...currState.tokens, currToken],
          charsBuffer: ''
        };
      }
      const isNotLastChar = charIndex !== chars.length - 1;
      if (
        (charTokenType === TokenType.Num && isNotLastChar) ||
        (charTokenType === TokenType.Name && isNotLastChar) ||
        (charTokenType === TokenType.Quote && !isStringCompleted)
      ) {
        return {
          tokens: currState.tokens,
          charsBuffer: currState.charsBuffer + currChar
        };
      }

      const charsBuffer = currState.charsBuffer.trim();
      return {
        tokens: [
          ...currState.tokens,
          ...charsBuffer ? [getToken(charsBuffer)] : [],
          ...currChar !== ' ' ? [getToken(currChar)] : []
        ],
        charsBuffer: ''
      };
    },
    initialState
  );

  return tokenizedState.tokens;
};

