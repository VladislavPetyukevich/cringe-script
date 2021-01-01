import { Statement, Assignment, Expression, FunctionCompositionExpression } from './parser';

const compileExpression = (expression: Expression) => {
  if (expression.operator === null) {
    return expression.leftOperand.stringView;
  }
  
  const leftStr = expression.leftOperand.stringView;
  const operStr = expression.operator.stringView;
  return `${leftStr} ${operStr} ${compileExpression(expression.rightOperand)};`;
};

const compileFunctionExpression = (expression: Expression) => {
  const args = expression.args
    .map(arg => arg.stringView)
    .join(', ');
  const body = expression.body
    .map(bodyStatement => compileStatement(bodyStatement))
    .map((bodyStatement, index, bodyStatements) => {
      if (index === bodyStatements.length - 1) {
        return `return ${bodyStatement}`;
      }
      return bodyStatement;
    })
    .join('\n');
  return `(${args}) => {\n${body}\n}`;
};

const checkIsFunctionExpression = (expression: Expression) => {
  return !!expression.args;
};

const compileAnyTypeExpression = (expression: Expression) => {
  const isFunctionExpression = checkIsFunctionExpression(expression);
  if (isFunctionExpression) {
    return compileFunctionExpression(expression);
  } else {
    return compileExpression(expression);
  }
};

const compileAssignment = (assignment: Assignment) => {
  const expression = compileAnyTypeExpression(assignment.value);
  return `const ${assignment.variableName} = ${expression}`;
};

const compileFunctionComposition = (expression: FunctionCompositionExpression) => {
  const argsView = expression.args
    .map(arg => arg.stringView)
    .join(', ');
  const functionNameViews = expression.functionNames.map(funName => funName.stringView);
  const views = [...functionNameViews, argsView];
  console.log('views :', views );
  const reduceViews = (views: string[]) => {
    const currView = views[0];
    if (views.length === 1) {
      return currView;
    }
    return `${currView}(${reduceViews(views.slice(1, views.length))})`;
  };
  const viewsReduced = reduceViews(views);
  return viewsReduced;
};

const compileStatement = (statement: Statement) => {
  switch (statement.type) {
    case 'Assignment':
      return compileAssignment(statement.value);
    case 'Expression':
      return compileAnyTypeExpression(statement.value);
    case 'FunctionCompositionExpression':
      return compileFunctionComposition(statement.value);
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

