import { tokenize } from './tokenizer';
import { parse } from './parser';
import { compileJS } from './compilerJS';

const programText = `
count = 5
countX2 = 5 * 2
sum = a => b => a + b
pow2 = a => a * a
res = pow2,sum(count)(countX2)
countX3 = 5-3*2/23+ 6
str = \'a\' + \'b\'
countIf = 5 > 3 ? 5 : 3
{
  first: 3
  second: 5
}
`;

const tokens = tokenize(programText);
console.log('tokens: ', tokens);
const statements = parse(tokens);
console.log('statements: ', JSON.stringify(statements));
const compiledStatements = compileJS(statements);
console.log('compiledStatements:');
console.log(compiledStatements);

