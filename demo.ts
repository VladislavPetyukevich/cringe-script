import path from 'path';
import fs from 'fs';
import {
  tokenize,
  parse,
  compileJS,
} from './src';

const sourceCodeFilePath = path.resolve('./demo.cringeS');
const sourceCode = fs.readFileSync(sourceCodeFilePath).toString();

const tokens = tokenize(sourceCode);
console.log('tokens: ', tokens);
const statements = parse(tokens);
console.log('statements: ', JSON.stringify(statements));
const compiledStatements = compileJS(statements);
console.log('compiledStatements:');
console.log(compiledStatements);
// console.log('--------');
// console.log('JS code execution result:');
// eval(compiledStatements);
