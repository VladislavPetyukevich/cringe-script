import { tokenize } from './tokenizer';

const programText = `
count = 5
countX2 = 5 * 2
countX3 = 5*3
`;

const tokens = tokenize(programText);
console.log('tokens: ', tokens);

