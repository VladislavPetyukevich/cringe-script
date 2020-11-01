import { TokenType, Token } from './tokenizer';

export interface Statement {
  type: StatementType;
  value: Assignment | Expression | FunctionExpression;
}

export interface FunctionExpression {
  args: Token[];
  body: Token[];
}

export interface Expression {
  leftOperand: Token;
  operator: null | Token;
  rightOperand: null | Expression;
}

export interface Assignment {
  variableName: string;
  value: Expression | FunctionExpression;
}

const expectTokenType = (tokenType: TokenType, expectedTokenTypes: TokenType[]) => {
  if (expectedTokenTypes.includes(tokenType)) {
    return true;
  }

  throw new Error('Unxpected token type');
};

const parseExpression = (tokens: Token[]): Expression => {
  if (tokens.length === 1) {
    return {
      leftOperand: tokens[0],
      operator: null,
      rightOperand: null
    }
  };

  expectTokenType(
    tokens[1].type,
    [TokenType.Plus, TokenType.Minus, TokenType.Multiply, TokenType.Devide]
  );
  const rightTokens = tokens.slice(2, tokens.length);
  return {
    leftOperand: tokens[0],
    operator: tokens[1],
    rightOperand: parseExpression(rightTokens)
  };
};

const parseArgs = (tokens: Token[]) => {
  expectTokenType(tokens[0].type, [TokenType.Name]);
  if (tokens.length === 1) {
    return tokens;
  }
  if (tokens[1].type === TokenType.OpenBrace) {
    return [tokens[0]];
  }
  expectTokenType(tokens[1].type, [TokenType.Comma]);
  return [tokens[0], ...parseArgs(tokens.slice(2, tokens.length))];
};

const parseBody = (tokens: Token[]) => {
  // console.log('tokens: ', tokens);
  const openBraceIndex = tokens.findIndex(
    token => token.type === TokenType.OpenBrace
  );
  if (openBraceIndex === -1) {
    throw new Error('Open brace not found');
  }
  const closeBraceIndex = tokens.findIndex(
    token => token.type === TokenType.CloseBrace
  );
  if (closeBraceIndex === -1) {
    throw new Error('Close brace not found');
  }
  const body = tokens.slice(openBraceIndex + 2, closeBraceIndex - 1);
  return body;
};

const parseFunctionExpression = (tokens: Token[]): FunctionExpression => {
  const args = parseArgs(tokens);
  console.log('args: ', args);
  const body = parseBody(tokens);
  console.log('body: ', body);
  return { args, body };
};

const checkIsFunctionExpression = (tokens: Token[]) => {
  const comma = tokens.find(token => token.type === TokenType.Comma);
  return !!comma;
};

const parseAnyTypeExpression = (tokens: Token[]) => {
  const isFunctionExpression = checkIsFunctionExpression(tokens);
  const value = isFunctionExpression ?
    parseFunctionExpression(tokens) :
    parseExpression(tokens)
  return value;
};

const parseAssignment = (tokens: Token[]): Assignment => {
  const variableName = tokens[0].stringView;
  const expressionTokens = tokens.slice(2, tokens.length);
  const value = parseAnyTypeExpression(expressionTokens);

  return {
    variableName, value
  };
};

const splitTokensToStatements = (tokens: Token[]) => {
  if (tokens.length === 0) {
    return tokens;
  }

  let isBodyOpen = false;
  const newLineIndex = tokens.findIndex(
    (token, index) => {
      if (token.type !== TokenType.NewLine) {
        return false;
      }
      const prevToken = tokens[index - 1];
      const nextToken = tokens[index + 1];
      if (prevToken && (prevToken.type === TokenType.OpenBrace)) {
        isBodyOpen = true;
        return false;
      }
      if (nextToken && (nextToken.type === TokenType.CloseBrace)) {
        isBodyOpen = false;
        return false;
      }
      if (isBodyOpen) {
        return false;
      }
      return true;
    }
  );
  if (newLineIndex === -1) {
    return tokens;
  }
  const lineTokens = tokens.slice(0, newLineIndex);
  const restTokens = tokens.slice(newLineIndex + 1);
  return [lineTokens, ...splitTokensToStatements(restTokens)];
};

type StatementType = 'Assignment' | 'Expression';

const checkIsAssignment = (tokens: Token[]) => {
  try {
    expectTokenType(tokens[0].type, [TokenType.Name]);
    expectTokenType(tokens[1].type, [TokenType.Equal]);
    return true;
  } catch {
    return false;
  }
};

const parseStatement = (tokens: Token[]): Statement => {
  const isAssignment = checkIsAssignment(tokens);
  if (isAssignment) {
    return {
      type: 'Assignment',
      value: parseAssignment(tokens)
    }
  } else {
    return {
      type: 'Expression',
      value: parseAnyTypeExpression(tokens)
    }
  }
};

export const parse = (tokens: Token[]): Statement[] => {
  const tokenStatements = splitTokensToStatements(tokens);
  const statements = tokenStatements.map(parseStatement);
  return statements;
};

