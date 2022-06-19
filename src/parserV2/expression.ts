import { expectTokenType } from '../parserV2/parserV2';
import { Token, TokenType } from '../tokenizer';

export interface Expression {
  type: 'Expression';
  leftOperand: Token | ExpressionParenthesized;
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

export const parseExpressionParenthesized = (
  tokens: Token[]
): ExpressionParenthesized => {
  return {
    type: 'ExpressionParenthesized',
    expression: parseExpression(tokens),
  };
};

export const getTokensExpressionParenthesized = (
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

export const parseExpression = (
  tokens: Token[]
): Expression | ExpressionParenthesized => {
  const expressionParenthesizedTokens =
    getTokensExpressionParenthesized(tokens);
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
      type: 'Expression',
      leftOperand: leftOperand,
      operators: null,
      rightOperand: null,
    };
  }
  const rightOperandTokens = tokens.slice(operatorsIndex + operators.length);
  const rightOperand = parseExpression(rightOperandTokens);
  return {
    type: 'Expression',
    leftOperand,
    operators,
    rightOperand,
  };
};
