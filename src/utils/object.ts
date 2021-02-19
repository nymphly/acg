export function isObject(item: unknown): boolean {
  return item instanceof Object && item.constructor === Object;
}

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
