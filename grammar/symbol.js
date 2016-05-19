/*eslint no-fallthrough:0*/
'use strict';


class Sym {

  constructor(name, features) {
    var prop;

    if (typeof name !== 'string' && typeof name === 'object') {
      features = name;
      name = features.name;
      delete features.name; }

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


  static matches(symA, symB, env) {
    var typeA = typeof symA
      , typeB = typeof symB;

    // Instantiate environment if one is not provided
    env = env || {};

    if (typeof env !== 'object') {
      throw new TypeError('Environment must be an object');
    }

    // Both are null -> true
    if (symA == null && symB == null) {
      return {};
    }

    // If either symA or symB is not an object, delegate to Sym.equals()
    if (typeA !== 'object' || typeB !== 'object') {
      return Sym.equals(symA, symB);
    }

    // At this point, both must be non-null objects
    // Compare features (must be equal IF they exist)
    if (
      !compareAttributes(symA, symB, env) ||
      !compareAttributes(symB, symA, env)
    ) {
      return null;
    }
    return env;
  }

}


function compareAttributes(symA, symB, env) {
  var prop, ret;

  if (Array.isArray(symA) && Array.isArray(symB)) {
    if (symA.length !== symB.length) {
      return false;
    }
  }
  for (prop in symA) {
    if (symB[prop] !== undefined || extractVarName(symA[prop]) != null) {
      switch (typeof symA[prop]) {
      case 'object':
        if (!Sym.matches(symA[prop], symB[prop], env)) {
          return false;
        }
        break;

      case 'function':
        break;

      case 'string':
        // Check to see if one of the symbols has a variable for this property
        // If so, compare & set vars appropriately in the environment
        ret = checkVariables(symA, symB, prop, env);
        if (ret === false) {
          return false;
        } else if (ret === true) {
          break;
        }
        // if ret === null, fall through to ordinary comparison (this means
        // that neither symbols had variables for this property)

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


function extractVarName(str) {
  return ((typeof str === 'string') && (str[0] === '?')) ? str.slice(1) : null;
}


function checkVariables(symA, symB, prop, env) {
  var varA = extractVarName(symA[prop])
    , varB = extractVarName(symB[prop]);

  if (
    ((varA != null) && symB[prop] === undefined) ||
    ((varB != null) && symA[prop] === undefined)
  ) {
    return true;
  }
  if (varA && varB) {
    if (!env[varA] && !env[varB]) {
      return true;
    }
    if (
      !checkOrSetVariable(varA, env, env[varB] || symB[prop]) ||
      !checkOrSetVariable(varB, env, env[varA] || symA[prop])
    ) {
      return false;
    }
  } else if ((varA != null) && !checkOrSetVariable(varA, env, symB[prop])) {
    return false;
  } else if ((varB != null) && !checkOrSetVariable(varB, env, symA[prop])) {
    return false;
  }
  if ((varA != null) || (varB != null)) {
    return (env[varB] != null) || (env[varA] != null);
  }
  return null;
}


function checkOrSetVariable(varName, env, value) {
  if (env[varName] === undefined) {
    env[varName] = value;
    return true;
  }
  return Sym.matches(env[varName], value);
}


module.exports = Sym;
