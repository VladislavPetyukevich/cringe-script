import {
  Statement,
  Assignment,
  Expression,
  FunctionCompositionExpression,
  TernaryIfExpression,
  ObjectDefenitionExpression,
  CommentExpression,
  FunctionExpression,
  ObjectParserFields,
} from './parser';

type AnyTypeExpression =
  Assignment |
  Expression |
  FunctionExpression |
  FunctionCompositionExpression |
  TernaryIfExpression |
  ObjectDefenitionExpression |
  CommentExpression;

const compileExpression = (expression: Expression | null): string => {
  if (!expression) {
    return '';
  }
  if (expression.operator === null) {
    return expression.leftOperand.stringView;
  }
  
  const leftStr = expression.leftOperand.stringView;
  const operStr = expression.operator.reduce(
    (accum, currVal) => currVal.stringView + accum,
    '');
  return `${leftStr} ${operStr} ${compileExpression(expression.rightOperand)}`;
};

const compileFunctionExpression = (expression: FunctionExpression): string => {
  const args = expression.args
    .map(arg => arg.stringView)
    .join(', ');
  const body = expression.body
    .map(bodyStatement => compileStatement(bodyStatement))
    .join('\n');
  return `(${args}) => ${body}`;
};

const compileTernaryIfExpression = (expression: TernaryIfExpression): string => {
  const conditionExpression = expression.condition[0].value;
  const conditionView = compileAnyTypeExpression(conditionExpression);
  const statementTrueExpression = expression.statementTrue[0].value;
  const statementTrueView = compileAnyTypeExpression(statementTrueExpression);
  const statementFalseExpression = expression.statementFalse[0].value;
  const statementFalseView = compileAnyTypeExpression(statementFalseExpression);
  return `(${conditionView}) ? ${statementTrueView} : ${statementFalseView}`;
};

const checkIsFunctionExpression = (expression: AnyTypeExpression) => {
  return 'args' in expression;
};

const checkIsFunctionCompositionExpression = (expression: AnyTypeExpression) => {
  return 'functionNames' in expression;
};

const checkIsTernaryIfExpression = (expression: AnyTypeExpression) => {
  return 'condition' in expression;
};

const checkIsObjectDefenitionExpression = (expression: AnyTypeExpression) => {
  return 'fields' in expression;
};

const compileAnyTypeExpression = (expression: AnyTypeExpression): string => {
  const isFunctionExpression = checkIsFunctionExpression(expression);
  const isFunctionCompositionExpression = checkIsFunctionCompositionExpression(expression);
  const isTernaryIfExpression = checkIsTernaryIfExpression(expression);
  const isObjectDefenitionExpression = checkIsObjectDefenitionExpression(expression);
  if (isFunctionCompositionExpression) {
    return compileFunctionComposition(expression as FunctionCompositionExpression);
  }
  if (isFunctionExpression) {
    return compileFunctionExpression(expression as FunctionExpression);
  }
  if (isTernaryIfExpression) {
    return compileTernaryIfExpression(expression as TernaryIfExpression);
  }
  if (isObjectDefenitionExpression) {
    return compileObjectDefenition(expression as ObjectDefenitionExpression, 1);
  }
  return compileExpression(expression as Expression);
};

const compileAssignment = (assignment: Assignment) => {
  const expression = compileAnyTypeExpression(assignment.value);
  return `const ${assignment.variableName} = ${expression}`;
};

const compileFunctionComposition = (expression: FunctionCompositionExpression) => {
  const argsView = expression.args
    .map(arg => compileStatements(arg, ''))
    .join(')(');
  const functionNameViews = expression.functionNames.map(funName => funName.stringView);
  const views = [...functionNameViews, argsView];
  const reduceViews = (views: string[]): string => {
    const currView = views[0];
    if (views.length === 1) {
      return currView;
    }
    return `${currView}(${reduceViews(views.slice(1, views.length))})`;
  };
  const viewsReduced = reduceViews(views);
  return viewsReduced;
};

const compileTernaryIf = (expression: TernaryIfExpression): string => {
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

const compileObjectDefenition = (expression: ObjectDefenitionExpression, nestedLevel: number): string => {
  const indentViewInside = getIndentView(nestedLevel);
  const objectFieldsView = expression.fields.reduce((accum: string[], field: ObjectParserFields): string[] => {
    const fieldValue = field.value;
    const fieldValueView =
        ('fields' in fieldValue) ?
        compileObjectDefenition(fieldValue, nestedLevel + 1) :
        compileStatement(fieldValue);
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
      return compileAssignment(statement.value as Assignment);
    case 'Expression':
      return compileAnyTypeExpression(statement.value as Expression);
    case 'FunctionCompositionExpression':
      return compileFunctionComposition(statement.value as FunctionCompositionExpression);
    case 'TernaryIf':
      return compileTernaryIf(statement.value as TernaryIfExpression);
    case 'ObjectDefenition':
      return compileObjectDefenition(statement.value as ObjectDefenitionExpression, 1);
    case 'Comment':
      return compileComment(statement.value as CommentExpression);
    default:
      throw new Error(`Unknown statement: ${statement.type}`);
  }
};

const compileStatements = (statements: Statement[], endLine: string) => {
  const compiledStatements = statements.map(statement => {
    const endLn = (statement.type === 'Comment') ? '' : endLine;
    return `${compileStatement(statement)}${endLn}`;
  });
  return compiledStatements;
};

export const compileJS = (statements: Statement[]) => {
  const compiledStatements = compileStatements(statements, ';');
  return compiledStatements.join('\n');
};

