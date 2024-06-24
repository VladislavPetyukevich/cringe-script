import { Token, TokenType } from '../tokenizer';
import { expectTokenType } from './parser';

export interface Cringe {
  content: string;
}

export const checkIsCringe = (tokens: Token[]) => {
  try {
    expectTokenType(tokens[0].type, [TokenType.Cringe]);
    return true;
  } catch {
    return false;
  }
};

export const parseCringe = (tokens: Token[]): Cringe => {
  const stringView = tokens[0].stringView;
  return {
    content: stringView.slice(1, stringView.length - 1).trim(),
  };
};