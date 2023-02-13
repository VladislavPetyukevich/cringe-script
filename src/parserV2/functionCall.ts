import { Token, TokenType } from '../tokenizer';
import { Expression, parseExpression } from './expression';
import { expectTokenType } from './parserV2';

export type FunctionCall = {
  name: string;
  argument: Expression;
} | {
  prevFunctionCall: FunctionCall;
  argument: Expression;
};

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
  try {
    let isBracketOpen = true;
    const setIsBracketOpen = (newValue: boolean) => {
      if (isBracketOpen === newValue) {
        throw new Error();
      }
      isBracketOpen = newValue;
    };
    for (let i = 2; i < tokens.length; i++) {
      if (tokens[i].type === TokenType.CloseBracket) {
        setIsBracketOpen(false);
      }
      if (tokens[i].type === TokenType.OpenBracket) {
        setIsBracketOpen(true);
      }
    }
    if (isBracketOpen) {
      return false;
    } else {
      return true;
    }
  } catch {
    return false;
  }
};

export const parseFunctionCall = (
  tokens: Token[]
): FunctionCall => {
  const tokenTypes = tokens.map(token => token.type);
  const openBracketLastIndex = tokenTypes.lastIndexOf(TokenType.OpenBracket);
  const closeBracketLastIndex = tokenTypes.lastIndexOf(TokenType.CloseBracket);
  const argument = parseExpression(
    tokens.slice(openBracketLastIndex + 1, closeBracketLastIndex)
  );
  if (openBracketLastIndex > 1) {
    const prevFunctionCall = parseFunctionCall(
      tokens.slice(0, openBracketLastIndex)
    );
    return {
      prevFunctionCall,
      argument,
    };
  }
  return {
    name: tokens[0].stringView,
    argument,
  };
};
