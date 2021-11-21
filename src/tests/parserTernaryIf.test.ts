import { expect } from 'chai';
import { TokenType } from '../tokenizer';
import {
  parseTernaryIf,
  checkIsTernaryIfExpression,
} from '../parser/ternaryIf';

describe('Parser ternary if', function () {
  it('parse ternary if', function () {
    const result1 = parseTernaryIf([
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Num, stringView: '3' },
      { type: TokenType.QuestionMark, stringView: '?' },
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '3' },
    ]);
    const expected1 = {
      condition: [
        {
          type: 'Expression',
          value: {
            leftOperand: { type: TokenType.Num, stringView: '5' },
            operator: [{ type: TokenType.Greater, stringView: '>' }],
            rightOperand: {
              leftOperand: { type: TokenType.Num, stringView: '3' },
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
            leftOperand: { type: TokenType.Num, stringView: '5' },
            operator: null,
            rightOperand: null
          }
        }
      ],
      statementFalse: [
        {
          type: 'Expression',
          value: {
            leftOperand: { type: TokenType.Num, stringView: '3' },
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
        { type: TokenType.Num, stringView: '5' },
        { type: TokenType.Greater, stringView: '>' },
        { type: TokenType.Num, stringView: '3' },
      ]
    );
    expect(result2).throw('Question mark not found');

    const result3 = parseTernaryIf.bind(
      undefined,
      [
        { type: TokenType.Num, stringView: '5' },
        { type: TokenType.Greater, stringView: '>' },
        { type: TokenType.Num, stringView: '3' },
        { type: TokenType.QuestionMark, stringView: '?' },
        { type: TokenType.Num, stringView: '5' },
      ]
    );
    expect(result3).throw('Colon not found');
  });

  it('check is ternary if expression', function () {
    expect(checkIsTernaryIfExpression([
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Num, stringView: '3' },
      { type: TokenType.QuestionMark, stringView: '?' },
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '3' },
    ])).equal(true);

    expect(checkIsTernaryIfExpression([
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Num, stringView: '3' },
    ])).equal(false);

    expect(checkIsTernaryIfExpression([
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Num, stringView: '3' },
      { type: TokenType.QuestionMark, stringView: '?' },
      { type: TokenType.Num, stringView: '5' },
    ])).equal(false);
  });
});