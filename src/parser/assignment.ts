import { Token, TokenType } from '../tokenizer';
import { Assignment, expectTokenType, parseAnyTypeExpression } from './parser';

export const parseAssignment = (tokens: Token[]): Assignment => {
  const variableName = tokens[0].stringView;
  const expressionTokens = tokens.slice(2, tokens.length);
  const value = parseAnyTypeExpression(expressionTokens);

  return {
    variableName, value
  };
};

export const checkIsAssignment = (tokens: Token[]) => {
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    expectTokenType(tokens[1].type, [TokenType.Equal]);
    try {
      expectTokenType(tokens[2].type, [TokenType.Greater]);
      return false;
    } catch {
      return true;
    }
  } catch {
    return false;
  }
};
