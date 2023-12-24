import { Token } from '../tokenizer';
import {
  checkIsFunctionDefinition,
  FunctionDefinition,
  parseFunctionDefinition
} from './functionDefinition';
import {
  checkIsFunctionCall,
  FunctionCall,
  parseFunctionCall
} from './functionCall';
import {
  MathematicalExpression,
  MathematicalExpressionParenthesized,
  parseMathematicalExpression
} from './mathematicalExpression';
import {
  checkIsObjectDefinition,
  ObjectDefinition,
  parseObjectDefinition
} from './objectDefinition';
import {
  checkIsTernaryIf,
  parseTernaryIf,
  TernaryIf
} from './ternaryIf';
import {
  checkIsComment,
  Comment,
  parseComment
} from './comment';

export type Expression = {
  type: 'FunctionDefinition';
  value: FunctionDefinition;
} | {
  type: 'FunctionCall';
  value: FunctionCall;
} | {
  type: 'ObjectDefinition';
  value: ObjectDefinition;
} | {
  type: 'TernaryIf';
  value: TernaryIf;
} | {
  type: 'Comment';
  value: Comment;
} | {
  type: 'MathematicalExpression';
  value: MathematicalExpression | MathematicalExpressionParenthesized;
};

export const parseExpression = (
  tokens: Token[]
): Expression => {
  const isFunctionDefinition = checkIsFunctionDefinition(tokens);
  if (isFunctionDefinition) {
    return {
      type: 'FunctionDefinition',
      value: parseFunctionDefinition(tokens),
    }
  }
  const isObjectDefinition = checkIsObjectDefinition(tokens);
  if (isObjectDefinition) {
    return {
      type: 'ObjectDefinition',
      value: parseObjectDefinition(tokens),
    };
  }
  const isFunctionCall = checkIsFunctionCall(tokens);
  if (isFunctionCall) {
    return {
      type: 'FunctionCall',
      value: parseFunctionCall(tokens),
    };
  }
  const isTernaryIf = checkIsTernaryIf(tokens);
  if (isTernaryIf) {
    return {
      type: 'TernaryIf',
      value: parseTernaryIf(tokens),
    };
  }
  const isComment = checkIsComment(tokens);
  if (isComment) {
    return {
      type: 'Comment',
      value: parseComment(tokens),
    };
  }
  return {
    type: 'MathematicalExpression',
    value: parseMathematicalExpression(tokens),
  };
};
