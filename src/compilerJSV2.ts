import {
  Statement,
} from './parserV2/parserV2';
import {
  Expression,
} from './parserV2/expression';
import {
  MathematicalExpression,
  MathematicalExpressionParenthesized
} from './parserV2/mathematicalExpression';
import {
  Assignment
} from './parserV2/assignment';
import {
  FunctionDefinition
} from './parserV2/functionDefinition';

export const compileExpression = (
  expression: Expression
): string => {
  switch (expression.type) {
    case 'MathematicalExpression':
      return compileMathematicalExpression(expression.value);
    case 'FunctionDefinition':
      return compileFunctionDefinition(expression.value);
    default:
      throw new Error(`Unknown expression type: ${expression.type}`);
  }
};

export const compileFunctionDefinition = (
  functionDefinition: FunctionDefinition
): string => {
  return `${functionDefinition.arg} => ${compileExpression(functionDefinition.body)}`;
};

export const compileMathematicalExpressionParenthesized= (
  expression: MathematicalExpressionParenthesized
): string => {
  return `(${compileMathematicalExpression(expression.expression)})`;
};

export const compileMathematicalExpression = (
  expression: MathematicalExpression | MathematicalExpressionParenthesized | null
): string => {
  if (!expression) {
    return '';
  }
  if (expression.type === 'MathematicalExpressionParenthesized') {
    return compileMathematicalExpressionParenthesized(expression);
  }
  const leftStr = (expression.leftOperand.type === 'MathematicalExpressionParenthesized') ?
    compileMathematicalExpressionParenthesized(expression.leftOperand) :
    expression.leftOperand.stringView;
  if (expression.operators === null) {
    return leftStr;
  }
  const operStr = expression.operators.reduce(
    (accum, currVal) => currVal.stringView + accum, ''
  );
  return `${leftStr} ${operStr} ${compileMathematicalExpression(expression.rightOperand)}`;
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
