import { expect } from 'chai';
import { TokenType } from '../tokenizer';
import {
  parseAssignment,
  checkIsAssignment,
} from '../parser/assignment';

describe('Parser assignment', function() {
  it('parse assignment', function() {
    const result = parseAssignment([{
      type: TokenType.Name,
      stringView: 'count'
    }, {
      type: TokenType.Equal,
      stringView: '='
    }, {
      type: TokenType.Num,
      stringView: '2'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '5'
    }]);

    const expected = {
      variableName: 'count',
      value: {
        leftOperand: { type: TokenType.Num, stringView: '2' },
        operator: [
          { type: TokenType.Plus, stringView: '+' }
        ],
        rightOperand: {
          leftOperand: { type: TokenType.Num, stringView: '5' },
          operator: null,
          rightOperand: null
        }
      }
    };

    expect(result).deep.equal(expected);
  });

  it('check is assignment', function() {
    expect(checkIsAssignment([{
      type: TokenType.Name,
      stringView: 'count'
    }, {
      type: TokenType.Equal,
      stringView: '='
    }, {
      type: TokenType.Num,
      stringView: '2'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '5'
    }])).equal(true);

    expect(checkIsAssignment([{
      type: TokenType.Num,
      stringView: '2'
    }, {
      type: TokenType.Plus,
      stringView: '+'
    }, {
      type: TokenType.Num,
      stringView: '5'
    }])).equal(false);

    expect(checkIsAssignment([{
      type: TokenType.Name,
      stringView: 'a'
    }, {
      type: TokenType.Equal,
      stringView: '='
    }, {
      type: TokenType.Greater,
      stringView: '>'
    }, {
      type: TokenType.Name,
      stringView: 'a'
    }, {
      type: TokenType.Multiply,
      stringView: '*'
    }, {
      type: TokenType.Name,
      stringView: 'a'
    }])).equal(false);
  });
});

