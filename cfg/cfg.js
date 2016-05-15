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
    name            = name || features.name;
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

    // If LHS is not a Sym, make it one
    if (!(lhs instanceof Sym)) {
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
      if (productions[i].equals(lhs, rhs)) {
        return productions[i];
      }
    }
    production = new Production(lhs, rhs);
    priv[this].productions.push(production);
    return production;
  }

  productions(lhs, rhs) {
    if (lhs == null && rhs == null) {
      return priv[this].productions;
    }
    if (arguments.length > 2) {
      rhs = Array.prototype.slice.call(arguments, 1);
    }
    if (!Array.isArray(rhs)) {
      rhs = [rhs];
    }
    return priv[this].productions.filter(p => p.equals(lhs, rhs));
  }

}


var cfg = new CFG()
  , s   = cfg.symbol('S')
  , np  = cfg.symbol('NP')
  , ss  = cfg.symbol('S');

console.log(s === ss);
console.log(np);
console.log(cfg.symbols());


console.log(cfg.production('S', 'NP'));
console.log(cfg.production('S', 'NP', 'VP'));
console.log(cfg.productions());

console.log('----');

console.log(cfg.production(
  cfg.symbol('S'),
  [
    cfg.symbol('NP'),
    cfg.symbol('DP')
  ]
));

console.log(cfg.symbols());
