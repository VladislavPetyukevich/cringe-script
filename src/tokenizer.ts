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

      const prevToken = getToken(currState.charsBuffer);
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

