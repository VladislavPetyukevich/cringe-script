import { tokenize } from './tokenizer';
import { parse } from './parser';

const programText = `
count = 5
countX2 = 5 * 2
countX3 = 5-3*2/23+ 6
`;

const tokens = tokenize(programText);
console.log('tokens: ', tokens);
parse(tokens);

