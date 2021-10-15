import { Token, TokenType } from '../tokenizer';
import { expectTokenType, Expression } from './parser';

const parseOperators = (tokens: Token[]): Token[] => {
  if (tokens.length === 0) {
    return [];
  }
  try {
    expectTokenType(
      tokens[1].type,
      [
        TokenType.Plus,
        TokenType.Minus,
        TokenType.Multiply,
        TokenType.Devide,
        TokenType.Greater,
        TokenType.Less,
        TokenType.Equal,
        TokenType.ExclamationMark,
        TokenType.Equal
      ]
    );
    return [tokens[1], ...parseOperators(tokens.slice(1))];
  } catch {
    return [];
  };
};

export const parseExpression = (tokens: Token[]): Expression => {
  if (tokens.length === 1) {
    return {
      leftOperand: tokens[0],
      operator: null,
      rightOperand: null
    }
  };

  const operatorTokens: Token[] = parseOperators(tokens.slice(1));
  operatorTokens.push(tokens[1]);
  const rightTokens = tokens.slice(operatorTokens.length + 1, tokens.length);
  return {
    leftOperand: tokens[0],
    operator: operatorTokens,
    rightOperand: parseExpression(rightTokens)
  };
};
