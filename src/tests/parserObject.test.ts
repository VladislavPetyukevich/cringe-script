import { expect } from 'chai';
import { TokenType } from '../tokenizer';
import {
  parseObjectDefenition,
  parseObjectFields,
  checkIsObjectExpression,
} from '../parser/object';

describe('Parser object', function () {
  it('parse object defenition', function () {
    const result1 = parseObjectDefenition([
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '3' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '8' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '13' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.CloseBrace, stringView: '}' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'additional' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '123' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.CloseBrace, stringView: '}' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.CloseBrace, stringView: '}' },
    ]);
    const expected1 = {
      fields: [
        {
          name: 'first',
          value: {
            type: 'Expression',
            value: {
              leftOperand: { type: TokenType.Num, stringView: '3' },
              operator: null,
              rightOperand: null
            }
          }
        },
        {
          name: 'second',
          value: {
            fields: [
              {
                name: 'first',
                value: {
                  type: 'Expression',
                  value: {
                    leftOperand: { type: TokenType.Num, stringView: '5' },
                    operator: null,
                    rightOperand: null
                  }
                }
              },
              {
                name: 'second',
                value: {
                  fields: [
                    {
                      name: 'first',
                      value: {
                        type: 'Expression',
                        value: {
                          leftOperand: { type: TokenType.Num, stringView: '8' },
                          operator: null,
                          rightOperand: null
                        }
                      }
                    },
                    {
                      name: 'second',
                      value: {
                        type: 'Expression',
                        value: {
                          leftOperand: { type: TokenType.Num, stringView: '13' },
                          operator: null,
                          rightOperand: null
                        }
                      }
                    }
                  ],
                  bufferName: '',
                  bufferValue: [],
                  nestedCloseBraceIndex: 0,
                  isParsingFieldValue: false
                }
              },
              {
                name: 'additional',
                value: {
                  type:
                    'Expression',
                  value: {
                    leftOperand: { type: TokenType.Num, stringView: '123' },
                    operator: null,
                    rightOperand: null
                  }
                }
              }
            ],
            bufferName: '',
            bufferValue: [],
            nestedCloseBraceIndex: 18,
            isParsingFieldValue: false
          }
        }
      ]
    };
    expect(result1).deep.equal(expected1);
  });

  it('parse object fields', function () {
    const result1 = parseObjectFields([
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '8' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '13' },
      { type: TokenType.NewLine, stringView: '\n' },
    ]);
    const expected1 = {
      fields: [
        {
          name: 'first',
          value: {
            type: 'Expression',
            value: {
              leftOperand: { type: TokenType.Num, stringView: '8' },
              operator: null,
              rightOperand: null
            }
          }
        },
        {
          name: 'second',
          value: {
            type: 'Expression',
            value: {
              leftOperand: { type: TokenType.Num, stringView: '13' },
              operator: null,
              rightOperand: null
            }
          }
        }
      ],
      bufferName: '',
      bufferValue: [],
      nestedCloseBraceIndex: 0,
      isParsingFieldValue: false
    };
    expect(result1).deep.equal(expected1);

    const result2 = parseObjectFields([
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '3' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '5' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'first' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '8' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'second' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '13' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.CloseBrace, stringView: '}' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.Name, stringView: 'additional' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '123' },
      { type: TokenType.NewLine, stringView: '\n' },
      { type: TokenType.CloseBrace, stringView: '}' },
      { type: TokenType.NewLine, stringView: '\n' },
    ]);
    const expected2 = {
      fields: [
        {
          name: 'first',
          value: {
            type: 'Expression',
            value: {
              leftOperand: { type: TokenType.Num, stringView: '3' },
              operator: null,
              rightOperand: null
            }
          }
        },
        {
          name: 'second',
          value: {
            fields: [
              {
                name: 'first',
                value: {
                  type: 'Expression',
                  value: {
                    leftOperand: { type: TokenType.Num, stringView: '5' },
                    operator: null,
                    rightOperand: null
                  }
                }
              },
              {
                name: 'second',
                value: {
                  fields: [
                    {
                      name: 'first',
                      value: {
                        type: 'Expression',
                        value: {
                          leftOperand: { type: TokenType.Num, stringView: '8' },
                          operator: null,
                          rightOperand: null
                        }
                      }
                    },
                    {
                      name: 'second',
                      value: {
                        type: 'Expression',
                        value: {
                          leftOperand: { type: TokenType.Num, stringView: '13' },
                          operator: null,
                          rightOperand: null
                        }
                      }
                    }
                  ],
                  bufferName: '',
                  bufferValue: [],
                  nestedCloseBraceIndex: 0,
                  isParsingFieldValue: false
                }
              },
              {
                name: 'additional',
                value: {
                  type: 'Expression',
                  value: {
                    leftOperand: { type: TokenType.Num, stringView: '123' },
                    operator: null,
                    rightOperand: null
                  }
                }
              }
            ],
            bufferName: '',
            bufferValue: [],
            nestedCloseBraceIndex: 18,
            isParsingFieldValue: false
          }
        }
      ],
      bufferName: '',
      bufferValue: [],
      nestedCloseBraceIndex: 32,
      isParsingFieldValue: false
    };
    expect(result2).deep.equal(expected2);

    const result3 = parseObjectFields.bind(
      undefined,
      [
        { type: TokenType.Name, stringView: 'first' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '3' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'second' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.OpenBrace, stringView: '{' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'first' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '5' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'second' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.OpenBrace, stringView: '{' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'first' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '8' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'second' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '13' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'additional' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '123' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.CloseBrace, stringView: '}' },
        { type: TokenType.NewLine, stringView: '\n' },
      ]
    );
    expect(result3).throw('Close Brace not found in nested object');

    const result4 = parseObjectFields.bind(
      undefined,
      [
        { type: TokenType.Name, stringView: 'first' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '3' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'second' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.OpenBrace, stringView: '{' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'first' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '5' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'first' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '8' },
        { type: TokenType.NewLine, stringView: '\n' },
        { type: TokenType.Name, stringView: 'second' },
        { type: TokenType.Name, stringView: 'additional' },
        { type: TokenType.Colon, stringView: ':' },
        { type: TokenType.Num, stringView: '123' },
        { type: TokenType.CloseBrace, stringView: '}' },
      ]
    );
    expect(result4).throw('Error while parsing object');
  });

  it('check is object expression', function () {
    const result1 = checkIsObjectExpression([
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.Name, stringView: 'val' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '69' },
      { type: TokenType.CloseBrace, stringView: '}' },
    ]);
    expect(result1).equal(true);

    const result2 = checkIsObjectExpression([
      { type: TokenType.Name, stringView: 'val' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '69' },
      { type: TokenType.CloseBrace, stringView: '}' },
    ]);
    expect(result2).equal(false);

    const result3 = checkIsObjectExpression([
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.Name, stringView: 'val' },
      { type: TokenType.Colon, stringView: ':' },
      { type: TokenType.Num, stringView: '69' },
    ]);
    expect(result3).equal(false);

    const result4 = checkIsObjectExpression([
      { type: TokenType.OpenBrace, stringView: '{' },
      { type: TokenType.Name, stringView: 'val' },
      { type: TokenType.CloseBrace, stringView: '}' },
    ]);
    expect(result4).equal(false);
  });
});
