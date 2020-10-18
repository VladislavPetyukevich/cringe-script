import { tokenize } from './tokenizer';
import { parse } from './parser';
import { compileJS } from './compilerJS';

// const programText = `
// count = 5
// countX2 = 5 * 2
// sum = a,b {
//   a + b
// }
// countX3 = 5-3*2/23+ 6
// str = \'a\' + \'b\'
// `;
const programText = `
sum2 = a,b {
  num = a + b
  num + num
}
`;

const tokens = tokenize(programText);
console.log('tokens: ', tokens);
const statements = parse(tokens);
console.log('statements: ', JSON.stringify(statements));
const compiledStatements = compileJS(statements);
console.log('compiledStatements:');
console.log(compiledStatements);

