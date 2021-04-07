import { TokenType, Token } from './tokenizer';

export interface Statement {
  type: StatementType;
  value:
    Assignment |
    Expression |
    FunctionExpression |
    FunctionCompositionExpression |
    TernaryIfExpression;
}

export interface FunctionExpression {
  args: Token[];
  body: Statement[];
}

export interface FunctionCompositionExpression {
  functionNames: Token[];
  args: Token[];
}

export interface Expression {
  leftOperand: Token;
  operator: null | Token[];
  rightOperand: null | Expression;
}
export interface TernaryIfExpression  {
  condition: Statement[];
  statementTrue: Statement[];
  statementFalse: Statement[];
}

export interface Assignment {
  variableName: string;
  value: Expression | FunctionExpression | TernaryIfExpression;
}

const expectTokenType = (tokenType: TokenType, expectedTokenTypes: TokenType[]) => {
  if (expectedTokenTypes.includes(tokenType)) {
    return true;
  }

  throw new Error('Unxpected token type');
};

const parseOperators = (tokens: Token[]) => {
  if (tokens.length === 0) {
    return [];
  }
  try {
    expectTokenType(
      tokens[1].type,
      [
        TokenType.Plus,
        TokenType.Minus,
        TokenType.Multiply,
        TokenType.Devide,
        TokenType.Greater,
        TokenType.Less,
        TokenType.Equal,
        TokenType.ExclamationMark,
      ]
    );
    return [tokens[1], ...parseOperators(tokens.slice(1))];
  } catch {
    return [];
  };
};

const parseExpression = (tokens: Token[]): Expression => {
  if (tokens.length === 1) {
    return {
      leftOperand: tokens[0],
      operator: null,
      rightOperand: null
    }
  };

  const operatorTokens: Token[] = parseOperators(tokens.slice(1));
  operatorTokens.push(tokens[1]);
  const rightTokens = tokens.slice(operatorTokens.length + 1, tokens.length);
  return {
    leftOperand: tokens[0],
    operator: operatorTokens,
    rightOperand: parseExpression(rightTokens)
  };
};

const parseArgs = (tokens: Token[]) => {
  expectTokenType(tokens[0].type, [TokenType.Name]);
  expectTokenType(tokens[1].type, [TokenType.Equal]);
  expectTokenType(tokens[2].type, [TokenType.Greater]);
  return [tokens[0]];
};

const parseBody = (tokens: Token[]) => {
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
  return bodyStatements;
};

const parseFunctionExpression = (tokens: Token[]): FunctionExpression => {
  const args = parseArgs(tokens);
  const body = parseBody(tokens);
  return { args, body };
};

const parseFunctionComposition = (tokens: Token[]) => {
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

const parseFunctionCallArgs = (tokens: Token[]) => {
  if (tokens.length === 0) {
    return [];
  }
  return [tokens[0], ...parseFunctionCallArgs(tokens.slice(3, tokens.length))];
};

const parseFunctionCompositionExpression = (tokens: Token[]): FunctionCompositionExpression => {
  const functionComposition = parseFunctionComposition(tokens);
  const openBracketIndex = tokens.findIndex(
    token => token.type === TokenType.OpenBracket
  );
  if (openBracketIndex === -1) {
    throw new Error('Open bracket not found');
  }
  const args = parseFunctionCallArgs(tokens.slice(openBracketIndex + 1, tokens.length));
  return {
    functionNames: functionComposition,
    args: args
  };
};

const parseTernaryIf = (tokens: Token[]): TernaryIfExpression => {
  const questionIndex = tokens.findIndex(token => token.type === TokenType.QuestionMark);
  if (questionIndex === -1) {
    throw new Error('Question mark not found');
  }
  const colonIndex = tokens.findIndex(token => token.type === TokenType.Colon);
  if (colonIndex === -1) {
    throw new Error('Colon not found');
  }
  const conditionTokens = tokens.slice(0, questionIndex);
  const statementTrueTokens = tokens.slice(questionIndex + 1, colonIndex);
  const statementFalseTokens = tokens.slice(colonIndex + 1, tokens.length + 1);
  const statementCondition = parse(conditionTokens);
  const statementTrue = parse(statementTrueTokens);
  const statementFalse = parse(statementFalseTokens);
  return {
    condition: statementCondition,
    statementTrue: statementTrue,
    statementFalse: statementFalse,
  };
};

const checkIsFunctionExpression = (tokens: Token[]) => {
  const greater = tokens.find(token => token.type === TokenType.Greater);
  const equal = tokens.find(token => token.type === TokenType.Equal);
  return !!greater && !!equal;
};

const checkIsTernaryIfExpression = (tokens: Token[]) => {
  const questionMark = tokens.find(token => token.type === TokenType.QuestionMark);
  const colon = tokens.find(token => token.type === TokenType.Colon);
  return !!colon && !!questionMark;
};

const checkIsFunctionCompositionExpression = (tokens: Token[]) => {
  const openBracket = tokens.find(token => token.type === TokenType.OpenBracket);
  return !!openBracket;
};

const parseAnyTypeExpression = (tokens: Token[]) => {
  const isFunctionExpression = checkIsFunctionExpression(tokens);
  const isFunctionCompositionExpression = checkIsFunctionCompositionExpression(tokens);
  const isTernaryIf = checkIsTernaryIfExpression(tokens);
  if (isFunctionExpression) {
    return parseFunctionExpression(tokens);
  }
  if (isFunctionCompositionExpression) {
    return parseFunctionCompositionExpression(tokens);
  }
  if (isTernaryIf) {
    return parseTernaryIf(tokens);
  }
  return parseExpression(tokens);
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

type StatementType =
  'Assignment' |
  'Expression' |
  'FunctionCompositionExpression' |
  'TernaryIf';

const checkIsAssignment = (tokens: Token[]) => {
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

const parseStatement = (tokens: Token[]): Statement => {
  const isAssignment = checkIsAssignment(tokens);
  if (isAssignment) {
    return {
      type: 'Assignment',
      value: parseAssignment(tokens)
    };
  }
  const isFunctionCompositionExpression = checkIsFunctionCompositionExpression(tokens);
  if (isFunctionCompositionExpression) {
    return {
      type: 'FunctionCompositionExpression',
      value: parseFunctionCompositionExpression(tokens)
    };
  }
  const isTernaryIf = checkIsTernaryIfExpression(tokens);
  if (isTernaryIf) {
    return {
      type: 'TernaryIf',
      value: parseAnyTypeExpression(tokens)
    }
  }
  return {
    type: 'Expression',
    value: parseAnyTypeExpression(tokens)
  }
};

export const parse = (tokens: Token[]): Statement[] => {
  const tokenStatements = splitTokensToStatements(tokens);
  const statements = tokenStatements.map(parseStatement);
  return statements;
};

