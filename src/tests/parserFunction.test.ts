import { expect } from 'chai';
import { TokenType } from '../tokenizer';
import {
  parseArgs,
  parseBody,
  parseFunctionExpression,
  parseFunctionComposition,
  parseFunctionCallArgs,
  parseFunctionCompositionExpression,
  checkIsFunctionExpression,
  checkIsFunctionCompositionExpression,
} from '../parser/function';

describe('Parser function', function () {
  it('parse args', function () {
    const result1 = parseArgs([
      { type: TokenType.Name, stringView: 'name' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
    ]);
    const expected1 = [{ type: TokenType.Name, stringView: 'name' }];
    expect(result1).deep.equal(expected1);

    const result2 = parseArgs.bind(
      undefined,
      [
        { type: TokenType.Name, stringView: 'name' },
        { type: TokenType.Multiply, stringView: '*' },
        { type: TokenType.Num, stringView: '69' },
      ]
    );
    expect(result2).throw('Invalid arguments in function defenition');
  });

  it('parse body', function () {
    const result1 = parseBody([
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.Multiply, stringView: '*' },
      { type: TokenType.Num, stringView: '9' },
    ]);
    const expected1 = [
      {
        type: 'Expression',
        value: {
          leftOperand: { type: TokenType.Num, stringView: '6' },
          operator: [{ type: TokenType.Multiply, stringView: '*' }],
          rightOperand: {
            leftOperand: { type: TokenType.Num, stringView: '9' },
            operator: null,
            rightOperand: null
          }
        }
      }
    ];
    expect(result1).deep.equal(expected1);

    const result2 = parseBody([
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Name, stringView: 'num' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Name, stringView: 'num' },
      { type: TokenType.Multiply, stringView: '*' },
      { type: TokenType.Num, stringView: '9' },
    ]);
    const expected2 = [{
      type: 'Expression',
      value: {
        args: [{ type: TokenType.Name, stringView: 'num' }],
        body: [{
          type: 'Expression',
          value: {
            leftOperand: { type: TokenType.Name, stringView: 'num' },
            operator: [{ type: TokenType.Multiply, stringView: '*' }],
            rightOperand: {
              leftOperand: { type: TokenType.Num, stringView: '9' },
              operator: null,
              rightOperand: null
            }
          }
        }]
      }
    }];
    expect(result2).deep.equal(expected2);

    const result3 = parseBody.bind(
      undefined,
      [
        { type: TokenType.Name, stringView: 'num' },
        { type: TokenType.Multiply, stringView: '*' },
        { type: TokenType.Num, stringView: '9' },
      ]
    );
    expect(result3).throw('=> symbol not found');
  });

  it('parse function expression', function () {
    const result1 = parseFunctionExpression([
      { type: TokenType.Name, stringView: 'fn' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.Multiply, stringView: '*' },
      { type: TokenType.Num, stringView: '9' },
    ]);
    const expected1 = {
      args: [{ type: TokenType.Name, stringView: 'fn' }],
      body: [{
        type: 'Expression',
        value: {
          leftOperand: { type: TokenType.Num, stringView: '6' },
          operator: [{ type: TokenType.Multiply, stringView: '*' }],
          rightOperand: {
            leftOperand: { type: TokenType.Num, stringView: '9' },
            operator: null,
            rightOperand: null
          }
        }
      }]
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseFunctionExpression([
      { type: TokenType.Name, stringView: 'fn' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Name, stringView: 'num' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Name, stringView: 'num' },
      { type: TokenType.Multiply, stringView: '*' },
      { type: TokenType.Num, stringView: '9' },
    ]);
    const expected2 = {
      args: [{ type: TokenType.Name, stringView: 'fn' }],
      body: [{
        type: 'Expression',
        value: {
          args: [{ type: TokenType.Name, stringView: 'num' }],
          body: [{
            type: 'Expression',
            value: {
              leftOperand: { type: TokenType.Name, stringView: 'num' },
              operator: [{ type: TokenType.Multiply, stringView: '*' }],
              rightOperand: {
                leftOperand: { type: TokenType.Num, stringView: '9' },
                operator: null,
                rightOperand: null
              }
            }
          }]
        }
      }]
    };
    expect(result2).deep.equal(expected2);

    const result3 = parseFunctionExpression.bind(
      undefined,
      [
        { type: TokenType.Equal, stringView: '=' },
        { type: TokenType.Greater, stringView: '>' },
        { type: TokenType.Num, stringView: '6' },
        { type: TokenType.Multiply, stringView: '*' },
        { type: TokenType.Num, stringView: '9' },
      ]
    );
    expect(result3).throw('Invalid arguments in function defenition');
  });

  it('parse function composition', function () {
    const result1 = parseFunctionComposition([
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Comma, stringView: ',' },
      { type: TokenType.Name, stringView: 'sum' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.CloseBracket, stringView: ')' },
    ]);
    const expected1 = [
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Name, stringView: 'sum' }
    ];
    expect(result1).deep.equal(expected1);

    const result2 = parseFunctionComposition([
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Comma, stringView: ',' },
      { type: TokenType.Name, stringView: 'sum' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.CloseBracket, stringView: ')' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Num, stringView: '9' },
      { type: TokenType.CloseBracket, stringView: ')' },
    ]);
    const expected2 = [
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Name, stringView: 'sum' }
    ];
    expect(result2).deep.equal(expected2);

    const result3 = parseFunctionComposition([
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Comma, stringView: ',' },
      { type: TokenType.Name, stringView: 'sum' },
      { type: TokenType.Comma, stringView: ',' },
      { type: TokenType.Name, stringView: 'sum2' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.CloseBracket, stringView: ')' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Num, stringView: '9' },
      { type: TokenType.CloseBracket, stringView: ')' },
    ]);
    const expected3 = [
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Name, stringView: 'sum' },
      { type: TokenType.Name, stringView: 'sum2' },
    ];
    expect(result3).deep.equal(expected3);

    const result4 = parseFunctionComposition.bind(
      undefined,
      [
        { type: TokenType.Comma, stringView: ',' },
        { type: TokenType.Name, stringView: 'sum' },
        { type: TokenType.Comma, stringView: ',' },
        { type: TokenType.Name, stringView: 'sum2' },
      ]
    );
    expect(result4).throw('Unxpected token type');
  });

  it('parse function call args', function () {
    const result1 = parseFunctionCallArgs([]);
    expect(result1).deep.equal([]);

    const result2 = parseFunctionCallArgs([
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.CloseBracket, stringView: ')' },
    ]);
    const expected2 = [[{
      type: 'Expression',
      value: {
        leftOperand: { type: 1, stringView: '6' },
        operator: null,
        rightOperand: null
      }
    }]];
    expect(result2).deep.equal(expected2);
  });

  it('parse function composition expression', function () {
    const result1 = parseFunctionCompositionExpression([
      { type: 0, stringView: 'otherFn' },
      { type: 13, stringView: '(' },
      { type: 0, stringView: 'value' },
      { type: 8, stringView: '-' },
      { type: 1, stringView: '1' },
      { type: 14, stringView: ')' }
    ]);
    const expected1 = {
      functionNames: [{ type: TokenType.Name, stringView: 'otherFn' }],
      args: [
        [{
          type: 'Expression',
          value: {
            leftOperand: { type: TokenType.Name, stringView: 'value' },
            operator: [{ type: TokenType.Minus, stringView: '-' }],
            rightOperand: {
              leftOperand: { type: TokenType.Num, stringView: '1' },
              operator: null,
              rightOperand: null
            }
          }
        }]
      ]
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseFunctionCompositionExpression([
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Comma, stringView: ',' },
      { type: TokenType.Name, stringView: 'sum' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Name, stringView: 'count' },
      { type: TokenType.CloseBracket, stringView: ')' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Name, stringView: 'countX2' },
      { type: TokenType.CloseBracket, stringView: ')' }
    ]);
    const expected2 = {
      functionNames: [
        { type: TokenType.Name, stringView: 'pow2' },
        { type: TokenType.Name, stringView: 'sum' }
      ],
      args: [
        [{
          type: 'Expression',
          value: {
            leftOperand: { type: TokenType.Name, stringView: 'count' },
            operator: null,
            rightOperand: null
          }
        }],
        [{
          type: 'Expression',
          value: {
            leftOperand: { type: TokenType.Name, stringView: 'countX2' },
            operator: null,
            rightOperand: null
          }
        }]
      ]
    };
    expect(result2).deep.equal(expected2);
  });

  it('check is function expression', function () {
    const result1 = checkIsFunctionExpression([
      { type: TokenType.Name, stringView: 'fn' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Greater, stringView: '>' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.Multiply, stringView: '*' },
      { type: TokenType.Num, stringView: '9' },
    ]);
    expect(result1).equal(true);

    const result2 = checkIsFunctionExpression([
      { type: TokenType.Name, stringView: 'fn' },
      { type: TokenType.Equal, stringView: '=' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.Multiply, stringView: '*' },
      { type: TokenType.Num, stringView: '9' },
    ]);
    expect(result2).equal(false);
  });

  it('check is function composition expression', function () {
    const result1 = checkIsFunctionCompositionExpression([
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Comma, stringView: ',' },
      { type: TokenType.Name, stringView: 'sum' },
      { type: TokenType.OpenBracket, stringView: '(' },
      { type: TokenType.Num, stringView: '6' },
      { type: TokenType.CloseBracket, stringView: ')' },
    ]);
    expect(result1).equal(true);

    const result2 = checkIsFunctionCompositionExpression([
      { type: TokenType.Name, stringView: 'pow2' },
      { type: TokenType.Comma, stringView: ',' },
      { type: TokenType.Name, stringView: 'sum' },
    ]);
    expect(result2).equal(false);
  });
});
