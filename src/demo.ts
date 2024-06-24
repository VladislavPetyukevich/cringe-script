import {
  tokenize,
  parse,
  compileJS,
} from './index';

const sourceCode = `
counterUp = current => max => callback => current <= max ? callback(current) || counterUp(current + 1)(max)(callback) : current
counterDown = initial => callback => initial > 0 ? callback(initial) || counterDown(initial - 1)(callback) : initial

printRow = row => console.log(('🤣 ').repeat(row))

start = 1
end = 7

counterUp(start)(end - 1)(printRow)
counterDown(end)(printRow)
`;

const tokens = tokenize(sourceCode.trim());
console.log('tokens: ', tokens);
const statements = parse(tokens);
console.log('statements: ', JSON.stringify(statements, undefined, '  '));
const compiledStatements = compileJS(statements);
console.log('compiledStatements:');
console.log(compiledStatements);
console.log('--------');
console.log('JS code execution result:');
eval(compiledStatements);
