import { tokenize } from './tokenizer';
import { parse } from './parserV2/parserV2';
import { compileJS } from './compilerJSV2';

const compileSourceToJs = (sourceCode: string) => {
  const tokens = tokenize(sourceCode);
  const statements = parse(tokens);
  const compiledStatements = compileJS(statements);
  return compiledStatements;
}

export { compileSourceToJs, tokenize, parse, compileJS };

