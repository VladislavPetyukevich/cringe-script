import {
  Statement,
} from './parser/parser';
import {
  Expression,
} from './parser/expression';
import {
  MathematicalExpression,
  MathematicalExpressionParenthesized
} from './parser/mathematicalExpression';
import {
  Assignment
} from './parser/assignment';
import {
  FunctionDefinition
} from './parser/functionDefinition';
import {
  FunctionCall
} from './parser/functionCall';
import {
  ObjectDefinition
} from './parser/objectDefinition';
import {
  TernaryIf
} from './parser/ternaryIf';
import {
  Comment
} from './parser/comment';
import {
  Cringe
} from './parser/cringe';

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
    case 'Comment':
      return compileComment(expression.value);
    case 'Cringe':
      return compileCringe(expression.value);
    default:
      throw new Error(`Unknown expression type: ${(expression as Expression).type}`);
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

export const compileComment = (
  comment: Comment,
): string => {
  return `// ${comment.content}`;
};

export const compileCringe = (
  cringe: Cringe,
): string => {
  return cringe.content;
};

export const compileMathematicalExpressionParenthesized = (
  expression: MathematicalExpressionParenthesized
): string => {
  return `(${compileMathematicalExpression(expression.expression)})`;
};

const compileMathematicalExpressionLeftOperands = (operands: MathematicalExpression['leftOperand']) => {
  if (Array.isArray(operands)) {
    return operands.map(operand => operand.stringView).join('');
  };
  if (operands.type === 'MathematicalExpressionParenthesized') {
    return compileMathematicalExpressionParenthesized(operands);
  }
  return compileExpression(operands);
}

export const compileMathematicalExpression = (
  expression: MathematicalExpression | MathematicalExpressionParenthesized | null
): string => {
  if (!expression) {
    return '';
  }
  if (expression.type === 'MathematicalExpressionParenthesized') {
    return compileMathematicalExpressionParenthesized(expression);
  }
  const leftStr = compileMathematicalExpressionLeftOperands(expression.leftOperand);
  if (expression.operators === null) {
    return leftStr;
  }
  const operStr = expression.operators.reduce(
    (accum, currVal) => accum + currVal.stringView, ''
    );
  const rightStr = expression.rightOperand ? compileExpression(expression.rightOperand) : '';
  return `${leftStr} ${operStr} ${rightStr}`;
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
      throw new Error(`Unknown statement: ${(statement as Statement).type}`);
  }
};

export const compileStatements = (statements: Statement[], endLine: string) => {
  const compiledStatements = statements.map(statement => {
    const noEndLine =
      statement.value.type === 'Comment' ||
      statement.value.type === 'Cringe';
    return `${compileStatement(statement)}${noEndLine ? '' : endLine}`;
  });
  return compiledStatements;
};

export const compileJS = (statements: Statement[]) => {
  const compiledStatements = compileStatements(statements, ';');
  return compiledStatements.join('\n');
};
