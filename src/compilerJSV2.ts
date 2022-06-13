import {
  Statement,
} from './parserV2/parserV2';
import { Expression, ExpressionParenthesized } from './parserV2/expression';

export const compileExpressionParenthesized= (expression: ExpressionParenthesized): string => {
  return `(${compileExpression(expression.expression)})`;
};

export const compileExpression = (expression: Expression | ExpressionParenthesized | null): string => {
  if (!expression) {
    return '';
  }
  if (expression.type === 'ExpressionParenthesized') {
    return compileExpressionParenthesized(expression);
  }
  if (expression.operators === null) {
    return expression.leftOperand.stringView;
  }
  
  const leftStr = expression.leftOperand.stringView;
  const operStr = expression.operators.reduce(
    (accum, currVal) => currVal.stringView + accum,
    '');
  return `${leftStr} ${operStr} ${compileExpression(expression.rightOperand)}`;
};

export const compileStatement = (statement: Statement) => {
  switch (statement.type) {
    case 'Expression':
      return compileExpression(statement.value);
      case 'ExpressionParenthesized':
        return compileExpressionParenthesized(statement.value);
    default:
      throw new Error(`Unknown statement: ${statement.type}`);
  }
};

export const compileStatements = (statements: Statement[], endLine: string) => {
  const compiledStatements = statements.map(statement => {
    return `${compileStatement(statement)}${endLine}`;
  });
  return compiledStatements;
};

export const compileJS = (statements: Statement[]) => {
  const compiledStatements = compileStatements(statements, ';');
  return compiledStatements.join('\n');
};
