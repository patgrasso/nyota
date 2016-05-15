'use strict';


class Sym {

  constructor(name, features) {
    var prop;

    features = features || {};
    if (typeof features !== 'object') {
      throw new TypeError('Features must be specified as an object');
    }

    Object.defineProperty(this, 'name', {
      value: name,
      enumerable: true
    });
    Object.defineProperty(this, 'equals', {
      value: Sym.equals.bind(null, this)
    });

    for (prop in features) {
      if (prop === 'name') {
        throw new Error('Invalid property name: \'name\'');
      }
      this[prop] = features[prop];
    }
  }


  static equals(symA, symB) {
    var typeA = typeof symA
      , typeB = typeof symB
      , prop;

    if (
      (symA == null && symB != null) ||
      (symA != null && symB == null) ||
      (typeA !== typeB)
    ) {
      return false;
    }

    if (symA == null && symB == null) {
      return true;
    }

    if (
      typeA === 'object' &&
      typeB === 'object' &&
      Object.keys(symA).length !== Object.keys(symB).length
    ) {
      return false;
    }

    for (prop in symA) {
      switch (typeof symA[prop]) {
      case 'object':
        if (!Sym.equals(symA[prop], symB[prop])) {
          return false;
        }
        break;

      case 'function':
        break;

      default:
        if (symA[prop] !== symB[prop]) {
          return false;
        }
        break;
      }
    }
    return true;
  }

}

module.exports = Sym;
