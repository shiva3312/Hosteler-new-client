//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 * @note This function checks if a value is empty but do not check nested objects or arrays.
 * It returns true for null, undefined, empty string, and empty objects.
 * It returns false for non-empty strings, numbers, and non-empty objects.
 * @example
 * isEmpty(null); // true
 * isEmpty(''); // true
 * isEmpty('Hello'); // false
 * isEmpty(0); // false
 * isEmpty({}); // true
 * isEmpty({ key: 'value' }); // false
 * isEmpty([]); // true
 * isEmpty([1, 2, 3]); // false
 * isEmpty(undefined); // true
 * isEmpty({ a: { b: 'c' } }); // false (does not check nested objects)
 * isEmpty([1, 2, 3, []]); // false
 * isEmpty([1, 2, 3, {}]); // false
 * isEmpty([1, 2, 3, '']); // false
 * isEmpty([1, 2, 3, null]); // false
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};
