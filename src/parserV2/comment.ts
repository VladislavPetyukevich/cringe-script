import { Token, TokenType } from '../tokenizer';
import { expectTokenType } from './parserV2';

export interface Comment {
  content: string;
}

export const checkIsComment = (tokens: Token[]) => {
  try {
    expectTokenType(tokens[0].type, [TokenType.Devide]);
    expectTokenType(tokens[1].type, [TokenType.Devide]);
    return true;
  } catch {
    return false;
  }
};

export const parseComment = (tokens: Token[]): Comment => {
  const content = tokens.slice(2).map(
    token => token.stringView,
  ).join(' ');
  return {
    content,
  };
};