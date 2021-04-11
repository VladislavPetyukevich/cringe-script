import {
  Statement,
  Assignment,
  Expression,
  FunctionCompositionExpression,
  TernaryIfExpression,
  ObjectDefenitionExpression,
  CommentExpression,
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
    .join('\n');
  return `(${args}) => ${body}`;
};

const compileTernaryIfExpression = (expression: Expression) => {
  const conditionExpression = expression.condition[0].value;
  const conditionView = compileAnyTypeExpression(conditionExpression);
  const statementTrueExpression = expression.statementTrue[0].value;
  const statementTrueView = compileAnyTypeExpression(statementTrueExpression);
  const statementFalseExpression = expression.statementFalse[0].value;
  const statementFalseView = compileAnyTypeExpression(statementFalseExpression);
  return `(${conditionView}) ? ${statementTrueView} : ${statementFalseView}`;
};

const checkIsFunctionExpression = (expression: Expression) => {
  return !!expression.args;
};

const checkIsFunctionCompositionExpression = (expression: Expression) => {
  return !!expression.functionNames;
};

const checkIsTernaryIfExpression = (expression: Expression) => {
  return !!expression.condition;
};

const checkIsObjectDefenitionExpression = (expression: Expression) => {
  return !!expression.fields;
};

const compileAnyTypeExpression = (expression: Expression) => {
  const isFunctionExpression = checkIsFunctionExpression(expression);
  const isFunctionCompositionExpression = checkIsFunctionCompositionExpression(expression);
  const isTernaryIfExpression = checkIsTernaryIfExpression(expression);
  const isObjectDefenitionExpression = checkIsObjectDefenitionExpression(expression);
  if (isFunctionCompositionExpression) {
    return compileFunctionComposition(expression);
  }
  if (isFunctionExpression) {
    return compileFunctionExpression(expression);
  }
  if (isTernaryIfExpression) {
    return compileTernaryIfExpression(expression);
  }
  if (isObjectDefenitionExpression) {
    return compileObjectDefenition(expression, 1);
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
    .join(')(');
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

const getIndentView = (nestedLevel: number) => {
  return Array.from({ length: nestedLevel }, () => '  ').join('');
};

const compileObjectDefenition = (expression: ObjectDefenitionExpression, nestedLevel: number) => {
  const indentViewInside = getIndentView(nestedLevel);
  const objectFieldsView = expression.fields.reduce((accum, field) => {
    const fieldValue = field.value.value;
    const fieldValueView =
      ('fields' in fieldValue.leftOperand) ?
      compileObjectDefenition(field.value.value.leftOperand, nestedLevel + 1) :
      compileAnyTypeExpression(field.value.value);
    return [...accum, `${indentViewInside}${field.name}: ${fieldValueView}`];
  }, []).join(',\n');
  const indentViewOutside = getIndentView(nestedLevel - 1);
  return `{\n${objectFieldsView}\n${indentViewOutside}}`;
};

const compileComment = (expression: CommentExpression) => {
  return `// ${expression.content}`;
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
    case 'ObjectDefenition':
      return compileObjectDefenition(statement.value, 1);
    case 'Comment':
      return compileComment(statement.value);
    default:
      throw new Error(`Unknown statement: ${statement.type}`);
  }
};

export const compileJS = (statements: Statement[]) => {
  const compiledStatements = statements.map(statement => {
    const endLine = (statement.type === 'Comment') ? '' : ';';
    return `${compileStatement(statement)}${endLine}`;
  }
  );
  return compiledStatements.join('\n');
};

