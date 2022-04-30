const toString = Object.prototype.toString;

function isMergeableObject(value) {
  return !!value
    && typeof value === 'object'
    && !['[object RegExp]', '[object Date]'].includes(toString.call(value));
}

/**
 * Default arrayMerge
 * @param {unknown[]} target
 * @param {unknown[]} source
 * @param {Array<string | number | symbol>} path
 * @param {DeepMergeProgram} mergeProgram
 */
function arrayMerge(target, source, path, mergeProgram) {
  const dest = mergeProgram.cloneUnlessOtherwiseSpecified(target);

  for (let i = 0; i < source.length; i++) {
    dest.push(mergeProgram.cloneUnlessOtherwiseSpecified(source[i]));
  }

  return dest;
}

/**
 * Default objectMerge
 * @param {unknown[]} target
 * @param {unknown[]} source
 * @param {Array<string | number | symbol>} path
 * @param {DeepMergeProgram} mergeProgram
 */
function objectMerge(target, source, path, mergeProgram) {
  const dest = mergeProgram.cloneUnlessOtherwiseSpecified(target);

  const sourceKeys = mergeProgram.getKeys(source);
  for (const key of sourceKeys) {
    if (mergeProgram.propertyIsUnsafe(target, key)) {
      continue;
    }

    if (mergeProgram.propertyIsOnObject(target, key) && mergeProgram.isMergeableObject(source[key])) {
      dest[key] = mergeProgram.mergeUnlessCustomSpecified(target[key], source[key], [...path, key]);
    } else {
      dest[key] = mergeProgram.cloneUnlessOtherwiseSpecified(source[key]);
    }
  }

  return dest;
}

class DeepMergeProgram {
  constructor(options = {}) {
    this.isMergeableObject = options.isMergeableObject || isMergeableObject;
    this.arrayMerge = options.arrayMerge || arrayMerge;
    this.objectMerge = options.objectMerge || objectMerge;
    this.customMerge = options.customMerge;
    this.clone = options.clone !== false;
    this.includeSymbol = options.includeSymbol !== false;
  }

  merge(target, source, path = []) {
    if (Array.isArray(source)) {
      if (Array.isArray(target)) {
        return this.arrayMerge(target, source, path, this);
      } else {
        return this.cloneUnlessOtherwiseSpecified(source);
      }
    }

    if (this.isMergeableObject(source)) {
      if (!Array.isArray(target) && this.isMergeableObject(target)) {
        return this.objectMerge(target, source, path, this);
      } else {
        return this.cloneUnlessOtherwiseSpecified(source);
      }
    }

    return source;
  }

  cloneUnlessOtherwiseSpecified(value) {
    return this.clone ? this.deepClone(value) : value;
  }

  deepClone(value, stack = []) {
    if (Array.isArray(value)) {
      if (stack.includes(value)) {
        return undefined;
      }
      stack.push(value);

      return value.map(it => this.deepClone(it, [...stack]));
    }

    if (this.isMergeableObject(value)) {
      if (stack.includes(value)) {
        return undefined;
      }
      stack.push(value);

      const obj = {};
      const keys = this.getKeys(value);
      for (const key of keys) {
        obj[key] = this.deepClone(value[key], [...stack]);
      }
      return obj;
    }

    return value;
  }

  mergeUnlessCustomSpecified(target, source, path) {
    if (!this.customMerge) {
      return this.merge(target, source, path);
    }

    const customMerge = this.customMerge(path);
    if (typeof customMerge === 'function') {
      return customMerge(target, source, path, this);
    }

    return this.merge(target, source, path);
  }

  getKeys(object) {
    const keys = Object.keys(object);
    if (!this.includeSymbol) {
      return keys;
    }

    return Object.keys(object).concat(this.getEnumerableOwnPropertySymbols(object));
  }

  /**
   *
   * @param {Object} object
   * @returns
   */
  getEnumerableOwnPropertySymbols(object) {
    // eslint-disable-next-line no-prototype-builtins
    return Object.getOwnPropertySymbols(object).filter(symbol => object.propertyIsEnumerable(symbol));
  }

  propertyIsOnObject(object, property) {
    try {
      return property in object;
    } catch (_) {
      return false;
    }
  }

  // Protects from prototype poisoning and unexpected merging up the prototype chain.
  propertyIsUnsafe(object, property) {
    return this.propertyIsOnObject(object, property) // Properties are safe to merge if they don't exist in the target yet,
      && !(Object.hasOwnProperty.call(object, property) // unsafe if they exist up the prototype chain,
        && Object.propertyIsEnumerable.call(object, property)); // and also unsafe if they're nonenumerable.
  }
}

export function deepMerge(target, source, options) {
  return new DeepMergeProgram(options).merge(target, source);
}
