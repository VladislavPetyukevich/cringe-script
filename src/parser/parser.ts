import { TokenType, Token } from '../tokenizer';
import { findIndexOfAssignment, parseAssignment } from './assignment';
import { findIndexOfCommentExpression, parseComment } from './comment';
import { parseExpression } from './expression';
import {
  findIndexOfFunctionCompositionExpression,
  findIndexOfFunctionExpression,
  parseFunctionCompositionExpression,
  parseFunctionExpression
} from './function';
import {
  findIndexOfObjectExpression,
  ObjectFieldsParserState,
  parseObjectDefenition
} from './object';
import { findIndexOfTernaryIfExpression, parseTernaryIf } from './ternaryIf';
import {
  findIndexOfCringe,
  parseCringe
} from './cringe';

export interface Statement {
  type: StatementType;
  value:
    Assignment |
    Expression |
    FunctionExpression |
    FunctionCompositionExpression |
    TernaryIfExpression |
    ObjectDefenitionExpression |
    CommentExpression |
    Cringe;
}

export interface FunctionExpression {
  args: Token[];
  body: Statement[];
}

export interface FunctionCompositionExpression {
  functionNames: Token[];
  args: Statement[][];
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

export interface ObjectParserFields {
  name: string;
  value: Statement | ObjectFieldsParserState;
}

export interface ObjectDefenitionExpression {
  fields: ObjectParserFields[];
}

export interface CommentExpression {
  content: string;
}

export interface Cringe {
  content: string;
}

export interface Assignment {
  variableName: string;
  value:
    Expression |
    FunctionExpression |
    FunctionCompositionExpression |
    TernaryIfExpression |
    ObjectDefenitionExpression;
}

export const expectTokenType = (tokenType: TokenType, expectedTokenTypes: TokenType[]) => {
  if (expectedTokenTypes.includes(tokenType)) {
    return true;
  }

  throw new Error('Unxpected token type');
};

const concatTokensStringView = (tokens: Token[]) =>
  tokens.map(token => token.stringView).join('');

const getFirstStatementInOrder = (
  order: Record<StatementType, number>
): StatementType | null =>
  (Object.keys(order) as StatementType[]).reduce<StatementType | null>((minKey, key) => {
    if (order[key] === -1) {
      return minKey;
    }
    if (!minKey) {
      return key;
    }
    if (order[key] < order[minKey]) {
      return key;
    }
    return minKey;
  }, null);

export const parseAnyTypeExpression = (tokens: Token[]) => {
  const statementsOrder = {
    Cringe: -1,
    Comment: -1,
    Assignment: -1,
    FunctionDefinitionExpression: findIndexOfFunctionExpression(tokens),
    FunctionCompositionExpression: findIndexOfFunctionCompositionExpression(tokens),
    TernaryIf: findIndexOfTernaryIfExpression(tokens),
    ObjectDefenition: findIndexOfObjectExpression(tokens),
    Expression: -1,
  };
  const firstStatementType = getFirstStatementInOrder(statementsOrder);
  try {
    switch (firstStatementType) {
      case 'ObjectDefenition':
        return parseObjectDefenition(tokens);
      case 'FunctionCompositionExpression':
        return parseFunctionCompositionExpression(tokens);
      case 'FunctionDefinitionExpression':
        return parseFunctionExpression(tokens);
      case 'TernaryIf':
        return parseTernaryIf(tokens);
      default:
        return parseExpression(tokens);
    }
  } catch (err) {
    throw new Error(`${err.message}\nFor expression:\n${concatTokensStringView(tokens)}\nExpected type of expression: ${firstStatementType}`);
  }
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

type StatementType =
  'Assignment' |
  'Expression' |
  'FunctionCompositionExpression' |
  'FunctionDefinitionExpression' |
  'TernaryIf' |
  'ObjectDefenition' |
  'Comment' |
  'Cringe';

const parseStatement = (tokens: Token[]): Statement => {
  const statementsOrder = {
    Cringe: findIndexOfCringe(tokens),
    Comment: findIndexOfCommentExpression(tokens),
    Assignment: findIndexOfAssignment(tokens),
    FunctionDefinitionExpression: findIndexOfFunctionExpression(tokens),
    FunctionCompositionExpression: findIndexOfFunctionCompositionExpression(tokens),
    TernaryIf: findIndexOfTernaryIfExpression(tokens),
    ObjectDefenition: findIndexOfObjectExpression(tokens),
    Expression: -1,
  };
  const firstStatementType = getFirstStatementInOrder(statementsOrder);
  switch (firstStatementType) {
    case 'Cringe':
      return {
        type: 'Cringe',
        value: parseCringe(tokens)
      };
    case 'Comment':
      return {
        type: 'Comment',
        value: parseComment(tokens)
      };
    case 'Assignment':
      return {
        type: 'Assignment',
        value: parseAssignment(tokens)
      };
    case 'FunctionDefinitionExpression':
      return {
        type: 'FunctionDefinitionExpression',
        value: parseFunctionExpression(tokens)
      };
    case 'FunctionCompositionExpression':
      return {
        type: 'FunctionCompositionExpression',
        value: parseFunctionCompositionExpression(tokens)
      };
    case 'TernaryIf':
      return {
        type: 'TernaryIf',
        value: parseTernaryIf(tokens)
      }
    case 'ObjectDefenition':
      return {
        type: 'ObjectDefenition',
        value: parseObjectDefenition(tokens)
      };
    default:
      return {
        type: 'Expression',
        value: parseAnyTypeExpression(tokens)
      };
  }
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
