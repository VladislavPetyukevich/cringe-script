import { tokenize } from './tokenizer';
import { parse } from './parser/parser';
import { compileJS } from './compilerJS';

const programText = `
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
`;

const tokens = tokenize(programText);
console.log('tokens: ', tokens);
const statements = parse(tokens);
console.log('statements: ', JSON.stringify(statements));
const compiledStatements = compileJS(statements);
console.log('compiledStatements:');
console.log(compiledStatements);

