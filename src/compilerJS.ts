import {
  Statement,
  Assignment,
  Expression,
  FunctionCompositionExpression,
  TernaryIfExpression,
} from './parser';

const compileExpression = (expression: Expression) => {
  if (expression.operator === null) {
    return expression.leftOperand.stringView;
  }
  
  const leftStr = expression.leftOperand.stringView;
  const operStr = expression.operator.reduce(
    (accum, currVal) => currVal.stringView + accum,
    '');
  return `${leftStr} ${operStr} ${compileExpression(expression.rightOperand)}`;
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

const checkIsFunctionCompositionExpression = (expression: Expression) => {
  return !!expression.functionNames;
};

const compileAnyTypeExpression = (expression: Expression) => {
  const isFunctionExpression = checkIsFunctionExpression(expression);
  const isFunctionCompositionExpression = checkIsFunctionCompositionExpression(expression);
  if (isFunctionCompositionExpression) {
    return compileFunctionComposition(expression);
  }
  if (isFunctionExpression) {
    return compileFunctionExpression(expression);
  }
  return compileExpression(expression);
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

const compileTernaryIf = (expression: TernaryIfExpression) => {
  if (expression.condition.length !== 1) {
    throw new Error('Invalid condition statements count in ternary if');
  }
  if (expression.statementTrue.length !== 1) {
    throw new Error('Invalid statements count in ternary if true');
  }
  if (expression.statementFalse.length !== 1) {
    throw new Error('Invalid statements count in ternary if false');
  }
  const conditionView = compileStatement(expression.condition[0]);
  const statementTrueView = compileStatement(expression.statementTrue[0]);
  const statementFalseView = compileStatement(expression.statementFalse[0]);
  return `${conditionView} ? ${statementTrueView} : ${statementFalseView}`;
};

const compileStatement = (statement: Statement) => {
  switch (statement.type) {
    case 'Assignment':
      return compileAssignment(statement.value);
    case 'Expression':
      return compileAnyTypeExpression(statement.value);
    case 'FunctionCompositionExpression':
      return compileFunctionComposition(statement.value);
    case 'TernaryIf':
      return compileTernaryIf(statement.value);
    default:
      throw new Error(`Unknown statement: ${statement.type}`);
  }
};

export const compileJS = (statements: Statement[]) => {
  const compiledStatements = statements.map(
    statement => `${compileStatement(statement)};`
  );
  return compiledStatements.join('\n');
};

