import { expect } from 'chai';
import { getToken } from '../tokenizer';
import {
  AnyTypeExpression,
  checkIsFunctionCompositionExpression,
  checkIsFunctionExpression,
  checkIsObjectDefenitionExpression,
  checkIsTernaryIfExpression,
  compileAnyTypeExpression,
  compileAssignment,
  compileComment,
  compileExpression,
  compileFunctionComposition,
  compileFunctionExpression,
  compileJS,
  compileObjectDefenition,
  compileStatement,
  compileStatements,
  compileTernaryIf,
  compileTernaryIfExpression,
  getIndentView,
} from '../compilerJS';

// Bloody hell
describe('Compiler JS', function () {
  it('compile expression', function () {
    expect(compileExpression(
      null
    )).equal('');

    expect(compileExpression(
      {
        leftOperand: getToken('6'),
        operator: null,
        rightOperand: null
      }
    )).equal('6');

    expect(compileExpression(
      {
        leftOperand: getToken('6'),
        operator: [getToken('+')],
        rightOperand: null
      }
    )).equal('6 + ');

    expect(compileExpression(
      {
        leftOperand: getToken('6'),
        operator: [getToken('+')],
        rightOperand: {
          leftOperand: getToken('9'),
          operator: null,
          rightOperand: null
        }
      }
    )).equal('6 + 9');

    expect(compileExpression(
      {
        leftOperand: getToken('6'),
        operator: [getToken('+')],
        rightOperand: {
          leftOperand: getToken('9'),
          operator: [getToken('*')],
          rightOperand: {
            leftOperand: getToken('2'),
            operator: null,
            rightOperand: null
          }
        }
      }
    )).equal('6 + 9 * 2');
  });

  it('compile function expression', function () {
    expect(compileFunctionExpression(
      {
        args: [getToken('a')], body: [{
          type: "Expression", value: {
            args: [getToken('b')], body: [{
              type: "Expression", value: {
                leftOperand: getToken('a'),
                operator: [getToken('+')],
                rightOperand: {
                  leftOperand: getToken('b'),
                  operator: null,
                  rightOperand: null
                }
              }
            }]
          }
        }]
      }
    )).equal('(a) => (b) => a + b');

    expect(compileFunctionExpression(
      {
        args: [getToken('a')], body: [{
          type: "Expression", value: {
            leftOperand: getToken('a'),
            operator: [getToken('*')],
            rightOperand: {
              leftOperand: getToken('a'),
              operator: null,
              rightOperand: null
            }
          }
        }]
      }
    )).equal('(a) => a * a');

    expect(compileFunctionExpression(
      {
        args: [getToken('value')], body: [{
          type: "FunctionCompositionExpression", value: {
            functionNames: [getToken('otherFn')], args: [[{
              type: "Expression", value: {
                leftOperand: getToken('value'),
                operator: [getToken('-')],
                rightOperand: {
                  leftOperand: getToken('1'),
                  operator: null,
                  rightOperand: null
                }
              }
            }]]
          }
        }]
      }
    )).equal('(value) => otherFn(value - 1)');
  });

  it('compile ternary if expression', function () {
    expect(compileTernaryIfExpression(
      {
        condition: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: [getToken('>')],
            rightOperand: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }], statementTrue: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: null,
            rightOperand: null
          }
        }], statementFalse: [{
          type: "Expression", value: {
            leftOperand: getToken('3'),
            operator: null,
            rightOperand: null
          }
        }]
      }
    )).equal('(5 > 3) ? 5 : 3');

    expect(compileTernaryIfExpression(
      {
        condition: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: [getToken('>')],
            rightOperand: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }], statementTrue: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: null,
            rightOperand: null
          }
        }], statementFalse: [{
          type: "TernaryIf", value: {
            condition: [{
              type: "Expression", value: {
                leftOperand: getToken('6'),
                operator: [getToken('>')],
                rightOperand: {
                  leftOperand: getToken('9'),
                  operator: null,
                  rightOperand: null
                }
              }
            }], statementTrue: [{
              type: "Expression", value: {
                leftOperand: getToken('6'),
                operator: null,
                rightOperand: null
              }
            }], statementFalse: [{
              type: "Expression", value: {
                leftOperand: getToken('9'),
                operator: null,
                rightOperand: null
              }
            }]
          }
        }]
      }
    )).equal('(5 > 3) ? 5 : (6 > 9) ? 6 : 9');
  });

  it('check is function expression', function () {
    expect(checkIsFunctionExpression(
      { args: {} } as AnyTypeExpression
    )).equal(true);

    expect(checkIsFunctionExpression(
      { functionNames: {} } as AnyTypeExpression
    )).equal(false);
  });

  it('check is function composition expression', function () {
    expect(checkIsFunctionCompositionExpression(
      { functionNames: {} } as AnyTypeExpression
    )).equal(true);

    expect(checkIsFunctionCompositionExpression(
      { args: {} } as AnyTypeExpression
    )).equal(false);
  });

  it('check is ternary if expression', function () {
    expect(checkIsTernaryIfExpression(
      {
        condition: {}
      } as AnyTypeExpression
    )).equal(true);

    expect(checkIsTernaryIfExpression(
      {
        fields: {}
      } as AnyTypeExpression
    )).equal(false);
  });

  it('check is object defenition expression', function () {
    expect(checkIsObjectDefenitionExpression(
      {
        fields: {}
      } as AnyTypeExpression
    )).equal(true);

    expect(checkIsObjectDefenitionExpression(
      {
        condition: {}
      } as AnyTypeExpression
    )).equal(false);
  });

  it('compile any type expression', function () {
    expect(compileAnyTypeExpression(
      {
        leftOperand: getToken('6'),
        operator: [getToken('+')],
        rightOperand: {
          leftOperand: getToken('9'),
          operator: null,
          rightOperand: null
        }
      }
    )).equal('6 + 9');

    expect(compileAnyTypeExpression(
      {
        leftOperand: getToken('1'),
        operator: null,
        rightOperand: null
      }
    )).equal('1');

    expect(compileAnyTypeExpression(
      {
        leftOperand: getToken('5'),
        operator: [getToken('*')],
        rightOperand: {
          leftOperand: getToken('2'),
          operator: null,
          rightOperand: null
        }
      }
    )).equal('5 * 2');

    expect(compileAnyTypeExpression(
      {
        args: [getToken('a')], body: [{
          type: "Expression", value: {
            args: [getToken('b')], body: [{
              type: "Expression", value: {
                leftOperand: getToken('a'),
                operator: [getToken('+')],
                rightOperand: {
                  leftOperand: getToken('b'),
                  operator: null,
                  rightOperand: null
                }
              }
            }]
          }
        }]
      }
    )).equal('(a) => (b) => a + b');

    expect(compileAnyTypeExpression(
      {
        args: [getToken('a')], body: [{
          type: "Expression", value: {
            leftOperand: getToken('a'),
            operator: [getToken('*')],
            rightOperand: {
              leftOperand: getToken('a'),
              operator: null,
              rightOperand: null
            }
          }
        }]
      }
    )).equal('(a) => a * a');

    expect(compileAnyTypeExpression(
      {
        functionNames: [getToken('pow2'), getToken('sum')], args: [[{
          type: "Expression", value: {
            leftOperand: getToken('count'),
            operator: null,
            rightOperand: null
          }
        }], [{
          type: "Expression", value: {
            leftOperand: getToken('countX2'),
            operator: null,
            rightOperand: null
          }
        }]]
      }
    )).equal('pow2(sum(count)(countX2))');

    expect(compileAnyTypeExpression(
      {
        leftOperand: getToken('5'),
        operator: [getToken('-')],
        rightOperand: {
          leftOperand: getToken('3'),
          operator: [getToken('*')],
          rightOperand: {
            leftOperand: getToken('2'),
            operator: [getToken('/')],
            rightOperand: {
              leftOperand: getToken('23'),
              operator: [getToken('+')],
              rightOperand: {
                leftOperand: getToken('6'),
                operator: null,
                rightOperand: null
              }
            }
          }
        }
      }
    )).equal('5 - 3 * 2 / 23 + 6');

    expect(compileAnyTypeExpression(
      {
        leftOperand: getToken('\'a\''),
        operator: [getToken('+')],
        rightOperand: {
          leftOperand: getToken('\'b\''),
          operator: null,
          rightOperand: null
        }
      }
    )).equal('\'a\' + \'b\'');

    expect(compileAnyTypeExpression(
      {
        condition: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: [getToken('>')],
            rightOperand: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }], statementTrue: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: null,
            rightOperand: null
          }
        }], statementFalse: [{
          type: "Expression", value: {
            leftOperand: getToken('3'),
            operator: null,
            rightOperand: null
          }
        }]
      }
    )).equal('(5 > 3) ? 5 : 3');

    expect(compileAnyTypeExpression(
      {
        fields: [{
          name: "first", value: {
            type: "Expression", value: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }, {
          name: "second", value: {
            fields: [{
              name: "first", value: {
                type: "Expression", value: {
                  leftOperand: getToken('5'),
                  operator: null,
                  rightOperand: null
                }
              }
            }, {
              name: "second", value: {
                fields: [{
                  name: "first", value: {
                    type: "Expression", value: {
                      leftOperand: getToken('8'),
                      operator: null,
                      rightOperand: null
                    }
                  }
                }, {
                  name: "second", value: {
                    type: "Expression", value: {
                      leftOperand: getToken('13'),
                      operator: null,
                      rightOperand: null
                    }
                  }
                }], "bufferName": "", "bufferValue": [], "nestedCloseBraceIndex": 0, "isParsingFieldValue": false
              }
            }, {
              name: "additional", value: {
                type: "Expression", value: {
                  leftOperand: getToken('123'),
                  operator: null,
                  rightOperand: null
                }
              }
            }], "bufferName": "", "bufferValue": [], "nestedCloseBraceIndex": 18, "isParsingFieldValue": false
          }
        }]
      }
    )).equal('{\n  first: 3,\n  second: {\n    first: 5,\n    second: {\n      first: 8,\n      second: 13\n    },\n    additional: 123\n  }\n}');

    expect(compileAnyTypeExpression(
      {
        args: [getToken('value')], body: [{
          type: "FunctionCompositionExpression", value: {
            functionNames: [getToken('otherFn')], args: [[{
              type: "Expression", value: {
                leftOperand: getToken('value'),
                operator: [getToken('-')],
                rightOperand: {
                  leftOperand: getToken('1'),
                  operator: null,
                  rightOperand: null
                }
              }
            }]]
          }
        }]
      }
    )).equal('(value) => otherFn(value - 1)');
  });

  it('compile assignment', function () {
    expect(compileAssignment(
      {
        variableName: "sum", value: {
          args: [getToken('a')], body: [{
            type: "Expression", value: {
              args: [getToken('b')], body: [{
                type: "Expression", value: {
                  leftOperand: getToken('a'),
                  operator: [getToken('+')],
                  rightOperand: {
                    leftOperand: getToken('b'),
                    operator: null,
                    rightOperand: null
                  }
                }
              }]
            }
          }]
        }
      }
    )).equal('const sum = (a) => (b) => a + b');
  });

  it('compile function composition', function () {
    expect(compileFunctionComposition(
      {
        functionNames: [getToken('pow2'), getToken('sum')], args: [[{
          type: "Expression", value: {
            leftOperand: getToken('count'),
            operator: null,
            rightOperand: null
          }
        }], [{
          type: "Expression", value: {
            leftOperand: getToken('countX2'),
            operator: null,
            rightOperand: null
          }
        }]]
      }
    )).equal('pow2(sum(count)(countX2))');

    expect(compileFunctionComposition(
      {
        functionNames: [getToken('pow2')], args: [[{
          type: "Expression", value: {
            leftOperand: getToken('count'),
            operator: null,
            rightOperand: null
          }
        }], [{
          type: "Expression", value: {
            leftOperand: getToken('countX2'),
            operator: null,
            rightOperand: null
          }
        }]]
      }
    )).equal('pow2(count)(countX2)');

    expect(compileFunctionComposition(
      {
        functionNames: [getToken('pow2')], args: [[{
          type: "Expression", value: {
            leftOperand: getToken('count'),
            operator: null,
            rightOperand: null
          }
        }]]
      }
    )).equal('pow2(count)');
  });

  it('compile ternary if', function () {
    expect(compileTernaryIf(
      {
        condition: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: [getToken('>')],
            rightOperand: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }], statementTrue: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: null,
            rightOperand: null
          }
        }], statementFalse: [{
          type: "Expression", value: {
            leftOperand: getToken('3'),
            operator: null,
            rightOperand: null
          }
        }]
      }
    )).equal('(5 > 3) ? 5 : 3');

    expect(compileTernaryIf(
      {
        condition: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: [getToken('>')],
            rightOperand: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }], statementTrue: [{
          type: "Expression", value: {
            leftOperand: getToken('5'),
            operator: null,
            rightOperand: null
          }
        }], statementFalse: [{
          type: "TernaryIf", value: {
            condition: [{
              type: "Expression", value: {
                leftOperand: getToken('6'),
                operator: [getToken('>')],
                rightOperand: {
                  leftOperand: getToken('9'),
                  operator: null,
                  rightOperand: null
                }
              }
            }], statementTrue: [{
              type: "Expression", value: {
                leftOperand: getToken('6'),
                operator: null,
                rightOperand: null
              }
            }], statementFalse: [{
              type: "Expression", value: {
                leftOperand: getToken('9'),
                operator: null,
                rightOperand: null
              }
            }]
          }
        }]
      }
    )).equal('(5 > 3) ? 5 : (6 > 9) ? 6 : 9');
  });

  it('get indent view', function () {
    expect(getIndentView(4)).equal('        ');
    expect(getIndentView(7)).equal('              ');
  });

  it('compile object defenition', function () {
    expect(compileObjectDefenition(
      {
        fields: [{
          name: "first", value: {
            type: "Expression", value: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }
        }, {
          name: "second", value: {
            fields: [{
              name: "first", value: {
                type: "Expression", value: {
                  leftOperand: getToken('5'),
                  operator: null,
                  rightOperand: null
                }
              }
            }, {
              name: "second", value: {
                fields: [{
                  name: "first", value: {
                    type: "Expression", value: {
                      leftOperand: getToken('8'),
                      operator: null,
                      rightOperand: null
                    }
                  }
                }, {
                  name: "second", value: {
                    type: "Expression", value: {
                      leftOperand: getToken('13'),
                      operator: null,
                      rightOperand: null
                    }
                  }
                }], "bufferName": "", "bufferValue": [], "nestedCloseBraceIndex": 0, "isParsingFieldValue": false
              }
            }, {
              name: "additional", value: {
                type: "Expression", value: {
                  leftOperand: getToken('123'),
                  operator: null,
                  rightOperand: null
                }
              }
            }], "bufferName": "", "bufferValue": [], "nestedCloseBraceIndex": 18, "isParsingFieldValue": false
          }
        }]
      },
      1
    )).equal('{\n  first: 3,\n  second: {\n    first: 5,\n    second: {\n      first: 8,\n      second: 13\n    },\n    additional: 123\n  }\n}');
  });

  it('compile comment', function () {
    expect(compileComment(
      { content: 'test comment * > < ( ) a = a => 4 +' }
    )).equal('// test comment * > < ( ) a = a => 4 +');
  });

  it('compile statement', function () {
    expect(compileStatement(
      {
        type: "Assignment", value: {
          variableName: "count", value: {
            leftOperand: getToken('1'),
            operator: null,
            rightOperand: null
          }
        }
      }
    )).equal('const count = 1');

    expect(compileStatement(
      {
        type: "Expression", value: {
          leftOperand: getToken('6'),
          operator: [getToken('*')],
          rightOperand: {
            leftOperand: getToken('9'),
            operator: null,
            rightOperand: null
          }
        }
      }
    )).equal('6 * 9');

    expect(compileStatement(
      {
        type: "FunctionCompositionExpression", value: {
          functionNames: [getToken('pow2'), getToken('sum')], args: [[{
            type: "Expression", value: {
              leftOperand: getToken('count'),
              operator: null,
              rightOperand: null
            }
          }], [{
            type: "Expression", value: {
              leftOperand: getToken('countX2'),
              operator: null,
              rightOperand: null
            }
          }]]
        }
      }
    )).equal('pow2(sum(count)(countX2))');

    expect(compileStatement(
      {
        type: "TernaryIf", value: {
          condition: [{
            type: "Expression", value: {
              leftOperand: getToken('5'),
              operator: [getToken('>')],
              rightOperand: {
                leftOperand: getToken('3'),
                operator: null,
                rightOperand: null
              }
            }
          }], statementTrue: [{
            type: "Expression", value: {
              leftOperand: getToken('5'),
              operator: null,
              rightOperand: null
            }
          }], statementFalse: [{
            type: "Expression", value: {
              leftOperand: getToken('3'),
              operator: null,
              rightOperand: null
            }
          }]
        }
      }
    )).equal('(5 > 3) ? 5 : 3');

    expect(compileStatement(
      {
        type: "Assignment", value: {
          variableName: "pair", value: {
            fields: [{
              name: "first", value: {
                type: "Expression", value: {
                  leftOperand: getToken('3'),
                  operator: null,
                  rightOperand: null
                }
              }
            }]
          }
        }
      }
    )).equal('const pair = {\n  first: 3\n}');

    expect(compileStatement(
      {
        type: "Comment", value: { "content": "some program comment" }
      }
    )).equal('// some program comment');

    expect(compileStatement.bind(
      undefined,
      {
        type: "FAKE STATEMENT", value: { "content": "some program comment" }
      } as any
    )).throw('Unknown statement: FAKE STATEMENT');
  });

  it('compile statements', function () {
    expect(compileStatements(
      [{
        type: "Comment", value: { "content": "some program comment" }
      }, {
        type: "Assignment", value: {
          variableName: "count", value: {
            leftOperand: getToken('1'),
            operator: null,
            rightOperand: null
          }
        }
      }, {
        type: "Assignment", value: {
          variableName: "countX2", value: {
            leftOperand: getToken('5'),
            operator: [getToken('*')],
            rightOperand: {
              leftOperand: getToken('2'),
              operator: null,
              rightOperand: null
            }
          }
        }
      }, {
        type: "Assignment", value: {
          variableName: "sum", value: {
            args: [getToken('a')], body: [{
              type: "Expression", value: {
                args: [getToken('b')], body: [{
                  type: "Expression", value: {
                    leftOperand: getToken('a'),
                    operator: [getToken('+')],
                    rightOperand: {
                      leftOperand: getToken('b'),
                      operator: null,
                      rightOperand: null
                    }
                  }
                }]
              }
            }]
          }
        }
      }],
      ';'
    )).deep.equal([
      '// some program comment',
      'const count = 1;',
      'const countX2 = 5 * 2;',
      'const sum = (a) => (b) => a + b;',
    ]);
  });

  it('compile JS', function () {
    expect(compileJS(
      [{
        type: "Comment", value: { "content": "some program comment" }
      }, {
        type: "Assignment", value: {
          variableName: "count", value: {
            leftOperand: getToken('1'),
            operator: null,
            rightOperand: null
          }
        }
      }, {
        type: "Assignment", value: {
          variableName: "countX2", value: {
            leftOperand: getToken('5'),
            operator: [getToken('*')],
            rightOperand: {
              leftOperand: getToken('2'),
              operator: null,
              rightOperand: null
            }
          }
        }
      }, {
        type: "Assignment", value: {
          variableName: "sum", value: {
            args: [getToken('a')], body: [{
              type: "Expression", value: {
                args: [getToken('b')], body: [{
                  type: "Expression", value: {
                    leftOperand: getToken('a'),
                    operator: [getToken('+')],
                    rightOperand: {
                      leftOperand: getToken('b'),
                      operator: null,
                      rightOperand: null
                    }
                  }
                }]
              }
            }]
          }
        }
      }]
    )).equal('// some program comment\nconst count = 1;\nconst countX2 = 5 * 2;\nconst sum = (a) => (b) => a + b;');

    expect(compileJS(
      [{
        type: "Comment", value: { "content": "some program comment" }
      }]
    )).equal('// some program comment');

    expect(compileJS(
      []
    )).equal('');
  });
});
