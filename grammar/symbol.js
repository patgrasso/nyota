'use strict';


class Sym {

  constructor(name, features) {
    var prop;

    if (typeof name !== 'string' && typeof name === 'object') {
      features = name;
      name = features.name;
      delete features.name;
    }

    features = features || {};

    if (name == null || typeof features !== 'object') {
      throw new TypeError('Features must be specified as an object');
    }

    Object.defineProperty(this, 'name', {
      value: name,
      enumerable: true
    });
    Object.defineProperty(this, 'equals', {
      value: Sym.equals.bind(null, this)
    });
    Object.defineProperty(this, 'matches', {
      value: Sym.matches.bind(null, this)
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


  static matches(symA, symB) {
    var typeA = typeof symA
      , typeB = typeof symB;

    // Both are null -> true
    if (symA == null && symB == null) {
      return true;
    }

    // If either symA or symB is not an object, delegate to Sym.equals()
    if (typeA !== 'object' || typeB !== 'object') {
      return Sym.equals(symA, symB);
    }

    // At this point, both must be non-null objects
    // Compare features (must be equal IF they exist)
    if (!compareAttributes(symA, symB) || !compareAttributes(symB, symA)) {
      return false;
    }
    return true;
  }

}


function compareAttributes(symA, symB) {
  var prop;

  if (Array.isArray(symA) && Array.isArray(symB)) {
    if (symA.length !== symB.length) {
      return false;
    }
  }
  for (prop in symA) {
    if (symB[prop] !== undefined) {
      switch (typeof symA[prop]) {
      case 'object':
        if (!Sym.matches(symA[prop], symB[prop])) {
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
  }
  return true;
}


module.exports = Sym;
