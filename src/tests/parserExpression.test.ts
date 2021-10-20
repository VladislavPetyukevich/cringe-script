import { expect } from 'chai';
import { TokenType } from '../tokenizer';
import {
  parseOperators,
  parseExpression
} from '../parser/expression';

describe('Parser expression', function() {
  it('parse operators', function() {
    expect(parseOperators([])).deep.equal([]);

    const result1 = parseOperators([{
      type: TokenType.Name,
      stringView: 'n'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Equal,
      stringView: '='
    }, {
      type: TokenType.Num,
      stringView: '6'
    }]);
    const expected1 = [{
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Equal,
      stringView: '='
    }];
    expect(result1).deep.equal(expected1);

    const result2 = parseOperators([{
      type: TokenType.Name,
      stringView: 'aa'
    }, {
      type: TokenType.Name,
      stringView: 'aa'
    }, {
      type: TokenType.Name,
      stringView: 'aa'
    }]);
    expect(result2).deep.equal([]);
  });

  it('parse expression', function() {
    const result1 = parseExpression([{
      type: TokenType.Num,
      stringView: '6'
    }]);
    const expected1 = {
      leftOperand: { type: TokenType.Num, stringView: '6' },
      operator: null,
      rightOperand: null
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseExpression([{
      type: TokenType.Num,
      stringView: '6'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '9'
    }]);
    const expected2 = {
      leftOperand: { type: TokenType.Num, stringView: '6' },
      operator: [{ type: TokenType.Plus, stringView: '+' }],
      rightOperand: {
        leftOperand: { type: TokenType.Num, stringView: '9' },
        operator: null,
        rightOperand: null
      }
    };
    expect(result2).deep.equal(expected2);

    const result3 = parseExpression([{
      type: TokenType.Num,
      stringView: '6'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '9'
    }, {
      type: TokenType.Minus,
      stringView: '-'
    }, {
      type: TokenType.Num,
      stringView: '69'
    }, {
      type: TokenType.Devide,
      stringView: '/'
    }, {
      type: TokenType.Num,
      stringView: '2'
    }]);
    const expected3 = {
      leftOperand: { type: TokenType.Num, stringView: '6' },
      operator: [{ type: TokenType.Plus, stringView: '+' }],
      rightOperand: {
        leftOperand: { type: TokenType.Num, stringView: '9' },
        operator: [{ type: TokenType.Minus, stringView: '-' }],
        rightOperand: {
          leftOperand: { type: TokenType.Num, stringView: '69' },
          operator: [{ type: TokenType.Devide, stringView: '/' }],
          rightOperand: {
            leftOperand: { type: TokenType.Num, stringView: '2' },
            operator: null,
            rightOperand: null
          }
        }
      }
    };
    expect(result3).deep.equal(expected3);
  });
});
