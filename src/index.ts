import { tokenize } from './tokenizer';
import { parse } from './parser/parser';
import { compileJS } from './compilerJS';

const programText = `
// some program comment
count = 1
countX2 = 5 * 2
sum = a => b => a + b
pow2 = a => a * a
res = pow2,sum(count)(countX2)
🤣 console.log('res:', res);
countX3 = 5-3*2/23+ 6
str = \'a\' + \'b\'
CRINGE console.log('res:', res);
countIf = 5 > 3 ? 5 : 3
🤣 {
  console.log('count:', count);
  console.log('countX2:', countX2);
  console.log('countX3:', countX3);
}
pair = {
  first: 3
  second: {
    first: 5
    second: {
      first: 8
      second: 13
    }
    additional: 123
  }
}
CRINGE {
  console.log('hi, my name is 🤣');
  console.log('pair:', pair);
}
countDown = value => otherFn(value - 1)
`;

const tokens = tokenize(programText);
console.log('tokens: ', tokens);
const statements = parse(tokens);
console.log('statements: ', JSON.stringify(statements));
const compiledStatements = compileJS(statements);
console.log('compiledStatements:');
console.log(compiledStatements);
console.log('--------');
console.log('JS code execution result:');
eval(compiledStatements);

