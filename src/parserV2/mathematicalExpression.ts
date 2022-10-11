import { expectTokenType } from './parserV2';
import { Token, TokenType } from '../tokenizer';

export interface MathematicalExpression {
  type: 'MathematicalExpression';
  leftOperand: Token | MathematicalExpressionParenthesized;
  operators: Token[] | null;
  rightOperand: MathematicalExpression | MathematicalExpressionParenthesized | null;
}

export interface MathematicalExpressionParenthesized {
  type: 'MathematicalExpressionParenthesized';
  expression: MathematicalExpression | MathematicalExpressionParenthesized;
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
  const closeBracketIndex = tokens.map(token => token.type).lastIndexOf(TokenType.CloseBracket);
  if (closeBracketIndex === -1) {
    throw new Error(`Failed to parse parenthesized expression. CloseBracket not found: ${tokens.map(token => token.stringView).join('')}`);
  }
  return tokens.slice(1, closeBracketIndex);
};

export const parseMathematicalExpression = (
  tokens: Token[]
): MathematicalExpression | MathematicalExpressionParenthesized => {
  const expressionParenthesizedTokens =
    getTokensMathematicalExpressionParenthesized(tokens);
  const leftOperandTokens =
    expressionParenthesizedTokens || [parseOperand(tokens)];
  const leftOperand = expressionParenthesizedTokens ?
    parseExpressionParenthesized(leftOperandTokens) :
    leftOperandTokens[0];
  const operatorsIndex = expressionParenthesizedTokens ?
    leftOperandTokens.length + 2 : // 2 - OpenBracket and CloseBracket
    leftOperandTokens.length;
  const operators = parseOperators(tokens.slice(operatorsIndex));
  if (operators.length === 0) {
    return {
      type: 'MathematicalExpression',
      leftOperand: leftOperand,
      operators: null,
      rightOperand: null,
    };
  }
  const rightOperandTokens = tokens.slice(operatorsIndex + operators.length);
  const rightOperand = parseMathematicalExpression(rightOperandTokens);
  return {
    type: 'MathematicalExpression',
    leftOperand,
    operators,
    rightOperand,
  };
};
