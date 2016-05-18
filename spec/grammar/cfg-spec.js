/*global jasmine, describe, it, expect, beforeEach*/

const CFG         = require('../../grammar/cfg');
const Sym         = require('../../grammar/symbol');
const Production  = require('../../grammar/production');

var   cfg, s, p, f, env;

describe('CFG', () => {

  describe('symbol()', () => {

    beforeEach(() => (cfg = new CFG()));

    it('creates a new symbol given just a name', () => {
      s = cfg.symbol('S');
      expect(s).toEqual(jasmine.any(Sym));
      expect(s.name).toBe('S');
      expect(Object.keys(s)[0]).toBe('name');
    });

    it('creates a new symbol given a name and features', () => {
      s = cfg.symbol('V', { num: 'pl' });
      expect(s.name).toBe('V');
      expect(s.num).toBe('pl');
    });

    it('creates a new symbol with just an object specifying `name`', () => {
      s = cfg.symbol({ name: 'S' });
      expect(s.name).toBe('S');
    });

    it('registers & returns the same Sym if a Sym is given', () => {
      var newS = new Sym('S', { person: 3 });
      s = cfg.symbol(newS);
      expect(s).toBe(newS);
      expect(s.person).toBe(3);
      expect(s.name).toBe('S');
    });

    it('returns an existing Sym equaling that requested if it exists', () => {
      s = cfg.symbol('S');
      expect(cfg.symbol('S')).toBe(s);
    });

    it('returns an existing Sym equaling that requested if it exists', () => {
      s = cfg.symbol('S');
      expect(cfg.symbol('S')).toBe(s);
    });

    it('throws an error when no argument is given', () => {
      expect(cfg.symbol).toThrowError();
    });

    it('does not return "matching" symbols that are not equal', () => {
      s = cfg.symbol('S', { num: 'pl' });
      expect(cfg.symbol('S')).not.toEqual(s);
    });

  });

  describe('symbols()', () => {

    it('returns a list of all symbols', () => {
      cfg = new CFG();
      cfg.symbol('S');
      cfg.symbol('N');
      cfg.symbol('V');
      expect(cfg.symbols().length).toBe(3);
      expect(cfg.symbols()).toContain(cfg.symbol('S'));
      expect(cfg.symbols()).toContain(cfg.symbol('N'));
      expect(cfg.symbols()).toContain(cfg.symbol('V'));
    });

  });

  describe('production()', () => {

    beforeEach(() => (cfg = new CFG()));

    it('creates a Production given a Sym and a Sym[]', () => {
      p = cfg.production(
        cfg.symbol('S'),
        [cfg.symbol('NP'), cfg.symbol('VP')]
      );
      expect(p.lhs).toBe(cfg.symbol('S'));
      expect(p.rhs).toContain(cfg.symbol('NP'));
      expect(p.rhs).toContain(cfg.symbol('VP'));
    });

    it('fails to create a Production when no RHS is given', () => {
      f = () => cfg.production(cfg.symbol('S'));
      expect(f).toThrowError();
    });

    it('accepts a sole Sym for the RHS (and turns it into an array)', () => {
      p = cfg.production(
        cfg.symbol('S'),
        cfg.symbol('NP')
      );
      expect(p.lhs).toBe(cfg.symbol('S'));
      expect(p.rhs).toContain(cfg.symbol('NP'));
    });

    it('crashes given nothing', () => {
      f = () => cfg.production();
      expect(f).toThrowError();
    });

    it('accepts a string for the LHS argument (will auto-create a Sym)', () => {
      p = cfg.production('S', cfg.symbol('NP'));
      expect(p.lhs).toBe(cfg.symbol('S'));
    });

    it('accepts a plain obj for the LHS argument (auto-creates a Sym)', () => {
      p = cfg.production({ name: 'NP', num: 'pl' }, cfg.symbol('N'));
      expect(p.lhs).toBe(cfg.symbol({ name: 'NP', num: 'pl' }));
    });

    it('accepts strings as names for the RHS symbols', () => {
      p = cfg.production('S', ['NP', 'VP']);
      expect(p.rhs).toContain(cfg.symbol('NP'));
      expect(p.rhs).toContain(cfg.symbol('VP'));
    });

    it('accepts plain objects as symbols for the RHS symbols', () => {
      p = cfg.production(
        'S',
        [
          { name: 'NP', num: 'pl' },
          { name: 'VP', num: 'pl' }
        ]
      );
      expect(p.rhs).toContain(cfg.symbol('NP', { num: 'pl' }));
      expect(p.rhs).toContain(cfg.symbol('VP', { num: 'pl' }));
    });

    it('takes "the rest" of arguments to be the RHS if > 2 args', () => {
      p = cfg.production('S', 'NP', 'VP');
      expect(p.lhs).toBe(cfg.symbol('S'));
      expect(p.rhs.length).toBe(2);
      expect(p.rhs).toContain(cfg.symbol('NP'));
      expect(p.rhs).toContain(cfg.symbol('VP'));
    });

    it('returns an existing production that equals the one requested', () => {
      p = cfg.production('S', 'NP', 'VP');
      expect(cfg.production('S', 'NP', 'VP')).toBe(p);
    });

    it('find a production with a matching RHS when LHS is nil', () => {
      p = cfg.production('S', 'NP', 'VP');
      expect(cfg.production(null, 'NP', 'VP')).toBe(p);
    });

    it('throws error if no prod. exists with matching RHS (& LHS nil)', () => {
      p = cfg.production('S', 'NP', 'VP');
      f = () => cfg.production(null, 'N', 'N');
      expect(f).toThrowError();
    });

    it('accepts a Production object', () => {
      p = new Production(cfg.symbol('S'), cfg.symbol('NP'), cfg.symbol('VP'));
      expect(cfg.production(p)).toBe(p);
    });

  });

  describe('productions()', () => {

    beforeEach(() => {
      cfg = new CFG();
      cfg.production('S', 'NP', 'VP');
      cfg.production('NP', 'Det', 'N');
      cfg.production('NP', 'Det', 'N', 'PP');
      cfg.production('VP', 'V', 'NP');
    });

    it('finds all productions matching the LHS if only LHS is given', () => {
      p = cfg.productions(cfg.symbol('NP'));
      expect(p.length).toBe(2);
      expect(p).toContain(cfg.production(null, 'Det', 'N'));
      expect(p).toContain(cfg.production(null, 'Det', 'N', 'PP'));
    });

    it('finds all productions matching the RHS if only RHS is given', () => {
      p = cfg.productions(null, [
        cfg.symbol('Det'),
        cfg.symbol('N')
      ]);
      expect(p.length).toBe(1);
      expect(p).toContain(cfg.production('NP', 'Det', 'N'));
    });

    it('returns all productions if no arguments are specified', () => {
      expect(cfg.productions().length).toBe(4);
      expect(cfg.productions()).toContain(
        cfg.production('S', 'NP', 'VP')
      );
      expect(cfg.productions()).toContain(
        cfg.production('NP', 'Det', 'N')
      );
      expect(cfg.productions()).toContain(
        cfg.production('NP', 'Det', 'N', 'PP')
      );
      expect(cfg.productions()).toContain(
        cfg.production('VP', 'V', 'NP')
      );
    });

    it('accepts a lone Sym for the RHS argument (turns it into an [])', () => {
      cfg.production('S', 'NP');
      p = cfg.productions(cfg.symbol('S'), cfg.symbol('NP'));
      expect(p.length).toBe(1);
      expect(p).toContain(cfg.production('S', 'NP'));
    });

    // With variables

    it('omits productions that violate the bound environment variables', () => {
      var vp;

      env = {};

      cfg.production('S', [
        { name: 'NP', num: '?n' },
        { name: 'VP', num: '?n' }
      ]);
      cfg.production({ name: 'NP', num: '?n' }, { name: 'N', num: '?n' });
      vp = cfg.production({ name: 'VP', num: '?n' }, [
        { name: 'V', num: '?n' },
        { name: 'NP', num: '?n' }
      ]);

      cfg.production({ name: 'N', num: 'pl' }, 'elephants');
      cfg.production({ name: 'V', num: 'pl' }, 'eat');
      cfg.production({ name: 'N', num: 'sg' }, 'peanut');

      // Get the production N[num=pl] -> 'elephants'
      p = cfg.productions(null, cfg.symbol('elephants'), env);

      // Get the production NP[num=?n] -> N[num=?n]
      p = cfg.productions(null, p[0].lhs, env);

      // At this point, the environment should be {n: 'pl'}
      expect(env.n).toBe('pl');

      p = cfg.productions(null, cfg.symbol('eat'), env);
      p = cfg.productions(null, [
        p[0].lhs,
        { name: 'NP', num: '?n' }
      ], env);
      expect(p.length).toBe(1);
      expect(p).toContain(vp);

      p = cfg.productions(null, cfg.symbol('peanut'), env);
      p = cfg.productions(null, [
        { name: 'V', num: '?n' },
        p[0].lhs
      ], env);
      expect(p.length).toBe(0);
      expect(p).not.toContain(vp);
    });

  });

});
