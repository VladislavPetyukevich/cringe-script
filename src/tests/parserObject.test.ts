import { expect } from 'chai';
import { getToken } from '../tokenizer';
import {
  parseObjectDefenition,
  parseObjectFields,
  checkIsObjectExpression,
} from '../parser/object';

describe('Parser object', function () {
  it('parse object defenition', function () {
    const result1 = parseObjectDefenition([
      getToken('{'),
      getToken('\n'),
      getToken('first'),
      getToken(':'),
      getToken('3'),
      getToken('\n'),
      getToken('second'),
      getToken(':'),
      getToken('{'),
      getToken('\n'),
      getToken('first'),
      getToken(':'),
      getToken('5'),
      getToken('\n'),
      getToken('second'),
      getToken(':'),
      getToken('{'),
      getToken('\n'),
      getToken('first'),
      getToken(':'),
      getToken('8'),
      getToken('\n'),
      getToken('second'),
      getToken(':'),
      getToken('13'),
      getToken('\n'),
      getToken('}'),
      getToken('\n'),
      getToken('additional'),
      getToken(':'),
      getToken('123'),
      getToken('\n'),
      getToken('}'),
      getToken('\n'),
      getToken('}'),
    ]);
    const expected1 = {
      fields: [
        {
          name: 'first',
          value: {
            type: 'Expression',
            value: {
              leftOperand: getToken('3'),
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
                    leftOperand: getToken('5'),
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
                          leftOperand: getToken('8'),
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
                          leftOperand: getToken('13'),
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
                    leftOperand: getToken('123'),
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
      getToken('first'),
      getToken(':'),
      getToken('8'),
      getToken('\n'),
      getToken('second'),
      getToken(':'),
      getToken('13'),
      getToken('\n'),
    ]);
    const expected1 = {
      fields: [
        {
          name: 'first',
          value: {
            type: 'Expression',
            value: {
              leftOperand: getToken('8'),
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
              leftOperand: getToken('13'),
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
      getToken('first'),
      getToken(':'),
      getToken('3'),
      getToken('\n'),
      getToken('second'),
      getToken(':'),
      getToken('{'),
      getToken('\n'),
      getToken('first'),
      getToken(':'),
      getToken('5'),
      getToken('\n'),
      getToken('second'),
      getToken(':'),
      getToken('{'),
      getToken('\n'),
      getToken('first'),
      getToken(':'),
      getToken('8'),
      getToken('\n'),
      getToken('second'),
      getToken(':'),
      getToken('13'),
      getToken('\n'),
      getToken('}'),
      getToken('\n'),
      getToken('additional'),
      getToken(':'),
      getToken('123'),
      getToken('\n'),
      getToken('}'),
      getToken('\n'),
    ]);
    const expected2 = {
      fields: [
        {
          name: 'first',
          value: {
            type: 'Expression',
            value: {
              leftOperand: getToken('3'),
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
                    leftOperand: getToken('5'),
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
                          leftOperand: getToken('8'),
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
                          leftOperand: getToken('13'),
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
                    leftOperand: getToken('123'),
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
        getToken('first'),
        getToken(':'),
        getToken('3'),
        getToken('\n'),
        getToken('second'),
        getToken(':'),
        getToken('{'),
        getToken('\n'),
        getToken('first'),
        getToken(':'),
        getToken('5'),
        getToken('\n'),
        getToken('second'),
        getToken(':'),
        getToken('{'),
        getToken('\n'),
        getToken('first'),
        getToken(':'),
        getToken('8'),
        getToken('\n'),
        getToken('second'),
        getToken(':'),
        getToken('13'),
        getToken('\n'),
        getToken('additional'),
        getToken(':'),
        getToken('123'),
        getToken('\n'),
        getToken('}'),
        getToken('\n'),
      ]
    );
    expect(result3).throw('Close Brace not found in nested object');

    const result4 = parseObjectFields.bind(
      undefined,
      [
        getToken('first'),
        getToken(':'),
        getToken('3'),
        getToken('\n'),
        getToken('second'),
        getToken(':'),
        getToken('{'),
        getToken('\n'),
        getToken('first'),
        getToken(':'),
        getToken('5'),
        getToken('\n'),
        getToken('\n'),
        getToken('first'),
        getToken(':'),
        getToken('8'),
        getToken('\n'),
        getToken('second'),
        getToken('additional'),
        getToken(':'),
        getToken('123'),
        getToken('}'),
      ]
    );
    expect(result4).throw('Error while parsing object');
  });

  it('check is object expression', function () {
    const result1 = checkIsObjectExpression([
      getToken('{'),
      getToken('val'),
      getToken(':'),
      getToken('69'),
      getToken('}'),
    ]);
    expect(result1).equal(true);

    const result2 = checkIsObjectExpression([
      getToken('val'),
      getToken(':'),
      getToken('69'),
      getToken('}'),
    ]);
    expect(result2).equal(false);

    const result3 = checkIsObjectExpression([
      getToken('{'),
      getToken('val'),
      getToken(':'),
      getToken('69'),
    ]);
    expect(result3).equal(false);

    const result4 = checkIsObjectExpression([
      getToken('{'),
      getToken('val'),
      getToken('}'),
    ]);
    expect(result4).equal(false);
  });
});
