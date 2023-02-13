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

export type Expression = {
  type: 'FunctionDefinition';
  value: FunctionDefinition;
} | {
  type: 'FunctionCall';
  value: FunctionCall;
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
