import { Token, TokenType } from '../tokenizer';
import { expectTokenType } from './parserV2';

export interface Cringe {
  content: string;
}

export const checkIsCringe = (tokens: Token[]) => {
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    if (
      tokens[0].stringView === '🤣' ||
      tokens[0].stringView === 'CRINGE'
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const parseCringe = (tokens: Token[]): Cringe => {
  const slice = tokens[1].type === TokenType.OpenBrace ?
    [3, tokens.length - 2] :
    [1, tokens.length];
  const content = tokens.slice(...slice).map(
    token => token.stringView,
  ).join('');
  return {
    content,
  };
};