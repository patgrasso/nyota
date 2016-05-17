/*global describe, it, expect, beforeAll, jasmine*/

const Sym         = require('../../grammar/symbol');
const Production  = require('../../grammar/production');
var   p, f;

describe('Production', () => {

  var s, np, vp, pp, npSg, npPl, npVarNum, vpVarNum, vpSg, vpPl;

  beforeAll(() => {
    s         = new Sym('S');
    np        = new Sym('NP');
    vp        = new Sym('VP');
    pp        = new Sym('PP');
    npSg      = new Sym('NP', { num: 'sg' });
    npPl      = new Sym('NP', { num: 'pl' });
    npVarNum  = new Sym('NP', { num: '?n' });
    vpSg      = new Sym('VP', { num: 'sg' });
    vpPl      = new Sym('VP', { num: 'pl' });
    vpVarNum  = new Sym('VP', { num: '?n' });
  });

  describe('constructor()', () => {

    it('rejects if no LHS is specified', () => {
      f = () => new Production();
      expect(f).toThrowError(TypeError);
    });

    it('allows no RHS to be specified', () => {
      f = () => new Production(s);
      expect(f).not.toThrow();
    });

    it('accepts an array on the RHS', () => {
      f = () => new Production(s, [np, vp]);
      expect(f).not.toThrow();
    });

    it('accepts a variable number of arguments ([1:] used for RHS)', () => {
      f = () => new Production(s, np, vp);
      expect(f).not.toThrow();
      expect(f().rhs.length).toBe(2);
    });

  });

  describe('equals() [static]', () => {

    it('throws an error when two incomparable things are passed in', () => {
      f = () => Production.equals('hello', 'there');
      expect(f).toThrowError(TypeError);
    });

  });

  describe('equals()', () => {

    it('is a static method', () => {
      expect(Production.equals).not.toBeUndefined();
    });

    it('exists for instances', () => {
      p = new Production(s, np);
      expect(p.equals).toEqual(jasmine.any(Function));
    });

    it('is non-enumerable on instances', () => {
      p = new Production(s, np);
      expect(Object.keys(p).indexOf('equals')).toBe(-1);
    });

    it('is true for the same arg passed twice', () => {
      p = new Production(s, np);
      expect(p.equals(p)).toBe(true);
    });

    it('is true for two similar productions', () => {
      var p1  = new Production(s, np, vp);
      p       = new Production(s, np, vp);
      expect(p.equals(p1)).toBe(true);
    });

    it('is false for two productions with different RHSs', () => {
      var p1  = new Production(s, np, vp);
      p       = new Production(s, np);
      expect(p.equals(p1)).toBe(false);
    });

    it('is true if a sole Sym (assumed to be the LHS) matches', () => {
      p = new Production(s, np, vp);
      expect(p.equals(s)).toBe(true);
    });

    it('is false if a sole Sym (assumed to be the LHS) does not match', () => {
      p = new Production(s, np, vp);
      expect(p.equals(np)).toBe(false);
    });

    it('is true if a sole Sym[] (assumed to be the RHS) matches', () => {
      p = new Production(s, np, vp);
      expect(p.equals([np, vp])).toBe(true);
    });

    it('is false if a sole Sym[] (assumed to be RHS) does not match', () => {
      p = new Production(s, np, vp);
      expect(p.equals([s, vp])).toBe(false);
    });

    it('is true if both LHS (Sym) and RHS (Sym[]) match', () => {
      p = new Production(s, np, vp);
      expect(p.equals(s, [np, vp])).toBe(true);
    });

    it('is false if one of LHS or RHS do not match', () => {
      p = new Production(s, np, vp);
      expect(p.equals(np, [np, vp])).toBe(false);
      expect(p.equals(s, [npSg, npPl])).toBe(false);
    });

    it('interprets > 2 arguments as LHS = args[0], RHS = args[1:]', () => {
      p = new Production(s, np, vp);
      expect(p.equals(s, np, vp)).toBe(true);
    });

    it('fails if the RHS (specified as sequential args) do not match', () => {
      p = new Production(s, np, vp);
      expect(p.equals(s, npSg, pp)).toBe(false);
    });

    it('throws when a production is compared with an unexpected type', () => {
      p = new Production(s, np, vp);
      f = () => p.equals('incomparable type -- string');
      expect(f).toThrowError(TypeError);
    });

    it('fails when a production is compared with a RHS larger its rhs', () => {
      p = new Production(s, np);
      expect(p.equals([np, vp, npSg, npPl])).toBe(false);
    });

  });

  describe('matches() [static]', () => {

    it('throws an error when two incomparable things are passed in', () => {
      f = () => Production.matches('hello', 'there');
      expect(f).toThrowError(TypeError);
    });

  });

  describe('matches()', () => {

    it('is a static method', () => {
      expect(Production.matches).not.toBeUndefined();
    });

    it('exists for instances', () => {
      p = new Production(s, np);
      expect(p.matches).toEqual(jasmine.any(Function));
    });

    it('is non-enumerable on instances', () => {
      p = new Production(s, np);
      expect(Object.keys(p).indexOf('matches')).toBe(-1);
    });

    it('is true for the same arg passed twice', () => {
      p = new Production(s, np);
      expect(p.equals(p)).toBe(true);
    });

    it('is true for two similar productions', () => {
      var p1  = new Production(s, np, vp);
      p       = new Production(s, np, vp);
      expect(p.matches(p1)).toBe(true);
    });

    it('is false for two productions with different RHSs', () => {
      var p1  = new Production(s, np, vp);
      p       = new Production(s, np);
      expect(p.matches(p1)).toBe(false);
    });

    it('is true if a sole Sym (assumed to be the LHS) matches', () => {
      p = new Production(s, np, vp);
      expect(p.matches(s)).toBe(true);
    });

    it('is false if a sole Sym (assumed to be the LHS) does not match', () => {
      p = new Production(s, np, vp);
      expect(p.matches(np)).toBe(false);
    });

    it('is true if a sole Sym[] (assumed to be the RHS) matches', () => {
      p = new Production(s, np, vp);
      expect(p.matches([np, vp])).toBe(true);
    });

    it('is false if a sole Sym[] (assumed to be RHS) does not match', () => {
      p = new Production(s, np, vp);
      expect(p.matches([s, vp])).toBe(false);
    });

    it('is true if both LHS (Sym) and RHS (Sym[]) match', () => {
      p = new Production(s, np, vp);
      expect(p.matches(s, [np, vp])).toBe(true);
    });

    it('is false if one of LHS or RHS do not match', () => {
      p = new Production(s, np, vp);
      expect(p.matches(np, [np, vp])).toBe(false);
      expect(p.matches(s, [npSg, npPl])).toBe(false);
    });

    it('interprets > 2 arguments as LHS = args[0], RHS = args[1:]', () => {
      p = new Production(s, np, vp);
      expect(p.matches(s, np, vp)).toBe(true);
    });

    it('fails if the RHS (specified as sequential args) do not match', () => {
      p = new Production(s, np, vp);
      expect(p.matches(s, npSg, pp)).toBe(false);
    });

    it('throws when a production is compared with an unexpected type', () => {
      p = new Production(s, np, vp);
      f = () => p.matches('incomparable type -- string');
      expect(f).toThrowError(TypeError);
    });

    it('fails when a production is compared with a RHS larger its rhs', () => {
      p = new Production(s, np);
      expect(p.matches([np, vp, npSg, npPl])).toBe(false);
    });

    // Matching with variables

    it('is true if a variable production is matched with explicit Syms', () => {
      p = new Production(s, npVarNum, vpVarNum);
      expect(p.matches([npSg, vpSg])).toBe(true);
    });

    it('is false if the explicit Syms do not agree with the variables', () => {
      p = new Production(s, npVarNum, vpVarNum);
      expect(p.matches([npSg, vpPl])).toBe(false);
    });

    it('is true if a variable produciton is matched with explicit one', () => {
      var p1  = new Production(s, npVarNum, vpVarNum);
      p       = new Production(s, npSg, vpSg);
      expect(p.matches(p1)).toBe(true);
      expect(p1.matches(p)).toBe(true);
    });

    it('is false if a variable produciton disagrees with explicit one', () => {
      var p1  = new Production(s, npVarNum, vpVarNum);
      p       = new Production(s, npSg, vpPl);
      expect(p.matches(p1)).toBe(false);
      expect(p1.matches(p)).toBe(false);
    });

    it('correctly matches LHS variable/explicit productions rules', () => {
      p = new Production(npVarNum, s);
      expect(p.matches(npPl)).toBe(true);
    });

    it('maintains environment between LHS & RHS (true on good matches)', () => {
      p = new Production(npVarNum, npVarNum, vpVarNum);
      expect(p.matches(npPl, npPl, vpPl)).toBe(true);
    });

    it('maintains environment between LHS & RHS (false on bad matches)', () => {
      p = new Production(npVarNum, npVarNum, vpVarNum);
      expect(p.matches(npPl, npSg, vpSg)).toBe(false);
    });

  });

});
