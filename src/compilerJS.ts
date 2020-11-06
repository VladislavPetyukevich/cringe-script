import { Statement, Assignment, Expression } from './parser';

const compileExpression = (expression: Expression) => {
  if (expression.operator === null) {
    return expression.leftOperand.stringView;
  }
  
  const leftStr = expression.leftOperand.stringView;
  const operStr = expression.operator.stringView;
  return `${leftStr} ${operStr} ${compileExpression(expression.rightOperand)}`;
};

const compileAssignment = (assignment: Assignment) => {
  const expression = compileExpression(assignment.value);
  return `const ${assignment.variableName} = ${expression};`;
};

const compileStatement = (statement: Statement) => {
  switch (statement.type) {
    case 'Assignment':
      return compileAssignment(statement.value);
    default:
      throw new Error(`Unknown statement: ${statement.type}`);
  }
};

export const compileJS = (statements: Statement[]) => {
  const compiledStatements = statements.map(
    statement => compileStatement(statement)
  );
  return compiledStatements.join('\n');
};

