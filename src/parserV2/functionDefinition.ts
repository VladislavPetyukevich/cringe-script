import { Token, TokenType } from '../tokenizer';
import { Expression, parseExpression } from './expression';
import { expectTokenType } from './parserV2';

export interface FunctionDefinition {
  arg: string;
  body: Expression;
}

export const checkIsFunctionDefinition = (
  tokens: Token[]
) => {
  if (tokens.length < 4) {
    return false;
  }
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    expectTokenType(tokens[1].type, [TokenType.Equal]);
    expectTokenType(tokens[2].type, [TokenType.Greater]);
    return true;
  } catch {
    return false;
  }
};

export const parseFunctionDefinition = (
  tokens: Token[]
): FunctionDefinition => {
  if (!checkIsFunctionDefinition(tokens)) {
    throw new Error('Error while parsing function defenition');
  }
  return {
    arg: tokens[0].stringView,
    body: parseExpression(tokens.slice(3)),
  };
};
