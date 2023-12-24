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
  type: 'MathematicalExpression';
  value: MathematicalExpression | MathematicalExpressionParenthesized;
};

export const parseExpression = (
  tokens: Token[]
): Expression => {
  const isFunctionDefinition = checkIsFunctionDefinition(tokens);
  const isObjectDefinition = checkIsObjectDefinition(tokens);
  if (isFunctionDefinition) {
    return {
      type: 'FunctionDefinition',
      value: parseFunctionDefinition(tokens),
    }
  }
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
    }
  }
  return {
    type: 'MathematicalExpression',
    value: parseMathematicalExpression(tokens),
  };
};
