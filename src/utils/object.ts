/**
 * @file
 *
 * Object-tools functionality.
 */

/**
 * @param value
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value instanceof Object && value.constructor === Object;
}

/**
 * @param obj
 */
export function recursiveClone(obj: UntypedObjectOrArray): UntypedObjectOrArray {
  let res: UntypedObjectOrArray;
  if (Array.isArray(obj)) {
    res = [];
    for (let i = 0; i < obj.length; i++) {
      if (i in obj) {
        res[i] = recursiveClone(<UntypedObjectOrArray>obj[i]);
      }
    }
  } else if (isObject(obj)) {
    res = {};
    Object.keys(obj).forEach((key) => {
      res[key] = recursiveClone(<UntypedObjectOrArray>obj[key]);
    });
  } else {
    return obj;
  }

  return res;
}
