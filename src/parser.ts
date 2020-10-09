import { TokenType, Token } from './tokenizer';

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

const parseAssignment = (tokens: Token[]): Assignment => {
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

  const newLineIndex = tokens.findIndex(
    token => token.type === TokenType.NewLine
  );
  const lineTokens = tokens.slice(0, newLineIndex);
  const restTokens = tokens.slice(newLineIndex + 1);
  return [lineTokens, ...splitTokensToStatements(restTokens)];
};

type StatementType = 'Assignment';

export interface Statement {
  type: StatementType;
  value: Assignment;
}

export const parse = (tokens: Token[]): Statement[] => {
  const tokenStatements = splitTokensToStatements(tokens);
  const assignments = tokenStatements.map(parseAssignment);
  return assignments.map(
    assignment => ({ type: 'Assignment', value: assignment })
  );
};

