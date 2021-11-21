import { expect } from 'chai';
import { getToken } from '../tokenizer';
import {
  parseComment,
  checkIsCommentExpression
} from '../parser/comment';

describe('Parser comment', function() {
  it('parse comment', function() {
    const expected = {
      content: '5+69'
    };

    const result = parseComment([
      getToken('/'),
      getToken('/'),
      getToken('5'),
      getToken('+'),
      getToken('69')
    ]);

    expect(result).deep.equal(expected);
  });

  it('check is comment', function() {
    expect(checkIsCommentExpression([
    ])).equal(false);

    expect(checkIsCommentExpression([
      getToken('/'),
      getToken('/'),
      getToken('5'),
      getToken('+'),
      getToken('69'),
    ])).equal(true);

    expect(checkIsCommentExpression([
      getToken('/'),
      getToken('5'),
      getToken('+'),
      getToken('69'),
    ])).equal(false);
  });
});

