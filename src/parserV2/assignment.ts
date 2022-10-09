import { Token, TokenType } from '../tokenizer';
import { Expression, ExpressionParenthesized, parseExpression } from './expression';
import { expectTokenType } from './parserV2';

export interface Assignment {
  type: 'Assignment';
  variableName: string;
  value:
    Expression | ExpressionParenthesized;
}

export const checkIsAssignment = (
  tokens: Token[]
) => {
  if (tokens.length < 3) {
    return false;
  }
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    expectTokenType(tokens[1].type, [TokenType.Equal]);
    return true;
  } catch {
    return false;
  }
};

export const parseAssignment = (
  tokens: Token[]
): Assignment => {
  if (!checkIsAssignment(tokens)) {
    throw new Error('Error while parsing assignment');
  }
  return {
    type: 'Assignment',
    variableName: tokens[0].stringView,
    value: parseExpression(tokens.slice(2)),
  };
};
