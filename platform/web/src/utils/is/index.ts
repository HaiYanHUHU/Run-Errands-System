const toString = Object.prototype.toString;

/**
 * @description: Determines whether the value does not have a type
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  Function or not
 */
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, 'Function');
}

/**
 * @description: Defined or not
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== 'undefined';
};

export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};
/**
 * @description: Object or not
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};

/**
 * @description: time or not
 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date');
}

/**
 * @description:  Value or not
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number');
}

/**
 * @description:  AsyncFunction or not
 */
export function isAsyncFunction<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'AsyncFunction');
}

/**
 * @description:  promise or not
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

/**
 * @description:  string or not
 */
export function isString(val: unknown): val is string {
  return is(val, 'String');
}

/**
 * @description:  boolean or not
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean');
}

/**
 * @description:  isArray or not
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val);
}

/**
 * @description: Client or not 
 */
export const isClient = () => {
  return typeof window !== 'undefined';
};

/**
 * @description: window or not 
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window');
};

export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName;
};

export const isServer = typeof window === 'undefined';

// img or not 
export function isImageDom(o: Element) {
  return o && ['IMAGE', 'IMG'].includes(o.tagName);
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val);
}

export function isUrl(val: string) {
  if (/^http/.test(val) || /\/\//.test(val)) {
    return true;
  }
  return false;
}

export function isFloat(val: unknown): val is number {
  return Number(val) === val && val % 1 !== 0;
}
