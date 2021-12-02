import { Token, TokenType } from '../tokenizer';
import { Cringe, expectTokenType } from './parser';

export const parseCringe = (tokens: Token[]): Cringe => {
  const openBraceIndex = tokens.findIndex(
    token => token.type === TokenType.OpenBrace
  );
  const closeBraceIndexReversed = tokens.slice().reverse().findIndex(
    token => token.type === TokenType.CloseBrace
  );
  const closeBraceIndex = (closeBraceIndexReversed === -1) ?
    -1 :
    tokens.length - 1 - closeBraceIndexReversed;

  const content = tokens.slice(1).reduce(
    (accum, currToken, index) => {
      if (
        (index === closeBraceIndex - 2) ||
        (index === closeBraceIndex - 1) ||
        (index === openBraceIndex - 1) ||
        (index === openBraceIndex)
      ) {
        return accum;
      }
      return accum + currToken.stringView;
    },
    ''
  );
  return {
    content: content
  };
};

export const checkIsCringe = (tokens: Token[]) => {
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    if (
      (tokens[0].stringView === 'CRINGE') ||
      (tokens[0].stringView === '🤣')
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
