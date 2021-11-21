import { expect } from 'chai';
import { getToken } from '../tokenizer';
import {
  parseTernaryIf,
  checkIsTernaryIfExpression,
} from '../parser/ternaryIf';

describe('Parser ternary if', function () {
  it('parse ternary if', function () {
    const result1 = parseTernaryIf([
      getToken('5'),
      getToken('>'),
      getToken('3'),
      getToken('?'),
      getToken('5'),
      getToken(':'),
      getToken('3'),
    ]);
    const expected1 = {
      condition: [
        {
          type: 'Expression',
          value: {
            leftOperand: getToken('5'),
            operator: [getToken('>')],
            rightOperand: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }
      ],
      statementTrue: [
        {
          type: 'Expression',
          value: {
            leftOperand: getToken('5'),
            operator: null,
            rightOperand: null
          }
        }
      ],
      statementFalse: [
        {
          type: 'Expression',
          value: {
            leftOperand: getToken('3'),
            operator: null,
            rightOperand: null
          }
        }
      ]
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseTernaryIf.bind(
      undefined,
      [
        getToken('5'),
        getToken('>'),
        getToken('3'),
      ]
    );
    expect(result2).throw('Question mark not found');

    const result3 = parseTernaryIf.bind(
      undefined,
      [
        getToken('5'),
        getToken('>'),
        getToken('3'),
        getToken('?'),
        getToken('5'),
      ]
    );
    expect(result3).throw('Colon not found');
  });

  it('check is ternary if expression', function () {
    expect(checkIsTernaryIfExpression([
      getToken('5'),
      getToken('>'),
      getToken('3'),
      getToken('?'),
      getToken('5'),
      getToken(':'),
      getToken('3'),
    ])).equal(true);

    expect(checkIsTernaryIfExpression([
      getToken('5'),
      getToken('>'),
      getToken('3'),
    ])).equal(false);

    expect(checkIsTernaryIfExpression([
      getToken('5'),
      getToken('>'),
      getToken('3'),
      getToken('?'),
      getToken('5'),
    ])).equal(false);
  });
});