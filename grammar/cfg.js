'use strict';

const Sym         = require('./symbol');
const Production  = require('./production');

const priv        = new WeakMap();

class CFG {

  constructor() {
    priv[this] = {
      symbols     : [],
      productions : []
    };
  }

  symbol(name, features) {
    var symbols     = priv[this].symbols
      , symbol
      , i;

    // Error checking and parameter switching
    if (typeof name === 'object') {
      features      = name;
    }
    name            = (typeof name === 'string') ? name : features.name;
    features        = features || {};

    // If the thing passed in is a Sym, we cannot assign to it's
    // name, so don't bother
    if (!(features instanceof Sym)) {
      features.name = name;
    }

    for (i in symbols) {
      if (symbols[i].equals(features)) {
        return symbols[i];
      }
    }

    // Same thing as before...if `features` is, in fact, a Sym, don't try to
    // delete the name and don't bother instantiating a new Sym. Rather, use
    // the one given by the user
    symbol = features;
    if (!(features instanceof Sym)) {
      delete features.name;
      symbol = new Sym(name, features);
    }

    priv[this].symbols.push(symbol);
    return symbol;
  }

  symbols() {
    return priv[this].symbols;
  }

  production(lhs, rhs) {
    var productions = priv[this].productions
      , production
      , i;

    // If LHS is a Production object, just add it and return it
    if (lhs instanceof Production) {
      productions.push(lhs);
      return lhs;
    }

    // If LHS is not a Sym, make it one
    if (!(lhs instanceof Sym) && lhs != null) {
      lhs = this.symbol(lhs);
    }

    // If we have more than two arguments, then the user specified the entire
    // RHS as the remainder of arguments > args[0]
    if (arguments.length > 2) {
      rhs = Array.prototype.slice.call(arguments, 1);
    }

    // If RHS is not an array, make it one
    if (!Array.isArray(rhs)) {
      rhs = [rhs];
    }

    // Furthermore, if the RHS doesn't contain symbols, turn the RHS into an
    // array of symbols (whether or not they are already symbols will be
    // handled by this.symbol())
    rhs = rhs.map(obj => this.symbol(obj));

    for (i in productions) {
      if (productions[i].matches(lhs, rhs)) {
        return productions[i];
      }
    }

    if (lhs == null) {
      throw new TypeError('No matching RHS Production found, and LHS is null');
    }
    production = new Production(lhs, rhs);
    priv[this].productions.push(production);
    return production;
  }

  productions(lhs, rhs, env) {
    if (lhs == null && rhs == null) {
      return priv[this].productions;
    }
    if (rhs != null && !Array.isArray(rhs)) {
      rhs = [rhs];
    }
    return priv[this].productions.filter(p => p.matches(lhs, rhs, env));
  }

}

module.exports = CFG;
