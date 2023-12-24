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
import {
  FunctionCall
} from './parserV2/functionCall';
import {
  ObjectDefinition
} from './parserV2/objectDefinition';
import {
  TernaryIf
} from './parserV2/ternaryIf';

export const compileExpression = (
  expression: Expression,
  nestedLevel = 1,
): string => {
  switch (expression.type) {
    case 'MathematicalExpression':
      return compileMathematicalExpression(expression.value);
    case 'FunctionDefinition':
      return compileFunctionDefinition(expression.value);
    case 'FunctionCall':
      return compileFunctionCall(expression.value);
    case 'ObjectDefinition':
      return compileObjectDefinition(expression.value, nestedLevel);
    case 'TernaryIf':
      return compileTernaryIf(expression.value);
    default:
      throw new Error(`Unknown expression type: ${expression.type}`);
  }
};

export const compileFunctionDefinition = (
  functionDefinition: FunctionDefinition
): string => {
  return `${functionDefinition.arg} => ${compileExpression(functionDefinition.body)}`;
};

export const compileFunctionCall = (
  functionCall: FunctionCall
): string => {
  const argument = compileExpression(functionCall.argument);
  if ('name' in functionCall) {
    return `${functionCall.name}(${argument})`;
  }
  return `${compileFunctionCall(functionCall.prevFunctionCall)}(${argument})`;
};

const tabsForLevel = 2;

const getTabs = (nestedLevel = 1) =>
  Array.from({ length: nestedLevel * tabsForLevel }, () => ' ')
    .join('');

export const compileObjectDefinition = (
  objectDefinition: ObjectDefinition,
  nestedLevel = 1,
): string => {
  const inner = objectDefinition.fields
    .map(
      field => `${getTabs(nestedLevel)}${field.name}: ${compileExpression(field.value, nestedLevel + 1)}`
    )
    .map(line => `${line},`)
    .join('\n');
  return `{\n${inner}\n${getTabs(nestedLevel - 1)}}`
};

export const compileTernaryIf = (
  ternaryIf: TernaryIf,
): string => {
  const condition = compileExpression(ternaryIf.condition);
  const trueBranch = compileExpression(ternaryIf.trueBranch);
  const falseBranch = compileExpression(ternaryIf.falseBranch);
  return `${condition} ? ${trueBranch} : ${falseBranch}`;
};

export const compileMathematicalExpressionParenthesized = (
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
  return `const ${assignment.variableName} = ${compileExpression(assignment.value)}`;
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
