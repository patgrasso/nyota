'use strict';

const Sym = require('./symbol');


class Production {

  constructor(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;

    Object.defineProperty(this, 'equals', {
      value: Production.equals.bind(null, this)
    });
  }

  static equals(prodA, prodB, rhs) {
    var i, temp, areEqual = true;

    if (!(prodA instanceof Production) && !(prodB instanceof Production)) {
      throw new TypeError('Neither comparee is a Production');
    }

    if (prodB instanceof Production) {
      temp  = prodB;
      prodB = prodA;
      prodA = temp;
    }

    if (prodB instanceof Sym) {
      areEqual = (rhs == null) || prodB.equals(prodA.lhs);
    }
    if (Array.isArray(rhs)) {
      prodB = rhs;
    }
    if (Array.isArray(prodB)) {
      areEqual = areEqual && (prodB.length <= prodA.rhs.length);
      for (i in prodA.rhs) {
        if (!prodA.rhs[i].equals(prodB[i])) {
          return false;
        }
      }
      return areEqual;
    }
  }

}

module.exports = Production;
