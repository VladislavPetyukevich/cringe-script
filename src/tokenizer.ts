enum TokenType {
  Name,   // 0
  Num,    // 1
  Equal,  // 2
  NewLine,// 3
  Multiply// 4
}

const getTokenType = (stringView: string) => {
  if (stringView === '=') {
    return TokenType.Equal;
  }
  if (stringView === '*') {
    return TokenType.Multiply;
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

interface Token {
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

export const tokenize = (source: string) => {
  const chars = source.split('');
  const initialState: TokenizerState = {
    tokens: [],
    charsBuffer: ''
  };

  const tokenizedState = chars.reduce(
    (currState, currChar, index) => {
      if (currChar === '\n') {
        const tokenBeforeNewLine = getToken(currState.charsBuffer);
        const newToken = getToken(currChar);
        return {
          tokens: [...currState.tokens, tokenBeforeNewLine, newToken],
          charsBuffer: ''
        };
      }

      if (
        (currChar === ' ') ||
        (currChar === '\t') ||
        (index === chars.length - 1)
      ) {
        const newToken = getToken(currState.charsBuffer);
        return {
          tokens: [...currState.tokens, newToken],
          charsBuffer: ''
        };
      }

      const newStringBuffer = currState.charsBuffer + currChar;
      return {
        tokens: currState.tokens,
        charsBuffer: newStringBuffer
      };
    },
    initialState
  );

  return tokenizedState.tokens;
};

