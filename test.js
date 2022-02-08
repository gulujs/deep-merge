import { expect } from 'chai';
import { deepMerge } from './index.js';

describe('deepMerge', () => {
  it('add keys in target that do not exist at the root', () => {
    const src = { key1: 'value1', key2: 'value2' };
    const target = {};

    const res = deepMerge(target, src);

    expect(target).to.deep.equal({}, 'merge should be immutable');
    expect(res).to.deep.equal(src);
  });

  it('merge existing simple keys in target at the roots', () => {
    const src = { key1: 'changed', key2: 'value2' };
    const target = { key1: 'value1', key3: 'value3' };

    const expected = {
      key1: 'changed',
      key2: 'value2',
      key3: 'value3'
    };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('merge nested objects into target', () => {
    const src = {
      key1: {
        subkey1: 'changed',
        subkey3: 'added'
      }
    };
    const target = {
      key1: {
        subkey1: 'value1',
        subkey2: 'value2'
      }
    };

    const expected = {
      key1: {
        subkey1: 'changed',
        subkey2: 'value2',
        subkey3: 'added'
      }
    };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('replace simple key with nested object in target', () => {
    const src = {
      key1: {
        subkey1: 'subvalue1',
        subkey2: 'subvalue2'
      }
    };
    const target = {
      key1: 'value1',
      key2: 'value2'
    };

    const expected = {
      key1: {
        subkey1: 'subvalue1',
        subkey2: 'subvalue2'
      },
      key2: 'value2'
    };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should add nested object in target', () => {
    const src = {
      b: {
        c: {}
      }
    };

    const target = {
      a: {}
    };

    const expected = {
      a: {},
      b: {
        c: {}
      }
    };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should clone source and target', () => {
    const src = {
      b: {
        c: 'foo'
      }
    };

    const target = {
      a: {
        d: 'bar'
      }
    };

    const expected = {
      a: {
        d: 'bar'
      },
      b: {
        c: 'foo'
      }
    };

    const merged = deepMerge(target, src, { clone: true });

    expect(merged).to.deep.equal(expected);
    expect(merged.a).to.not.equal(target.a);
    expect(merged.b).to.not.equal(target.b);
  });

  it('should clone source and target', () => {
    const src = {
      b: {
        c: 'foo'
      }
    };

    const target = {
      a: {
        d: 'bar'
      }
    };

    const merged = deepMerge(target, src);
    expect(merged.a).to.not.equal(target.a);
    expect(merged.b).to.not.equal(target.b);
  });

  it('should replace object with simple key in target', () => {
    const src = { key1: 'value1' };
    const target = {
      key1: {
        subkey1: 'subvalue1',
        subkey2: 'subvalue2'
      },
      key2: 'value2'
    };

    const expected = { key1: 'value1', key2: 'value2' };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should replace objects with arrays', () => {
    const target = { key1: { subkey: 'one' } };

    const src = { key1: ['subkey'] };

    const expected = { key1: ['subkey'] };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should replace arrays with objects', () => {
    const target = { key1: ['subkey'] };

    const src = { key1: { subkey: 'one' } };

    const expected = { key1: { subkey: 'one' } };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should replace dates with arrays', () => {
    const target = { key1: new Date() };

    const src = { key1: ['subkey'] };

    const expected = { key1: ['subkey'] };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should replace null with arrays', () => {
    const target = {
      key1: null
    };

    const src = {
      key1: ['subkey']
    };

    const expected = {
      key1: ['subkey']
    };

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should work on simple array', () => {
    const src = ['one', 'three'];
    const target = ['one', 'two'];

    const expected = ['one', 'two', 'one', 'three'];

    const merged = deepMerge(target, src);
    expect(merged).to.deep.equal(expected);
    expect(Array.isArray(merged)).to.be.true;
  });

  it('should work on another simple array', () => {
    const target = ['a1', 'a2', 'c1', 'f1', 'p1'];
    const src = ['t1', 's1', 'c2', 'r1', 'p2', 'p3'];

    const expected = ['a1', 'a2', 'c1', 'f1', 'p1', 't1', 's1', 'c2', 'r1', 'p2', 'p3'];
    const merged = deepMerge(target, src);
    expect(merged).to.deep.equal(expected);
    expect(Array.isArray(merged)).to.be.true;
  });

  it('should work on array properties', () => {
    const src = {
      key1: ['one', 'three'],
      key2: ['four']
    };
    const target = {
      key1: ['one', 'two']
    };

    const expected = {
      key1: ['one', 'two', 'one', 'three'],
      key2: ['four']
    };

    const merged = deepMerge(target, src);
    expect(merged).to.deep.equal(expected);
    expect(Array.isArray(merged.key1)).to.be.true;
    expect(Array.isArray(merged.key2)).to.be.true;
  });

  it('should work on array properties with clone option', () => {
    const src = {
      key1: ['one', 'three'],
      key2: ['four']
    };
    const target = {
      key1: ['one', 'two']
    };

    const merged = deepMerge(target, src, { clone: true });
    expect(merged.key1).to.not.equal(src.key1);
    expect(merged.key1).to.not.equal(target.key1);
    expect(merged.key2).to.not.equal(src.key2);
  });

  it('should work on array of objects', () => {
    const src = [
      { key1: ['one', 'three'], key2: ['one'] },
      { key3: ['five'] }
    ];
    const target = [
      { key1: ['one', 'two'] },
      { key3: ['four'] }
    ];

    const expected = [
      { key1: ['one', 'two'] },
      { key3: ['four'] },
      { key1: ['one', 'three'], key2: ['one'] },
      { key3: ['five'] }
    ];

    const merged = deepMerge(target, src);
    expect(merged).to.deep.equal(expected);
    expect(Array.isArray(merged), 'result should be an array').to.be.true;
    expect(Array.isArray(merged[0].key1), 'subkey should be an array too').to.be.true;
  });

  it('should work on array of objects with clone option', () => {
    const src = [
      { key1: ['one', 'three'], key2: ['one'] },
      { key3: ['five'] }
    ];
    const target = [
      { key1: ['one', 'two'] },
      { key3: ['four'] }
    ];

    const expected = [
      { key1: ['one', 'two'] },
      { key3: ['four'] },
      { key1: ['one', 'three'], key2: ['one'] },
      { key3: ['five'] }
    ];

    const merged = deepMerge(target, src, { clone: true });
    expect(merged).to.deep.equal(expected);
    expect(Array.isArray(merged), 'result should be an array').to.be.true;
    expect(Array.isArray(merged[0].key1), 'subkey should be an array too').to.be.true;

    expect(merged[0].key1).to.not.equal(src[0].key1);
    expect(merged[0].key1).to.not.equal(target[0].key1);
    expect(merged[0].key2).to.not.equal(src[0].key2);
    expect(merged[1].key3).to.not.equal(src[1].key3);
    expect(merged[1].key3).to.not.equal(target[1].key3);
  });

  it('should treat regular expressions like primitive values', () => {
    const target = { key1: /abc/ };
    const src = { key1: /efg/ };
    const expected = { key1: /efg/ };
    const merged = deepMerge(target, src);
    expect(merged).to.deep.equal(expected);
    expect(merged.key1.test('efg')).to.be.true;
  });

  it('should treat regular expressions like primitive values and should not clone even with clone option', () => {
    const target = { key1: /abc/ };
    const src = { key1: /efg/ };

    const output = deepMerge(target, src, { clone: true });
    expect(output.key1).to.equal(src.key1);
  });

  it('should treat dates like primitives', () => {
    const monday = new Date('2016-09-27T01:08:12.761Z');
    const tuesday = new Date('2016-09-28T01:18:12.761Z');

    const target = {
      key: monday
    };
    const source = {
      key: tuesday
    };

    const expected = {
      key: tuesday
    };
    const actual = deepMerge(target, source);

    expect(actual).to.deep.equal(expected);
    expect(actual.key.valueOf()).to.equal(tuesday.valueOf());
  });

  it('should treat dates like primitives and should not clone even with clone option', () => {
    const monday = new Date('2016-09-27T01:08:12.761Z');
    const tuesday = new Date('2016-09-28T01:18:12.761Z');

    const target = {
      key: monday
    };
    const source = {
      key: tuesday
    };

    const actual = deepMerge(target, source, { clone: true });

    expect(actual.key).to.equal(tuesday);
  });

  it('should work on array with null in it', () => {
    const target = [];

    const src = [null];

    const expected = [null];

    expect(deepMerge(target, src)).to.deep.equal(expected);
  });

  it('should clone array\'s element if it is object', () => {
    const a = { key: 'yup' };
    const target = [];
    const source = [a];

    const output = deepMerge(target, source, { clone: true });

    expect(output[0]).to.not.equal(a);
    expect(output[0].key).to.equal('yup');
  });

  it('should clone an array property when there is no target array', () => {
    const someObject = {};
    const target = {};
    const source = { ary: [someObject] };
    const output = deepMerge(target, source, { clone: true });

    expect(output).to.deep.equal({ ary: [{}] });
    expect(output.ary[0]).to.not.equal(someObject);
  });

  it('should overwrite values when property is initialised but undefined', () => {
    const target1 = { value: [] };
    const target2 = { value: null };
    const target3 = { value: 2 };

    const src = { value: undefined };

    function hasUndefinedProperty(o) {
      // eslint-disable-next-line no-prototype-builtins
      expect(o.hasOwnProperty('value')).to.be.true;
      expect(typeof o.value).to.equal('undefined');
    }

    hasUndefinedProperty(deepMerge(target1, src));
    hasUndefinedProperty(deepMerge(target2, src));
    hasUndefinedProperty(deepMerge(target3, src));
  });

  it('dates should copy correctly in an array', () => {
    const monday = new Date('2016-09-27T01:08:12.761Z');
    const tuesday = new Date('2016-09-28T01:18:12.761Z');

    const target = [monday, 'dude'];
    const source = [tuesday, 'lol'];

    const expected = [monday, 'dude', tuesday, 'lol'];
    const actual = deepMerge(target, source);

    expect(actual).to.deep.equal(expected);
  });

  it('should handle custom merge functions', () => {
    const target = {
      letters: ['a', 'b'],
      people: {
        first: 'Alex',
        second: 'Bert'
      }
    };

    const source = {
      letters: ['c'],
      people: {
        first: 'Smith',
        second: 'Bertson',
        third: 'Car'
      }
    };

    const mergePeople = (target, source) => {
      const keys = new Set(Object.keys(target).concat(Object.keys(source)));
      const destination = {};
      keys.forEach((key) => {
        if (key in target && key in source) {
          destination[key] = `${target[key]}-${source[key]}`;
        } else if (key in target) {
          destination[key] = target[key];
        } else {
          destination[key] = source[key];
        }
      });
      return destination;
    };

    const options = {
      customMerge: (path) => {
        if (path[path.length - 1] === 'people') {
          return mergePeople;
        }
      }
    };

    const expected = {
      letters: ['a', 'b', 'c'],
      people: {
        first: 'Alex-Smith',
        second: 'Bert-Bertson',
        third: 'Car'
      }
    };

    const actual = deepMerge(target, source, options);
    expect(actual).to.deep.equal(expected);
  });


  it('should handle custom merge functions', () => {
    const target = {
      letters: ['a', 'b'],
      people: {
        first: 'Alex',
        second: 'Bert'
      }
    };

    const source = {
      letters: ['c'],
      people: {
        first: 'Smith',
        second: 'Bertson',
        third: 'Car'
      }
    };

    const mergeLetters = (_target, _source) => {
      return 'merged letters';
    };


    const options = {
      customMerge: (path) => {
        if (path[path.length - 1] === 'letters') {
          return mergeLetters;
        }
      }
    };

    const expected = {
      letters: 'merged letters',
      people: {
        first: 'Smith',
        second: 'Bertson',
        third: 'Car'
      }
    };

    const actual = deepMerge(target, source, options);
    expect(actual).to.deep.equal(expected);
  });

  it('should merge correctly if custom merge is not a valid function', () => {
    const target = {
      letters: ['a', 'b'],
      people: {
        first: 'Alex',
        second: 'Bert'
      }
    };

    const source = {
      letters: ['c'],
      people: {
        first: 'Smith',
        second: 'Bertson',
        third: 'Car'
      }
    };

    const options = {
      customMerge: (_path) => {
        return false;
      }
    };

    const expected = {
      letters: ['a', 'b', 'c'],
      people: {
        first: 'Smith',
        second: 'Bertson',
        third: 'Car'
      }
    };

    const actual = deepMerge(target, source, options);
    expect(actual).to.deep.equal(expected);
  });

  it('copy symbol keys in target that do not exist on the target', () => {
    const mySymbol = Symbol('mySymbol');
    const src = { [mySymbol]: 'value1' };
    const target = {};

    const res = deepMerge(target, src);

    expect(res[mySymbol]).to.equal('value1');
    expect(Object.getOwnPropertySymbols(res)).to.deep.equal(Object.getOwnPropertySymbols(src));
  });

  it('copy symbol keys in target that do exist on the target', () => {
    const mySymbol = Symbol('mySymbol');
    const src = { [mySymbol]: 'value1' };
    const target = { [mySymbol]: 'wat' };

    const res = deepMerge(target, src);

    expect(res[mySymbol]).to.equal('value1');
  });

  it('Falsey properties should be mergeable', () => {
    const uniqueValue = {};

    const target = {
      wat: false
    };

    const source = {
      wat: false
    };

    let customMergeWasCalled = false;

    const result = deepMerge(target, source, {
      isMergeableObject: () => {
        return true;
      },
      customMerge: () => {
        return function () {
          customMergeWasCalled = true;
          return uniqueValue;
        };
      }
    });

    expect(result.wat).to.equal(uniqueValue);
    expect(customMergeWasCalled, 'custom merge function was called').to.be.true;
  });
});
