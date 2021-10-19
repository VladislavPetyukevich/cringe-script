import { expect } from 'chai';
import { TokenType } from '../tokenizer';
import {
  parseComment,
  checkIsCommentExpression
} from '../parser/comment';

describe('Parser comment', function() {
  it('parse comment', function() {
    const expected = {
      content: '5+69'
    };

    const result = parseComment([{
      type: TokenType.Devide,
      stringView: '/'
    }, {
      type: TokenType.Devide,
      stringView: '/'
    }, {
      type: TokenType.Num,
      stringView: '5'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '69'
    }]);

    expect(result).deep.equal(expected);
  });

  it('check is comment', function() {
    expect(checkIsCommentExpression([
    ])).equal(false);

    expect(checkIsCommentExpression([{
      type: TokenType.Devide,
      stringView: '/'
    }, {
      type: TokenType.Devide,
      stringView: '/'
    }, {
      type: TokenType.Num,
      stringView: '5'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '69'
    }])).equal(true);

    expect(checkIsCommentExpression([{
      type: TokenType.Devide,
      stringView: '/'
    }, {
      type: TokenType.Num,
      stringView: '5'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '69'
    }])).equal(false);
  });
});

