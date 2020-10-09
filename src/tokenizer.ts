export enum TokenType {
  Name,     // 0
  Num,      // 1
  Equal,    // 2
  NewLine,  // 3
  Multiply, // 4
  Devide,   // 5
  Plus,     // 6
  Minus     // 7
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
  if (stringView === '\n') {
    return TokenType.NewLine;
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
      if (
        (charTokenType === TokenType.Num) ||
        (charTokenType === TokenType.Name)
      ) {
        const newStringBuffer = currState.charsBuffer + currChar;
        return {
          tokens: currState.tokens,
          charsBuffer: newStringBuffer
        };
      }

      const prevToken = getToken(currState.charsBuffer.trim());
      const currToken = getToken(currChar);
      return {
        tokens: [...currState.tokens, prevToken, currToken],
        charsBuffer: ''
      };
    },
    initialState
  );

  return tokenizedState.tokens;
};

