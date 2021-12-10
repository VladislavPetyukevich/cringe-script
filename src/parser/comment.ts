import { Token, TokenType } from '../tokenizer';
import { CommentExpression, expectTokenType } from './parser';

export const parseComment = (tokens: Token[]): CommentExpression => {
  const content = tokens.slice(2).reduce(
    (accum, currToken) => accum + currToken.stringView,
    ''
  );
  return {
    content: content
  };
};

export const findIndexOfCommentExpression = (tokens: Token[]) => {
  try {
    const expectedTypes = [TokenType.Devide];
    expectTokenType(tokens[0].type, expectedTypes);
    expectTokenType(tokens[1].type, expectedTypes);
    return 0;
  } catch {
    return -1;
  }
};
