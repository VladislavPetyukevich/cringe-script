import { Token, TokenType } from '../tokenizer';
import { Expression, parseExpression } from './expression';
import { expectTokenType } from './parserV2';

export interface FunctionCall {
  name: string;
  argumentName: string;
}

export const checkIsFunctionCall = (
  tokens: Token[]
) => {
  if (tokens.length < 4) {
    return false;
  }
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    expectTokenType(tokens[1].type, [TokenType.OpenBracket]);
    expectTokenType(tokens[3].type, [TokenType.CloseBracket]);
    return true;
  } catch {
    return false;
  }
};

export const parseFunctionCall = (
  tokens: Token[]
): FunctionCall => {
  return {
    name: tokens[0].stringView,
    argumentName: tokens[2].stringView,
  };
};
