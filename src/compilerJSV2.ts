import {
  Statement,
} from './parserV2/parserV2';
import { Expression, ExpressionParenthesized } from './parserV2/expression';
import { Assignment } from './parserV2/assignment';

export const compileExpressionParenthesized= (
  expression: ExpressionParenthesized
): string => {
  return `(${compileExpression(expression.expression)})`;
};

export const compileExpression = (
  expression: Expression | ExpressionParenthesized | null
): string => {
  if (!expression) {
    return '';
  }
  if (expression.type === 'ExpressionParenthesized') {
    return compileExpressionParenthesized(expression);
  }
  const leftStr = (expression.leftOperand.type === 'ExpressionParenthesized') ?
    compileExpressionParenthesized(expression.leftOperand) :
    expression.leftOperand.stringView;
  if (expression.operators === null) {
    return leftStr;
  }
  const operStr = expression.operators.reduce(
    (accum, currVal) => currVal.stringView + accum, ''
  );
  return `${leftStr} ${operStr} ${compileExpression(expression.rightOperand)}`;
};

export const compileAssignment = (
  assignment: Assignment
): string => {
  return `${assignment.variableName} = ${compileExpression(assignment.value)}`;
};

export const compileStatement = (statement: Statement) => {
  switch (statement.type) {
    case 'Expression':
      return compileExpression(statement.value);
    case 'Assignment':
      return compileAssignment(statement.value);
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
