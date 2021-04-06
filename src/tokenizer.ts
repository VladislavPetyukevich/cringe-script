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

const getTokenType = (stringView: string) => {
  if (stringView === '=') {
    return TokenType.Equal;
  }
  if (stringView === '*') {
    return TokenType.Multiply;
  }
  if (stringView === '/') {
    return TokenType.Devide;
  }
  if (stringView === '+') {
    return TokenType.Plus;
  }
  if (stringView === '-') {
    return TokenType.Minus;
  }
  if (stringView === '\'') {
    return TokenType.Quote;
  }
  if (stringView === ',') {
    return TokenType.Comma;
  }
  if (stringView === '{') {
    return TokenType.OpenBrace;
  }
  if (stringView === '}') {
    return TokenType.CloseBrace;
  }
  if (stringView === '(') {
    return TokenType.OpenBracket;
  }
  if (stringView === ')') {
    return TokenType.CloseBracket;
  }
  if (stringView === '>') {
    return TokenType.Greater;
  }
  if (stringView === '<') {
    return TokenType.Less;
  }
  if (stringView === '!') {
    return TokenType.ExclamationMark;
  }
  if (stringView === ':') {
    return TokenType.Colon;
  }
  if (stringView === '?') {
    return TokenType.QuestionMark;
  }
  if (stringView === '\n') {
    return TokenType.NewLine;
  }
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

export interface Token {
  type: TokenType;
  stringView: string;
}

const getToken = (stringView: string) => {
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

const removeBlankLines = (text: string) =>
  text.replace(/^\s*[\r\n]/gm, '');

export const tokenize = (source: string) => {
  const withoutBlankLines = removeBlankLines(source);
  const chars = withoutBlankLines.split('');
  const initialState: TokenizerState = {
    tokens: [],
    charsBuffer: ''
  };

  const tokenizedState = chars.reduce(
    (currState, currChar) => {
      const charTokenType = getTokenType(currChar);
      const currToken = getToken(currState.charsBuffer.trim() + currChar);
      const isStringCompleted = currToken.type === TokenType.Str;
      if (isStringCompleted) {
        return {
          tokens: [...currState.tokens, currToken],
          charsBuffer: ''
        };
      }
      if (
        (charTokenType === TokenType.Num) ||
        (charTokenType === TokenType.Name) ||
        (charTokenType === TokenType.Quote && !isStringCompleted)
      ) {
        return {
          tokens: currState.tokens,
          charsBuffer: currState.charsBuffer + currChar
        };
      }

      const charsBuffer = currState.charsBuffer.trim();
      const currCharToken = getToken(currChar);
      return {
        tokens: [
          ...currState.tokens,
          ...charsBuffer ? [getToken(charsBuffer)] : [],
          currCharToken
        ],
        charsBuffer: ''
      };
    },
    initialState
  );

  return tokenizedState.tokens;
};

