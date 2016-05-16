/*global describe, it, expect, beforeAll*/

const Sym = require('../../grammar/symbol');
var   s, ss, f;

describe('Sym', () => {

  describe('constructor()', () => {

    it('rejects 0 parameters', () => {
      f = () => new Sym();
      expect(f).toThrowError(TypeError);
    });

    it('rejects a null name', () => {
      f = () => new Sym(null);
      expect(f).toThrowError(TypeError);
    });

    it('accepts a stringy name', () => {
      f = () => new Sym('S');
      expect(f).not.toThrow();
    });

    it('accepts a lower-case name', () => {
      f = () => new Sym('symbol');
      expect(f).not.toThrow();
    });

    it('accepts a features object', () => {
      f = () => new Sym('S', { num: 'pl', subcat: ['NP', 'NP', 'VP'] });
      expect(f).not.toThrow();
    });

    it('allows construction with an object as the only parameter', () => {
      f = () => new Sym({ name: 'S' });
      expect(f).not.toThrow();
    });

    it('throws if the single-parameter object does not specify `name`', () => {
      f = () => new Sym({ num: 'pl' });
      expect(f).toThrowError(TypeError);
    });

  });

  describe('name', () => {

    beforeAll(() => {
      s = new Sym('S');
    });

    it('is accessible', () => {
      expect(s.name).toBe('S');
    });

    it('is enumerable', () => {
      expect(Object.keys(s).indexOf('name')).not.toBe(-1);
    });

    it('cannot be modified', () => {
      s.name = 'unchangeable';
      expect(s.name).toBe('S');
    });

  });

  describe('features', () => {

    it('are added as properties onto the Sym', () => {
      s = new Sym('NP', { num: 'sg' });
      expect(s.num).toBe('sg');
      expect(Object.keys(s).indexOf('num')).not.toBe(-1);
    });

  });

  describe('equals()', () => {

    it('is true when the same Sym is passed twice', () => {
      s = new Sym('NP');
      expect(s.equals(s)).toBe(true);
    });

    it('is true for two similar Syms', () => {
      ss = new Sym('NP');
      s = new Sym('NP');
      expect(s.equals(ss)).toBe(true);
    });

    it('is false for two Syms of different names', () => {
      ss = new Sym('NP');
      s = new Sym('S');
      expect(s.equals(ss)).toBe(false);
    });

    it('is false when one Sym has features and the other does not', () => {
      ss = new Sym('NP', { num: 'pl' });
      s = new Sym('NP');
      expect(s.equals(ss)).toBe(false);
    });

    it('is true both have the same features', () => {
      ss = new Sym('NP', { num: 'pl' });
      s = new Sym('NP', { num: 'pl' });
      expect(s.equals(ss)).toBe(true);
    });

    it('is false when both have the same # of features (not the same)', () => {
      ss = new Sym('NP', { num: 'pl' });
      s = new Sym('NP', { type: 3 });
      expect(s.equals(ss)).toBe(false);
    });

    it('compares well against a plain object representing the same Sym', () => {
      s = new Sym('NP', { type: 'NP, NP, PP' });
      expect(s.equals({
        name: 'NP',
        type: 'NP, NP, PP'
      })).toBe(true);
    });

    it('fails against a plain object that does not match the Sym', () => {
      s = new Sym('NP', { type: 'NP, NP, PP' });
      expect(s.equals({
        misMatched: 'property'
      })).toBe(false);
    });

  });

  describe('matches()', () => {

    it('is true when the same Sym is passed twice', () => {
      s = new Sym('NP', { num: 'pl' });
      expect(s.matches(s)).toBe(true);
    });

    it('is true when two similar Syms are given', () => {
      ss = new Sym('NP', { num: 'pl' });
      s = new Sym('NP', { num: 'pl' });
      expect(s.matches(ss)).toBe(true);
    });

    it('is true for null featured Syms of the same name', () => {
      ss = new Sym('NP');
      s = new Sym('NP');
      expect(s.matches(ss)).toBe(true);
    });

    it('is false for null featured Syms of different names', () => {
      ss = new Sym('S');
      s = new Sym('NP');
      expect(s.matches(ss)).toBe(false);
    });

    it('is true for two Syms with entirely different features', () => {
      ss = new Sym('NP', { num: 'pl' });
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches(ss)).toBe(true);
    });

    it('is false for Syms with the same feature, but different values', () => {
      ss = new Sym('NP', { tense: 'pres' });
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches(ss)).toBe(false);
    });

    it('is true for Syms with the same feature and value', () => {
      ss = new Sym('NP', { tense: 'past' });
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches(ss)).toBe(true);
    });

    it('is false for Syms with diff names, but same features & values', () => {
      ss = new Sym('S', { tense: 'past' });
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches(ss)).toBe(false);
    });

    it('matches plain objects that have the same name but no features', () => {
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches({
        name: 'NP'
      })).toBe(true);
    });

    it('matches plain objects with the same name and diff features', () => {
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches({
        name: 'NP',
        num: 'pl'
      })).toBe(true);
    });

    it('fails for plain objects with same features but diff values', () => {
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches({
        name: 'NP',
        tense: 'pres'
      })).toBe(false);
    });

    it('matches plain objects with same features and same values', () => {
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches({
        name: 'NP',
        tense: 'past'
      })).toBe(true);
    });

    it('matches plain objects with same features and same values', () => {
      s = new Sym('NP', { tense: 'past' });
      expect(s.matches({
        name: 'NP',
        tense: 'past'
      })).toBe(true);
    });

    it('is true for equivalent sub-features', () => {
      ss = new Sym('N', { subcat: ['NP', 'NP', 'VP'] });
      s = new Sym('N', { subcat: ['NP', 'NP', 'VP'] });
      expect(s.matches(ss)).toBe(true);
    });

    it('is false for non-equivalent sub-features', () => {
      ss = new Sym('N', { subcat: ['NP', 'NP', 'VP'] });
      s = new Sym('N', { subcat: ['NP', 'VP'] });
      expect(s.matches(ss)).toBe(false);
    });

    it('is true with Sym objects as features/sub-features', () => {
      ss = new Sym('N');
      s = new Sym('V');

      var ps = new Sym('S', { subcat: [ss, s] })
        , os = new Sym('S', { subcat: [ss, s] });

      expect(ps.matches(os)).toBe(true);
    });

    it('is false when features are arrays of different lengths', () => {
      ss = new Sym('N');
      s = new Sym('V');

      var ps = new Sym('S', { subcat: [ss, s] })
        , os = new Sym('S', { subcat: [ss] });

      expect(ps.matches(os)).toBe(false);
    });

    it('is false when features have different Sym values', () => {
      ss = new Sym('N');
      s = new Sym('V');

      var ps = new Sym('S', { subcat: [s] })
        , os = new Sym('S', { subcat: [ss] });

      expect(ps.matches(os)).toBe(false);
    });

  });

});
