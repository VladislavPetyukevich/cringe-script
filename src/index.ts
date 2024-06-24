import { tokenize } from './tokenizer';
import { parse } from './parser/parser';
import { compileJS } from './compilerJS';

const compileSourceToJs = (sourceCode: string) => {
  const tokens = tokenize(sourceCode);
  const statements = parse(tokens);
  const compiledStatements = compileJS(statements);
  return compiledStatements;
}

export { compileSourceToJs, tokenize, parse, compileJS };
