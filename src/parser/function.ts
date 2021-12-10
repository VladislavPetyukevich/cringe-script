import { Token, TokenType } from '../tokenizer';
import { expectTokenType, FunctionCompositionExpression, FunctionExpression, parse, Statement } from './parser';

export const parseArgs = (tokens: Token[]) => {
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    expectTokenType(tokens[1].type, [TokenType.Equal]);
    expectTokenType(tokens[2].type, [TokenType.Greater]);
  } catch {
    throw new Error('Invalid arguments in function defenition');
  }
  return [tokens[0]];
};

export const parseBody = (tokens: Token[]) => {
  const equalIndex = tokens.findIndex(
    token => token.type === TokenType.Equal
  );
  const greaterIndex = tokens.findIndex(
    token => token.type === TokenType.Greater
  );
  if (
    (equalIndex === -1) ||
    (greaterIndex === -1)
  ) {
    throw new Error('=> symbol not found');
  }
  const body = tokens.slice(greaterIndex + 1, tokens.length);
  const bodyStatements = parse(body);
  if (
    (bodyStatements[0]) &&
    (bodyStatements[0].type === 'Assignment')
  ) {
    throw new Error('Assignments inside function are not allowed');
  }
  return bodyStatements;
};

export const parseFunctionExpression = (tokens: Token[]): FunctionExpression => {
  const args = parseArgs(tokens);
  const body = parseBody(tokens);
  return { args, body };
};

export const parseFunctionComposition = (tokens: Token[]): Token[] => {
  expectTokenType(
    tokens[0].type,
    [TokenType.Name]
  );
  if (tokens[1].type === TokenType.Comma) {
    parseFunctionComposition(tokens.slice(2, tokens.length));
    return [tokens[0], ...parseFunctionComposition(tokens.slice(2, tokens.length))];
  }
  return [tokens[0]];
};

export const parseFunctionCallArgs = (tokens: Token[]): Statement[][] => {
  if (tokens.length === 0) {
    return [];
  }
  expectTokenType(tokens[0].type, [TokenType.OpenBracket]); 
  const closeBracketIndex = tokens.findIndex(
    token => token.type === TokenType.CloseBracket
  );
  return [
    parse(tokens.slice(1, closeBracketIndex)),
    ...parseFunctionCallArgs(tokens.slice(closeBracketIndex + 1, tokens.length))
  ];
};

export const parseFunctionCompositionExpression = (tokens: Token[]): FunctionCompositionExpression => {
  const functionComposition = parseFunctionComposition(tokens);
  const openBracketIndex = tokens.findIndex(
    token => token.type === TokenType.OpenBracket
  );
  if (openBracketIndex === -1) {
    throw new Error('Open bracket not found');
  }
  const args = parseFunctionCallArgs(tokens.slice(openBracketIndex, tokens.length));
  return {
    functionNames: functionComposition,
    args: args
  };
};

export const findIndexOfFunctionExpression = (tokens: Token[]) => {
  const greaterIndex = tokens.findIndex(token => token.type === TokenType.Greater);
  const equalIndex = tokens.findIndex(token => token.type === TokenType.Equal);
  if (
    (greaterIndex === -1) ||
    (equalIndex === -1) ||
    (equalIndex === 0)
  ) {
    return -1;
  }
  const isGreaterNextToEuqal = greaterIndex === equalIndex + 1;
  if (!isGreaterNextToEuqal) {
    return -1;
  }
  expectTokenType(tokens[equalIndex - 1].type, [TokenType.Name]);
  return equalIndex - 1;
};

const findFunctionCompositionStart = (
  tokens: Token[],
  startIndex: number,
  isCheckName = true
): number => {
  if (isCheckName) {
    expectTokenType(tokens[startIndex].type, [TokenType.Name]);
    return findFunctionCompositionStart(tokens, startIndex - 1, false);
  }
  try {
    expectTokenType(tokens[startIndex].type, [TokenType.Comma]);
    return findFunctionCompositionStart(tokens, startIndex - 1, true);
  } catch {
    return startIndex + 1;
  }
};

export const findIndexOfFunctionCompositionExpression = (tokens: Token[]) => {
  const openBracketIndex = tokens.findIndex(token => token.type === TokenType.OpenBracket);
  if (
    (openBracketIndex === -1) ||
    (openBracketIndex === 0)
  ) {
    return -1;
  }
  const startIndex = findFunctionCompositionStart(tokens, openBracketIndex - 1);
  return startIndex;
};
