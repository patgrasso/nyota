'use strict';

const Sym = require('./symbol');


/**
 * Represents a Production in a CFG, with a single left-hand side (LHS) symbol
 * and an array of symbols on the right-hand side (RHS), that which are the
 * result of expanding the LHS symbol.
 *
 * @class Production
 */
class Production {

  /**
   * Constructs a new Production, given a left-hand side symbol and a right-hand
   * side array of symbols (symbols should be instances of Sym).
   *
   * @constructor
   * @param {Sym|Object} lhs A sole object/Sym used to represent the left-hand
   *    side of the production
   * @param {Sym[]|Sym...} rhs An ordered list of Syms that will represent the
   *    right-hand side of the production. This list can be specified either as
   *    an array, or a sequence of arguments
   */
  constructor(lhs, rhs) {
    if (lhs == null) {
      throw new TypeError('LHS cannot be null');
    }

    if (arguments.length > 2 || !Array.isArray(rhs)) {
      rhs = Array.prototype.slice.call(arguments, 1);
    }

    this.lhs = lhs;
    this.rhs = rhs;

    Object.defineProperty(this, 'equals', {
      value: Production.equals.bind(null, this)
    });
    Object.defineProperty(this, 'matches', {
      value: Production.matches.bind(null, this)
    });
  }


  /**
   * Compares a Production with either another Production, a LHS Sym, or a
   * number of other combinations of LHS and RHS Syms to determine whether two
   * Productions are equal. This function delegates to `compareProduction()`.
   * @see compareProduction() for a better explanation of parameters, return
   * values, etc.
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
    var ret;

    // If there are more arguments than named, assume those past the 2nd
    // comprise the RHS
    if (arguments.length > 3) {
      rhs = Array.prototype.slice.call(arguments, 2);
    }

    ret = compareProduction(Sym.equals, prod, lhs, rhs);
    return (ret !== false) && (ret !== null);
  }


  /**
   * Matches a Production with either another Production, a LHS Sym, or a
   * number of other combinations of LHS and RHS Syms to determine whether two
   * Productions are similar. This function delegates to `compareProduction()`.
   * @see compareProduction() for a better explanation of parameters, return
   * values, etc.
   *
   * As opposed to `Production.equals()`, `Production.matches()` uses
   * `Sym.matches()` to compare symbols, and maintains the environment while
   * comparing all symbols on both the LHS and RHS, so that any variables
   * matched and defined while comparing one symbol will carry through when
   * comparing other Syms.
   *
   * @static
   * @method matches
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
  static matches(prod, lhs, rhs) {
    var ret;

    // If there are more arguments than named, assume those past the 2nd
    // comprise the RHS
    if (arguments.length > 3) {
      rhs = Array.prototype.slice.call(arguments, 2);
    }

    ret = compareProduction(Sym.matches, prod, lhs, rhs);
    return (ret !== false) && (ret !== null);
  }

}


/**
 * Compares two Productions, or a Production and a LHS symbol, or a
 * Production and an array of RHS symbols, or a Production, a LHS symbol,
 * and a RHS array of symbols.
 *
 * If the passed in comparees are equal (by measure of `predicate`), then
 * true will be returned. If any one comparison fails, false instead.
 *
 * Possible ways to call this:
 * ```
 *    compareProduction({Function}, {Production}, {Production})
 *    compareProduction({Function}, {Production}, {Sym} <LHS>)
 *    compareProduction({Function}, {Production}, {Sym[]} <RHS>)
 *    compareProduction({Function}, {Production}, {Sym} <LHS>, {Sym[]} <RHS>)
 *    compareProduction({Function}, {Production}, {Sym} <LHS>,
 *        {Sym}, {Sym}, ... <RHS>)
 * ```
 *
 * @function compareProduction
 * @param {Function<Sym, Sym, [Object]>} predicate A function that accepts at
 *    least two symbols, and optionally an environment. This function, as
 *    indicated by the name, is a *predicate* and should return a truthy/falsy
 *    value to determine whether the comparison was successful
 * @param {Production} prod The production to compare against
 * @param {Production|Sym|Sym[]} lhs Either a Production, a Sym, or an
 *    array of Syms. Depending on which is passed, it will be interpreted
 *    differently
 * @param {Sym[]|Sym...} [rhs] If a LHS Sym is passed via `lhs`, this can be
 *    used to specify the RHS. It can be either an array, or a sequence of
 *    arguments
 * @return {Boolean|?} True if whatever is passed in appears in the Production
 *    (for instance, if only the RHS is passed in, only the RHS will be
 *    compared). If any of the comparisons fail, false. It is also possible
 *    that the returned value be whatever is returned from `predicate()`.
 *    However, this value's truthiness _should_ represent the result of the
 *    comparision, so it can be used to loosely determine success
 *    e.g.
 *    ```
 *      if (predicate(...)) { } will work, but
 *      if (predicate(...) === true) { } is not guaranteed
 *    ```
 */
function compareProduction(predicate, prod, lhs, rhs) {
  var env = {}
    , i;

  if (!(prod instanceof Production)) {
    throw new TypeError('First argument must be an instance of Production');
  }

  // The case where `lhs` is a Production (Production v Production)
  if (lhs instanceof Production) {
    rhs = lhs.rhs;
    lhs = lhs.lhs;
  }

  // The case where lhs AND rhs are specified
  if (Array.isArray(rhs)) {
    // a. lhs is a Sym
    if (
      lhs != null &&
      (!predicate(prod.lhs, lhs, env) ||
      prod.rhs.length !== rhs.length)
    ) {
      return false;
    }
    // b. lhs is null (in which case, ignore it and only consider the RHS)
    for (i in prod.rhs) {
      if (!predicate(prod.rhs[i], rhs[i], env)) {
        return false;
      }
    }
    return true;
  }

  // The case where only lhs is specified
  if (lhs instanceof Sym) {
    return predicate(prod.lhs, lhs);
  }

  // The case where `lhs` is actually the rhs incognito
  if (Array.isArray(lhs)) {
    rhs = lhs;
    if (prod.rhs.length !== rhs.length) {
      return false;
    }
    for (i in prod.rhs) {
      if (!predicate(prod.rhs[i], rhs[i], env)) {
        return false;
      }
    }
    return true;
  }
  throw new TypeError('Cannot compare whatever was passed in');
}

module.exports = Production;
