import { expect } from 'chai';
import {
  removeBlankLines,
  TokenType,
  getTokenType,
  getComplexTokenType,
  getToken,
  tokenize,
} from '../tokenizer';

describe('tokenizer', function() {
  it('remove unnecessary blank lines', function() {
    const source1 = '\ntest\n\ntest2\n\n  aaa  \n\n\n';
    expect(removeBlankLines(source1)).equal('test\ntest2\n  aaa  \n');
  });

  it('get basic token type', function() {
    expect(getTokenType('=')).equal(TokenType.Equal);
    expect(getTokenType('*')).equal(TokenType.Multiply);
    expect(getTokenType('/')).equal(TokenType.Devide);
    expect(getTokenType('+')).equal(TokenType.Plus);
    expect(getTokenType('-')).equal(TokenType.Minus);
    expect(getTokenType('\'')).equal(TokenType.Quote);
    expect(getTokenType(',')).equal(TokenType.Comma);
    expect(getTokenType('{')).equal(TokenType.OpenBrace);
    expect(getTokenType('}')).equal(TokenType.CloseBrace);
    expect(getTokenType('(')).equal(TokenType.OpenBracket);
    expect(getTokenType('>')).equal(TokenType.Greater);
    expect(getTokenType('<')).equal(TokenType.Less);
    expect(getTokenType('!')).equal(TokenType.ExclamationMark);
    expect(getTokenType(':')).equal(TokenType.Colon);
    expect(getTokenType('?')).equal(TokenType.QuestionMark);
    expect(getTokenType('\n')).equal(TokenType.NewLine);
  });

  it('get complex token type', function() {
    expect(getComplexTokenType('\'abc\'')).equal(TokenType.Str);
    expect(getComplexTokenType('num')).equal(TokenType.Name);
    expect(getComplexTokenType('123')).equal(TokenType.Num);
  });

  it('get token', function() {
    expect(getToken('wasd')).deep.equal({
      type: TokenType.Name,
      stringView: 'wasd',
    });
    expect(getToken('\'test\'')).deep.equal({
      type: TokenType.Str,
      stringView: '\'test\'',
    });
    expect(getToken('00123')).deep.equal({
      type: TokenType.Num,
      stringView: '00123',
    });
    expect(getToken('?')).deep.equal({
      type: TokenType.QuestionMark,
      stringView: '?',
    });
  });

  it('tokenize', function() {
    const source1 = 'num = 5';
    const result1 = [
      { type: TokenType.Name, stringView: 'num' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Num, stringView: '5' },
    ];
    expect(tokenize(source1)).deep.equal(result1);
    const source2 = '\nnum = 5\n';
    const result2 = [
      { type: TokenType.Name, stringView: 'num' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.NewLine, stringView: '\n' },
    ];
    expect(tokenize(source2)).deep.equal(result2);
    const source3 = 'str = \'test\'';
    const result3 = [
      { type: TokenType.Name, stringView: 'str' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Str, stringView: '\'test\'' },
    ];
    expect(tokenize(source3)).deep.equal(result3);
    const source4 = 'sum = a => b => a + b';
    const result4 = [
      { type: TokenType.Name, stringView: 'sum' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Name, stringView: 'a' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Name, stringView: 'b' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Name, stringView: 'a' },
      { type: TokenType.Plus, stringView: '+' },
      { type: TokenType.Name, stringView: 'b' },
    ];
    expect(tokenize(source4)).deep.equal(result4);
    const source5 = `
      pair = {
        first: 3
        second: {
          first: 5
          second: 8
        }
      }
    `;
    const result5 = [
      { type: TokenType.Name, stringView: 'pair' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '3' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '8' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.CloseBrace, stringView: '}' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.CloseBrace, stringView: '}' },
      { type: TokenType.NewLine, stringView: '\n' },
    ];
    expect(tokenize(source5)).deep.equal(result5);
  });
});

