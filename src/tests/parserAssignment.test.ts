import { expect } from 'chai';
import { getToken } from '../tokenizer';
import {
  parseAssignment,
  checkIsAssignment,
} from '../parser/assignment';

describe('Parser assignment', function() {
  it('parse assignment', function() {
    const result = parseAssignment([
      getToken('count'),
      getToken('='),
      getToken('2'),
      getToken('+'),
      getToken('5')
    ]);

    const expected = {
      variableName: 'count',
      value: {
        leftOperand: getToken('2'),
        operator: [getToken('+')],
        rightOperand: {
          leftOperand: getToken('5'),
          operator: null,
          rightOperand: null
        }
      }
    };

    expect(result).deep.equal(expected);
  });

  it('check is assignment', function() {
    expect(checkIsAssignment([
      getToken('count'),
      getToken('='),
      getToken('2'),
      getToken('+'),
      getToken('5')
    ])).equal(true);

    expect(checkIsAssignment([
      getToken('2'),
      getToken('+'),
      getToken('5')
    ])).equal(false);

    expect(checkIsAssignment([
      getToken('a'),
      getToken('='),
      getToken('>'),
      getToken('a'),
      getToken('*'),
      getToken('a')
    ])).equal(false);
  });
});

