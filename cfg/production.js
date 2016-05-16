'use strict';

const Sym = require('./symbol');


class Production {

  constructor(lhs, rhs) {
    if (lhs == null) {
      throw new TypeError('LHS cannot be null');
    }

    if (arguments.length > 2 || !Array.isArray(rhs)) {
      rhs = Array.prototype.slice.call(arguments, 1);
    }

    this.lhs = lhs;
    this.rhs = rhs || [];

    Object.defineProperty(this, 'equals', {
      value: Production.equals.bind(null, this)
    });
  }


  /**
   * Compares two Productions, or a Production and a LHS symbol, or a
   * Production and an array of RHS symbols, or a Production, a LHS symbol,
   * and a RHS array of symbols.
   *
   * If the passed in comparees are equal (by measure of Sym.equals), then
   * true will be returned. If any one comparison fails, false instead.
   *
   * Possible ways to call this:
   * ```
   *    Production.equals({Production}, {Production})
   *    Production.equals({Production}, {Sym} <LHS>)
   *    Production.equals({Production}, {Sym[]} <RHS>)
   *    Production.equals({Production}, {Sym} <LHS>, {Sym[]} <RHS>)
   *    Production.equals({Production}, {Sym} <LHS>, {Sym}, {Sym}, ... <RHS>)
   * ```
   *
   * @static
   * @method equals
   * @param {Production} prod The production to compare against
   * @param {Production|Sym|Sym[]} lhs Either a Production, a Sym, or an
   *    array of Syms. Depending on which is passed, it will be interpreted
   *    differently
   * @param {Sym[]|Sym...} [rhs] If a LHS Sym is passed via `lhs`, this can be
   *    used to specify the RHS. It can be either an array, or a sequence of
   *    arguments
   * @return {Boolean} True if whatever is passed in appears in the Production
   *    (for instance, if only the RHS is passed in, only the RHS will be
   *    compared). If any of the comparisons fail, false
   */
  static equals(prod, lhs, rhs) {
    var i;

    if (!(prod instanceof Production)) {
      throw new TypeError('First argument must be an instance of  Production');
    }

    // If > 3 args are specified, then the caller is specifying the RHS with
    // those symbols at [2:]
    if (arguments.length > 3) {
      rhs = Array.prototype.slice.call(arguments, 2);
    }

    // The case where `lhs` is a Production (Production v Production)
    if (lhs instanceof Production) {
      rhs = lhs.rhs;
      lhs = lhs.lhs;
    }

    // The case where lhs AND rhs are specified
    if (lhs instanceof Sym && Array.isArray(rhs)) {
      if (
        !prod.lhs.equals(lhs) ||
        prod.rhs.length !== rhs.length
      ) {
        return false;
      }
      for (i in prod.rhs) {
        if (!prod.rhs[i].equals(rhs[i])) {
          return false;
        }
      }
      return true;
    }

    // The case where only lhs is specified
    if (lhs instanceof Sym) {
      return prod.lhs.equals(lhs);
    }

    // The case where `lhs` is actually the rhs incognito
    if (Array.isArray(lhs)) {
      rhs = lhs;
      if (prod.rhs.length !== rhs.length) {
        return false;
      }
      for (i in prod.rhs) {
        if (!prod.rhs[i].equals(rhs[i])) {
          return false;
        }
      }
      return true;
    }
    throw new TypeError('Cannot compare whatever was passed in');
  }

}

module.exports = Production;
