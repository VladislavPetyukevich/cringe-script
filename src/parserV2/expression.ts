import { Token } from '../tokenizer';
import {
  checkIsFunctionDefinition,
  FunctionDefinition,
  parseFunctionDefinition
} from './functionDefinition';
import {
  MathematicalExpression,
  MathematicalExpressionParenthesized,
  parseMathematicalExpression
} from './mathematicalExpression';

export type Expression = {
  type: 'FunctionDefinition';
  value: FunctionDefinition;
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
  return {
    type: 'MathematicalExpression',
    value: parseMathematicalExpression(tokens),
  };
};
