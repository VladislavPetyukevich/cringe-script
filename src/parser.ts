import { TokenType, Token } from './tokenizer';

const splitTokensToStatements = (tokens: Token[]) => {
  if (tokens.length === 0) {
    return tokens;
  }

  const newLineIndex = tokens.findIndex(
    token => token.type === TokenType.NewLine
  );
  const lineTokens = tokens.slice(0, newLineIndex);
  const restTokens = tokens.slice(newLineIndex + 1);
  return [lineTokens, ...splitTokensToStatements(restTokens)];
};

export const parse = (tokens: Token[]) => {
  const tokenStatements = splitTokensToStatements(tokens);
  console.log('tokenStatements: ', tokenStatements);
};

