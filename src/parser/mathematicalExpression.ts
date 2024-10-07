import { expectTokenType } from './parser';
import { Token, TokenType } from '../tokenizer';
import { Expression, parseExpression } from './expression';

export interface MathematicalExpression {
  type: 'MathematicalExpression';
  leftOperand: Token[] | MathematicalExpressionParenthesized | Expression;
  operators: Token[] | null;
  rightOperand: Expression | null;
}

export interface MathematicalExpressionParenthesized {
  type: 'MathematicalExpressionParenthesized';
  expression: MathematicalExpression | MathematicalExpressionParenthesized;
}

const operandTypes = [
  TokenType.Name,
  TokenType.Num,
  TokenType.Str,
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
  TokenType.Percent,
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

export const parseExpressionParenthesized = (
  tokens: Token[]
): MathematicalExpressionParenthesized => {
  return {
    type: 'MathematicalExpressionParenthesized',
    expression: parseMathematicalExpression(tokens),
  };
};

export const getTokensMathematicalExpressionParenthesized = (
  tokens: Token[]
): Token[] | null => {
  if (tokens.length === 0) {
    return null;
  }
  if (tokens[0].type !== TokenType.OpenBracket) {
    return null;
  }
  if (tokens[tokens.length - 1].type !== TokenType.CloseBracket) {
    return null;
  }
  return tokens.slice(1, tokens.length - 1);
};

export const checkIsParenthesized = (
  tokens: Token[]
): boolean => {
  if (tokens.length === 0) {
    return false;
  }
  if (tokens[0].type !== TokenType.OpenBracket) {
    return false;
  }
  if (tokens[tokens.length - 1].type !== TokenType.CloseBracket) {
    return false;
  }
  return true;
};

export const parseMathematicalExpression = (
  tokens: Token[]
): MathematicalExpression | MathematicalExpressionParenthesized => {
  const expressionParenthesizedTokens =
    getTokensMathematicalExpressionParenthesized(tokens);
  if (expressionParenthesizedTokens) {
    return {
      type: 'MathematicalExpression',
      leftOperand: parseExpressionParenthesized(expressionParenthesizedTokens),
      operators: null,
      rightOperand: null,
    };
  }
  const firstOperatorIndex = tokens.findIndex(token => operatorTypes.includes(token.type));
  if (firstOperatorIndex === -1) {
    return {
      type: 'MathematicalExpression',
      leftOperand: tokens,
      operators: null,
      rightOperand: null,
    };
  }
  const operators = parseOperators(tokens.slice(firstOperatorIndex));
  const leftOperands = tokens.slice(0, firstOperatorIndex);
  const rightOperands = tokens.slice(firstOperatorIndex + operators.length);
  return {
    type: 'MathematicalExpression',
    leftOperand: parseExpression(leftOperands),
    operators,
    rightOperand: parseExpression(rightOperands),
  };
};
