export const isBoolean = (v: any): v is boolean => {
  return typeof v === "boolean";
};

export const isNumber = (v: any): v is number => {
  return typeof v === "number";
};

export const isString = (v: any): v is string => {
  return typeof v === "string";
};

export const isSymbol = (v: any): v is symbol => {
  return typeof v === "symbol";
};

export const isFunction = (v: any): v is (...args: any[]) => any => {
  return typeof v === "function";
};

export const isObject = (v: any): v is object => {
  return v != null && typeof v === "object" && !Array.isArray(v);
};

export const isObjectLike = (v: any): boolean => {
  return v != null && typeof v === "object";
};

export const isPlainObject = (v: any): boolean => {
  if (v != null && typeof v === "object") {
    const p = Object.getPrototypeOf(v);
    if (p == null || p === Object.prototype) {
      return true;
    }
  }
  return false;
};

export const isDate = (v: any): v is Date => {
  return Object.prototype.toString.call(v) === "[object Date]";
};
