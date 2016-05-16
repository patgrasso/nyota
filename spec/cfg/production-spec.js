/*global describe, it, expect, beforeAll, jasmine*/

const Sym         = require('../../cfg/symbol');
const Production  = require('../../cfg/production');
var   p, f;

describe('Production', () => {

  var s, np, vp, pp, npSg, npPl;

  beforeAll(() => {
    s     = new Sym('S');
    np    = new Sym('NP');
    vp    = new Sym('VP');
    pp    = new Sym('PP');
    npSg  = new Sym('NP', { num: 'sg' });
    npPl  = new Sym('NP', { num: 'sg' });
  });

  describe('constructor', () => {

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

  describe('equals', () => {

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

    it('interprets > 3 arguments as LHS = args[1:], RHS = args[2:]', () => {
      p = new Production(s, np, vp);
      expect(p.equals(s, np, vp)).toBe(true);
    });

    it('fails if the RHS (specified as sequential args) do not match', () => {
      p = new Production(s, np, vp);
      expect(p.equals(s, npSg, pp)).toBe(false);
    });

  });

});
