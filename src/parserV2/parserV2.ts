import {
  Expression,
  ExpressionParenthesized,
  parseExpression
} from './expression';
import {
  Token,
  TokenType
} from '../tokenizer';

export type Statement =
{
  type: 'Expression',
  value: Expression;
} | {
  type: 'ExpressionParenthesized',
  value: ExpressionParenthesized;
}

export const expectTokenType = (tokenType: TokenType, expectedTokenTypes: TokenType[]) => {
  if (expectedTokenTypes.includes(tokenType)) {
    return true;
  }

  throw new Error('Unxpected token type');
};

const splitTokensToStatements = (tokens: Token[]): Token[][] => {
  if (tokens.length === 0) {
    return [];
  }

  let openBraceCount = 0;
  const newLineIndex = tokens.findIndex(
    (token, index) => {
      if (token.type !== TokenType.NewLine) {
        return false;
      }
      const prevToken = tokens[index - 1];
      const nextToken = tokens[index + 1];
      if (prevToken && (prevToken.type === TokenType.OpenBrace)) {
        openBraceCount++;
        return false;
      }
      if (nextToken && (nextToken.type === TokenType.CloseBrace)) {
        openBraceCount--;
        if (openBraceCount === 0) {
         return false;
        }
      }
      if (openBraceCount > 0) {
        return false;
      }
      return true;
    }
  );
  if (newLineIndex === -1) {
    return [tokens];
  }
  const lineTokens = tokens.slice(0, newLineIndex);
  const restTokens = tokens.slice(newLineIndex + 1);
  if (restTokens.length) {
    return [lineTokens, ...splitTokensToStatements(restTokens)];
  } else {
    return [lineTokens];
  }
};

const parseStatement = (tokens: Token[]): Statement => {
  const parsedExpression = parseExpression(tokens);
  if (parsedExpression.type === 'Expression') {
    return {
      type: 'Expression',
      value: parsedExpression,
    };
  }
  if (parsedExpression.type === 'ExpressionParenthesized') {
    return {
      type: 'ExpressionParenthesized',
      value: parsedExpression,
    };
  }
  throw new Error(`Falied to parse statement: ${tokens.map(token => token.stringView).join('')}`)
};

export const parse = (tokens: Token[]): Statement[] => {
  const tokenStatements = splitTokensToStatements(tokens);
  const statements = tokenStatements.map((statement, lineIndex) => {
    if (statement.length === 0) {
      return;
    }
    try {
      return parseStatement(statement);
    } catch (err) {
      throw new Error(`Line ${lineIndex + 1}: ${err.message}`);
    }
  });
  const resultStatements = statements.filter(
    (el): el is (ReturnType<typeof parse>)[number] =>
    Boolean(el)
  );
  return resultStatements;
};
