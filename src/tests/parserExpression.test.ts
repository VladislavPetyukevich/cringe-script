import { expect } from 'chai';
import { getToken } from '../tokenizer';
import {
  parseOperators,
  parseExpression
} from '../parser/expression';

describe('Parser expression', function() {
  it('parse operators', function() {
    expect(parseOperators([])).deep.equal([]);

    const result1 = parseOperators([
      getToken('n'),
      getToken('+'),
      getToken('='),
      getToken('6')
    ]);
    const expected1 = [
      getToken('+'),
      getToken('=')
  ];
    expect(result1).deep.equal(expected1);

    const result2 = parseOperators([
      getToken('aa'),
      getToken('aa'),
      getToken('aa')
  ]);
    expect(result2).deep.equal([]);
  });

  it('parse expression', function() {
    const result1 = parseExpression([getToken('6')]);
    const expected1 = {
      leftOperand: getToken('6'),
      operator: null,
      rightOperand: null
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseExpression([
      getToken('6'),
      getToken('+'),
      getToken('9')
  ]);
    const expected2 = {
      leftOperand: getToken('6'),
      operator: [getToken('+')],
      rightOperand: {
        leftOperand: getToken('9'),
        operator: null,
        rightOperand: null
      }
    };
    expect(result2).deep.equal(expected2);

    const result3 = parseExpression([
      getToken('6'),
      getToken('+'),
      getToken('9'),
      getToken('-'),
      getToken('69'),
      getToken('/'),
      getToken('2')
  ]);
    const expected3 = {
      leftOperand: getToken('6'),
      operator: [getToken('+')],
      rightOperand: {
        leftOperand: getToken('9'),
        operator: [getToken('-')],
        rightOperand: {
          leftOperand: getToken('69'),
          operator: [getToken('/')],
          rightOperand: {
            leftOperand: getToken('2'),
            operator: null,
            rightOperand: null
          }
        }
      }
    };
    expect(result3).deep.equal(expected3);
  });
});
