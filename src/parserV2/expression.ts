import { expectTokenType } from '../parserV2/parserV2';
import { Token, TokenType } from '../tokenizer';

export interface Expression {
  type: 'Expression';
  leftOperand: Token;
  operators: Token[] | null;
  rightOperand: Expression | ExpressionParenthesized | null;
}

export interface ExpressionParenthesized {
  type: 'ExpressionParenthesized';
  expression: Expression | ExpressionParenthesized;
}

const operandTypes = [
  TokenType.Name,
  TokenType.Num,
];

const operatorTypes = [
  TokenType.Plus,
  TokenType.Minus,
  TokenType.Multiply,
  TokenType.Devide,
  TokenType.Greater,
  TokenType.Less,
  TokenType.Equal,
  TokenType.ExclamationMark,
  TokenType.Equal,
  TokenType.Or,
  TokenType.And,
];

const parseOperand = (tokens: Token[]) => {
  const operandToken = tokens[0];
  try {
    expectTokenType(operandToken.type, operandTypes);
    return operandToken;
  } catch {
    throw new Error(`Failed to parse expression operand. Unexpected token "${operandToken.stringView}"`);
  }
};

const parseOperators = (tokens: Token[]): Token[] => {
  if (tokens.length === 0) {
    return [];
  }
  const operatorToken = tokens[0];
  try {
    expectTokenType(operatorToken.type, operatorTypes);
    return [operatorToken, ...parseOperators(tokens.slice(1))];
  } catch {
    return [];
  }
};

export const parseExpressionParenthesized = (tokens: Token[]): ExpressionParenthesized | null => {
  if (tokens.length === 0) {
    return null;
  }
  if (tokens[0].type !== TokenType.OpenBracket) {
    return null;
  }
  const closeBracketIndex = tokens.findIndex(token => token.type === TokenType.CloseBracket);
  if (closeBracketIndex === -1) {
    throw new Error(`Failed to parse parenthesized expression. CloseBracket not found: ${tokens.map(token => token.stringView).join('')}`);
  }
  return {
    type: 'ExpressionParenthesized',
    expression: parseExpression(tokens.slice(1, closeBracketIndex + 1)),
  };
};

export const parseExpression = (tokens: Token[]): Expression | ExpressionParenthesized => {
  const expressionParenthesized = parseExpressionParenthesized(tokens);
  if (expressionParenthesized) {
    return expressionParenthesized;
  }
  const leftOperand = parseOperand(tokens);
  const operators = parseOperators(tokens.slice(1));
  if (operators.length === 0) {
    return {
      type: 'Expression',
      leftOperand,
      operators: null,
      rightOperand: null,
    };
  }
  return {
    type: 'Expression',
    leftOperand,
    operators,
    rightOperand: parseExpression(tokens.slice(1 + operators.length)),
  };
};
