import { expect } from 'chai';
import { getToken } from '../tokenizer';
import {
  parseCringe,
  checkIsCringe,
} from '../parser/cringe';

describe('Parser cringe', function () {
  it('parse cringe', function () {
    const expected = {
      content: '5+69'
    };

    const result1 = parseCringe([
      getToken('CRINGE'),
      getToken('5'),
      getToken('+'),
      getToken('69')
    ]);
    expect(result1).deep.equal(expected);

    const result2 = parseCringe([
      getToken('🤣'),
      getToken('5'),
      getToken('+'),
      getToken('69')
    ]);
    expect(result2).deep.equal(expected);

    const result3 = parseCringe([
      getToken('CRINGE'),
      getToken('{'),
      getToken('\n'),
      getToken('5'),
      getToken('+'),
      getToken('69'),
      getToken('\n'),
      getToken('}'),
    ]);
    expect(result3).deep.equal(expected);

    const result4 = parseCringe([
      getToken('🤣'),
      getToken('{'),
      getToken('\n'),
      getToken('5'),
      getToken('+'),
      getToken('69'),
      getToken('\n'),
      getToken('}'),
    ]);
    expect(result4).deep.equal(expected);

    const result5 = parseCringe([
      getToken('🤣'),
      getToken('{'),
      getToken('\n'),
      getToken('{'),
      getToken('a'),
      getToken(':'),
      getToken('5'),
      getToken('}'),
      getToken('\n'),
      getToken('}'),
    ]);
    expect(result5).deep.equal({
      content: '{a:5}'
    });
  });

  it('check is comment', function () {
    expect(checkIsCringe([
      getToken('5'),
      getToken('+'),
      getToken('69'),
    ])).equal(false);

    expect(checkIsCringe([
      getToken('CRINGE'),
      getToken('5'),
      getToken('+'),
      getToken('69')
    ])).equal(true);

    expect(checkIsCringe([
      getToken('🤣'),
      getToken('5'),
      getToken('+'),
      getToken('69')
    ])).equal(true);

    expect(checkIsCringe([
      getToken('CRINGE'),
      getToken('{'),
      getToken('\n'),
      getToken('5'),
      getToken('+'),
      getToken('69'),
      getToken('\n'),
      getToken('}'),
    ])).equal(true);

    expect(checkIsCringe([
      getToken('🤣'),
      getToken('{'),
      getToken('\n'),
      getToken('5'),
      getToken('+'),
      getToken('69'),
      getToken('\n'),
      getToken('}'),
    ])).equal(true);
  });
});
