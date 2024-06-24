import { expect } from 'chai';
import { compileSourceToJs } from '../index';

const samples = [
  {
    cringeS: [
      '// some comment',
      'true || false',
      'false && true',
      '(2 + 4 / ((16 + 5)))',
      '2 / 3',
      '(1 + 2) * 3',
      '(1 + 4)',
      '1 * (2 + 3)',
      '(((3 + 69)))',
      'count = 1',
      'count2 = 5 * 2',
      'count3 = 1 * (2 + 3)',
      '~',
      'console.log(\'count:\', count);',
      'console.log(\'countX2:\', count2);',
      'console.log(\'countX3:\', count3);',
      '~',
      'pow2 = a => a * a',
      'sum = a => b => a + b',
      'sum3 = a => b => c => a + b + c',
      'powResult = pow2(4)',
      'pow2(88 + 44)',
      'sum3Result = sum3(2)(4)(6)',
      '~ console.log(\'sum3Result:\', sum3Result); ~',
      'str = \'a\' + \'b\'',
      'pair = {',
      '  first: 69 + 69',
      '  second: {',
      '    first: pow2(123)',
      '    second: 777',
      '  }',
      '}',
      'ternaryIf = 5 > 3 ? 11 ? 1 : pow2(88 + 44) : 3',
      '~ console.log(\'ternaryIf:\', ternaryIf); ~',
    ],
    js: [
      '// some comment',
      'true || false;',
      'false && true;',
      '(2 + 4 / ((16 + 5)));',
      '2 / 3;',
      '(1 + 2) * 3;',
      '(1 + 4);',
      '1 * (2 + 3);',
      '(((3 + 69)));',
      'const count = 1;',
      'const count2 = 5 * 2;',
      'const count3 = 1 * (2 + 3);',
      'console.log(\'count:\', count);',
      'console.log(\'countX2:\', count2);',
      'console.log(\'countX3:\', count3);',
      'const pow2 = a => a * a;',
      'const sum = a => b => a + b;',
      'const sum3 = a => b => c => a + b + c;',
      'const powResult = pow2(4);',
      'pow2(88 + 44);',
      'const sum3Result = sum3(2)(4)(6);',
      'console.log(\'sum3Result:\', sum3Result);',
      'const str = \'a\' + \'b\';',
      'const pair = {',
      '  first: 69 + 69,',
      '  second: {',
      '    first: pow2(123),',
      '    second: 777,',
      '  },',
      '};',
      'const ternaryIf = 5 > 3 ? 11 ? 1 : pow2(88 + 44) : 3;',
      'console.log(\'ternaryIf:\', ternaryIf);',
    ],
  },
  {
    cringeS: [
      'currValue > maxValue ? callback(maxValue) : true || counter(currValue + 1)(maxValue)(callback)',
    ],
    js: [
      'currValue > maxValue ? callback(maxValue) : true || counter(currValue + 1)(maxValue)(callback);',
    ],
  },
  {
    cringeS: [
      '~',
      'const log = (val) => console.log(val);',
      'const warn = (val) => console.warn(val2);',
      '~',
    ],
    js: [
      'const log = (val) => console.log(val);',
      'const warn = (val) => console.warn(val2);',
    ],
  },
  {
    cringeS: [
      'counter = initial => callback => initial > 0 ? callback(initial) || counter(initial - 1)(callback) : initial'
    ],
    js: [
      'const counter = initial => callback => initial > 0 ? callback(initial) || counter(initial - 1)(callback) : initial;'
    ],
  },
  {
    cringeS: [
      'fizzBuzzOutput = callback => value => callback(value % 3 === 0 && value % 5 === 0 ? fizzBuzz : value % 3 === 0 ? fizz : value % 5 === 0 ? fizz : value)'
    ],
    js: [
      'const fizzBuzzOutput = callback => value => callback(value % 3 === 0 && value % 5 === 0 ? fizzBuzz : value % 3 === 0 ? fizz : value % 5 === 0 ? fizz : value);'
    ],
  },
  {
    cringeS: [
      'counter = current => max => callback => current <= max ? callback(current) || counter(current + 1)(max)(callback) : current'
    ],
    js: [
      'const counter = current => max => callback => current <= max ? callback(current) || counter(current + 1)(max)(callback) : current;'
    ],
  },
];

describe('Compile JS', function () {
  it('all samples', function () {
    for (const sample of samples) {
      const result = compileSourceToJs(sample.cringeS.join('\n'));
      expect(result).equal(sample.js.join('\n'));
    }
  });
});
