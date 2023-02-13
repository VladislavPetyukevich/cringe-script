import { Token, TokenType } from '../tokenizer';
import { Expression, parseExpression } from './expression';
import { expectTokenType } from './parserV2';

export interface FunctionCall {
  name: string;
  argument: Expression;
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
  } catch {
    return false;
  }
  for (let i = 2; i < tokens.length; i++) {
    if (tokens[i].type === TokenType.CloseBracket) {
      return true;
    }
    if (tokens[i].type === TokenType.OpenBracket) {
      return false;
    }
  }
  return false;
};

export const parseFunctionCall = (
  tokens: Token[]
): FunctionCall => {
  const openBracketIndex = tokens.findIndex(
    token => token.type === TokenType.OpenBracket
  );
  const closeBracketIndex = tokens.findIndex(
    token => token.type === TokenType.CloseBracket
  );
  return {
    name: tokens[0].stringView,
    argument: parseExpression(tokens.slice(openBracketIndex + 1, closeBracketIndex))
  };
};
