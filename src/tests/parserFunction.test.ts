import { expect } from 'chai';
import { getToken } from '../tokenizer';
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
      getToken('name'),
      getToken('='),
      getToken('>'),
    ]);
    const expected1 = [getToken('name')];
    expect(result1).deep.equal(expected1);

    const result2 = parseArgs.bind(
      undefined,
      [
        getToken('name'),
        getToken('*'),
        getToken('69'),
      ]
    );
    expect(result2).throw('Invalid arguments in function defenition');
  });

  it('parse body', function () {
    const result1 = parseBody([
      getToken('='),
      getToken('>'),
      getToken('6'),
      getToken('*'),
      getToken('9'),
    ]);
    const expected1 = [
      {
        type: 'Expression',
        value: {
          leftOperand: getToken('6'),
          operator: [getToken('*')],
          rightOperand: {
            leftOperand: getToken('9'),
            operator: null,
            rightOperand: null
          }
        }
      }
    ];
    expect(result1).deep.equal(expected1);

    const result2 = parseBody([
      getToken('='),
      getToken('>'),
      getToken('num'),
      getToken('='),
      getToken('>'),
      getToken('num'),
      getToken('*'),
      getToken('9'),
    ]);
    const expected2 = [{
      type: 'Expression',
      value: {
        args: [getToken('num')],
        body: [{
          type: 'Expression',
          value: {
            leftOperand: getToken('num'),
            operator: [getToken('*')],
            rightOperand: {
              leftOperand: getToken('9'),
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
        getToken('num'),
        getToken('*'),
        getToken('9'),
      ]
    );
    expect(result3).throw('=> symbol not found');
  });

  it('parse function expression', function () {
    const result1 = parseFunctionExpression([
      getToken('fn'),
      getToken('='),
      getToken('>'),
      getToken('6'),
      getToken('*'),
      getToken('9'),
    ]);
    const expected1 = {
      args: [getToken('fn')],
      body: [{
        type: 'Expression',
        value: {
          leftOperand: getToken('6'),
          operator: [getToken('*')],
          rightOperand: {
            leftOperand: getToken('9'),
            operator: null,
            rightOperand: null
          }
        }
      }]
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseFunctionExpression([
      getToken('fn'),
      getToken('='),
      getToken('>'),
      getToken('num'),
      getToken('='),
      getToken('>'),
      getToken('num'),
      getToken('*'),
      getToken('9'),
    ]);
    const expected2 = {
      args: [getToken('fn')],
      body: [{
        type: 'Expression',
        value: {
          args: [getToken('num')],
          body: [{
            type: 'Expression',
            value: {
              leftOperand: getToken('num'),
              operator: [getToken('*')],
              rightOperand: {
                leftOperand: getToken('9'),
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
        getToken('='),
        getToken('>'),
        getToken('6'),
        getToken('*'),
        getToken('9'),
      ]
    );
    expect(result3).throw('Invalid arguments in function defenition');
  });

  it('parse function composition', function () {
    const result1 = parseFunctionComposition([
      getToken('pow2'),
      getToken(','),
      getToken('sum'),
      getToken('('),
      getToken('6'),
      getToken(')'),
    ]);
    const expected1 = [
      getToken('pow2'),
      getToken('sum')
    ];
    expect(result1).deep.equal(expected1);

    const result2 = parseFunctionComposition([
      getToken('pow2'),
      getToken(','),
      getToken('sum'),
      getToken('('),
      getToken('6'),
      getToken(')'),
      getToken('('),
      getToken('9'),
      getToken(')'),
    ]);
    const expected2 = [
      getToken('pow2'),
      getToken('sum')
    ];
    expect(result2).deep.equal(expected2);

    const result3 = parseFunctionComposition([
      getToken('pow2'),
      getToken(','),
      getToken('sum'),
      getToken(','),
      getToken('sum2'),
      getToken('('),
      getToken('6'),
      getToken(')'),
      getToken('('),
      getToken('9'),
      getToken(')'),
    ]);
    const expected3 = [
      getToken('pow2'),
      getToken('sum'),
      getToken('sum2'),
    ];
    expect(result3).deep.equal(expected3);

    const result4 = parseFunctionComposition.bind(
      undefined,
      [
        getToken(','),
        getToken('sum'),
        getToken(','),
        getToken('sum2'),
      ]
    );
    expect(result4).throw('Unxpected token type');
  });

  it('parse function call args', function () {
    const result1 = parseFunctionCallArgs([]);
    expect(result1).deep.equal([]);

    const result2 = parseFunctionCallArgs([
      getToken('('),
      getToken('6'),
      getToken(')'),
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
      functionNames: [getToken('otherFn')],
      args: [
        [{
          type: 'Expression',
          value: {
            leftOperand: getToken('value'),
            operator: [getToken('-')],
            rightOperand: {
              leftOperand: getToken('1'),
              operator: null,
              rightOperand: null
            }
          }
        }]
      ]
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseFunctionCompositionExpression([
      getToken('pow2'),
      getToken(','),
      getToken('sum'),
      getToken('('),
      getToken('count'),
      getToken(')'),
      getToken('('),
      getToken('countX2'),
      getToken(')')
    ]);
    const expected2 = {
      functionNames: [
        getToken('pow2'),
        getToken('sum')
      ],
      args: [
        [{
          type: 'Expression',
          value: {
            leftOperand: getToken('count'),
            operator: null,
            rightOperand: null
          }
        }],
        [{
          type: 'Expression',
          value: {
            leftOperand: getToken('countX2'),
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
      getToken('fn'),
      getToken('='),
      getToken('>'),
      getToken('6'),
      getToken('*'),
      getToken('9'),
    ]);
    expect(result1).equal(true);

    const result2 = checkIsFunctionExpression([
      getToken('fn'),
      getToken('='),
      getToken('6'),
      getToken('*'),
      getToken('9'),
    ]);
    expect(result2).equal(false);
  });

  it('check is function composition expression', function () {
    const result1 = checkIsFunctionCompositionExpression([
      getToken('pow2'),
      getToken(','),
      getToken('sum'),
      getToken('('),
      getToken('6'),
      getToken(')'),
    ]);
    expect(result1).equal(true);

    const result2 = checkIsFunctionCompositionExpression([
      getToken('pow2'),
      getToken(','),
      getToken('sum'),
    ]);
    expect(result2).equal(false);
  });
});
