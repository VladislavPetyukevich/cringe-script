import { TokenType, Token } from './tokenizer';

export interface Statement {
  type: StatementType;
  value: Assignment;
}

export interface FunctionExpression {
  args: Token[];
  body: Statement[];
}

export interface Expression {
  leftOperand: Token;
  operator: null | Token;
  rightOperand: null | Expression;
}

export interface Assignment {
  variableName: string;
  value: Expression;
}

const expectTokenType = (tokenType: TokenType, expectedTokenTypes: TokenType[]) => {
  if (expectedTokenTypes.includes(tokenType)) {
    return true;
  }

  throw new Error('Unxpected token type');
};

const parseExpression = (tokens: Token[]): Expression => {
  if (tokens.length === 1) {
    return {
      leftOperand: tokens[0],
      operator: null,
      rightOperand: null
    }
  };

  expectTokenType(
    tokens[1].type,
    [TokenType.Plus, TokenType.Minus, TokenType.Multiply, TokenType.Devide]
  );
  const rightTokens = tokens.slice(2, tokens.length);
  return {
    leftOperand: tokens[0],
    operator: tokens[1],
    rightOperand: parseExpression(rightTokens)
  };
};

const parseArgs = (tokens: Token[]) => {
  expectTokenType(tokens[0].type, [TokenType.Name]);
  if (tokens.length === 1) {
    return tokens;
  }
  if (tokens[1].type === TokenType.OpenBrace) {
    return [tokens[0]];
  }
  expectTokenType(tokens[1].type, [TokenType.Comma]);
  return [tokens[0], ...parseArgs(tokens.slice(2, tokens.length))];
};

const parseBody = (tokens: Token[]) => {
  // console.log('tokens: ', tokens);
  const openBraceIndex = tokens.findIndex(
    token => token.type === TokenType.OpenBrace
  );
  if (openBraceIndex === -1) {
    throw new Error('Open brace not found');
  }
  const closeBraceIndex = tokens.findIndex(
    token => token.type === TokenType.CloseBrace
  );
  if (closeBraceIndex === -1) {
    throw new Error('Close brace not found');
  }
  const body = tokens.slice(openBraceIndex + 2, closeBraceIndex - 1);
  return body;
};

const parseFunctionExpression = (tokens: Token[]): FunctionExpression => {
  const args = parseArgs(tokens);
  console.log('args: ', args);
  const body = parseBody(tokens);
  console.log('body: ', body);
};

const parseAssignment = (tokens: Token[]): Assignment => {
  parseFunctionExpression(tokens.slice(2, tokens.length));
  expectTokenType(tokens[0].type, [TokenType.Name]);
  expectTokenType(tokens[1].type, [TokenType.Equal]);

  return {
    variableName: tokens[0].stringView,
    value: parseExpression(tokens.slice(2, tokens.length))
  };
};

const splitTokensToStatements = (tokens: Token[]) => {
  if (tokens.length === 0) {
    return tokens;
  }

  let isBodyOpen = false;
  const newLineIndex = tokens.findIndex(
    (token, index) => {
      if (token.type !== TokenType.NewLine) {
        return false;
      }
      const prevToken = tokens[index - 1];
      const nextToken = tokens[index + 1];
      if (prevToken && (prevToken.type === TokenType.OpenBrace)) {
        isBodyOpen = true;
        return false;
      }
      if (nextToken && (nextToken.type === TokenType.CloseBrace)) {
        isBodyOpen = false;
        return false;
      }
      if (isBodyOpen) {
        return false;
      }
      return true;
    }
  );
  if (newLineIndex === -1) {
    return tokens;
  }
  const lineTokens = tokens.slice(0, newLineIndex);
  const restTokens = tokens.slice(newLineIndex + 1);
  return [lineTokens, ...splitTokensToStatements(restTokens)];
};

type StatementType = 'Assignment';

export const parse = (tokens: Token[]): Statement[] => {
  const tokenStatements = splitTokensToStatements(tokens);
  console.log('tokenStatements: ', tokenStatements);
  const assignments = tokenStatements.map(parseAssignment);
  return assignments.map(
    assignment => ({ type: 'Assignment', value: assignment })
  );
};

