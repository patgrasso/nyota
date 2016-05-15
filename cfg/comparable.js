'use strict';


const TYPE_ORDER = [
  'undefined',
  'null',
  'number',
  'string',
  'object',
  'array',
  'function'
];


function type(obj) {
  if (obj === null) {
    return 'null';
  }
  if (Array.isArray(obj)) {
    return 'array';
  }
  return typeof obj;
}


class Comparable extends Object {

  constructor(obj) {
    super();

    Object.defineProperty(this, 'compare', {
      value: Comparable.compare.bind(null, this)
    });
    Object.defineProperty(this, 'equals', {
      value: Comparable.equals.bind(null, this)
    });

    if (obj !== undefined && typeof obj !== 'object') {
      throw new TypeError(`Invalid object '${obj}'`);
    }

    for (let prop in obj) {
      this[prop] = obj[prop];
    }
  }

  static compare(objA, objB) {
    let typeA = type(objA)
      , typeB = type(objB)
      , prop, ret;

    if (typeA !== typeB) {
      return TYPE_ORDER.indexOf(typeA) - TYPE_ORDER.indexOf(typeB);
    }

    if (
      typeA === 'object' &&
      Object.keys(objA).length !== Object.keys(objB).length
    ) {
      return Object.keys(objA).length - Object.keys(objB).length;
    } else if (typeA === 'string') {
      return (objA < objB) ? -1 : 1;
    } else if (typeA === 'number') {
      return objA - objB;
    } else if (typeA === 'array') {
      return objA.length - objB.length;
    }

    for (prop in objA) {
      switch (typeof objA[prop]) {
      case 'object':
        if ((ret = Comparable.compare(objA[prop], objB[prop])) !== 0) {
          return ret;
        }
        break;

      case 'function':
        break;

      default:
        if (objA[prop] !== objB[prop]) {
          return Comparable.compare(objA[prop], objB[prop]);
        }
        break;
      }
    }
    return 0;
  }

  static equals(objA, objB) {
    return Comparable.compare(objA, objB) === 0;
  }

}

module.exports = Comparable;
