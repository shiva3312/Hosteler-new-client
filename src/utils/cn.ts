//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { type ClassValue, clsx } from 'clsx';
import _ from 'lodash';
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

export class UtilHelper {
  /**
   * Flattens a nested object into a single level object with dot notation keys.
   * @param obj The object to flatten.
   * @param prefix The prefix for the keys.
   * @returns A flattened object.
   *
   * @example
   * const nestedObj = { a: { b: { c: 1 } }, d: 2 };
   * const flattened = UtilHelper.flattenObject(nestedObj);
   * logger.info(flattened); // { 'a.b.c': 1, d: 2 }
   */
  public static flattenObject(obj: any, prefix = ''): Record<string, any> {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const value = obj[key];
        const newKey = prefix ? `${prefix}.${key}` : key;

        if (_.isObject(value) && !Array.isArray(value)) {
          Object.assign(acc, UtilHelper.flattenObject(value, newKey)); // Recursively flatten
        } else {
          acc[newKey] = value; // Add the key-value pair
        }

        return acc;
      },
      {} as Record<string, any>,
    );
  }

  /**
   *  Checks if a value is considered "falsy" based on specific criteria.
   * @param {any} value - The value to check.
   * @param value The value to check.
   * @description Checks if a value is considered "falsy" based on specific criteria.
   * Falsy values include:
   * - Empty string
   * - Null
   * - Undefined
   * - Boolean false
   * - Zero
   * - Empty array
   * - Empty object
   * @returns True if the value is falsy, false otherwise.
   */
  public static isFalsyValue(value: any): boolean {
    // Check if the value is one of the specified "falsy" values
    return (
      value === '' || // Empty string
      value === null || // Null
      value === undefined || // Undefined
      value === false || // Boolean false
      value === 0 || // Zero
      (_.isArray(value) && _.isEmpty(value)) || // Empty array
      (_.isObject(value) && _.isEmpty(value)) // Empty object
    );
  }

  /**
   * Checks if all fields in an object or nested objects are falsy.
   * @param obj The object to check.
   * @returns True if all fields are falsy, false otherwise.
   *
   * @example
   * const data = { a: '', b: null, c: 0, d: {} };
   * logger.info(UtilHelper.isAllFieldsFalsy(data)); // true
   *
   * contain nested array of objects
   * const nestedData = { a: [{ x: '', y: null }, { z: 0 }], b: {} };
   * logger.info(UtilHelper.isAllFieldsFalsy(nestedData)); // true
   *
   * contain nested array of arrays
   * const nestedArray = { a: [[0, '', null], [false, undefined, []]], b: {} };
   * logger.info(UtilHelper.isAllFieldsFalsy(nestedArray)); // true
   *
   * contain nested array of strings
   * const nestedStrings = { a: ['', '', ''], b: {} };
   * logger.info(UtilHelper.isAllFieldsFalsy(nestedStrings)); // true
   */
  public static isAllFieldsFalsy(obj: any): boolean {
    if (!_.isObject(obj)) {
      // If it's not an object, check if the value itself is falsy
      return UtilHelper.isFalsyValue(obj);
    }

    // Recursively check all values in the object
    return _.every(obj, (value) => {
      if (_.isArray(value)) {
        // If the value is an array, check if all elements in the array are falsy
        return _.every(value, (item) => {
          if (_.isObject(item)) {
            // If the array contains objects, recursively check them
            return UtilHelper.isAllFieldsFalsy(item);
          }
          return UtilHelper.isFalsyValue(item);
        });
      }

      if (_.isObject(value)) {
        // If the value is an object, recursively check its fields
        return UtilHelper.isAllFieldsFalsy(value);
      }

      // Otherwise, check if the value is falsy
      return UtilHelper.isFalsyValue(value);
    });
  }

  /**
   * Removes unchanged values from an object based on a dirty map.
   * @param obj The object to process.
   * @param flatDirtyMap A map indicating which keys are "dirty".
   * @returns A new object with unchanged values removed.
   */
  public static removeUnchangedValues<T extends Record<string, any>>(
    obj: T,
    flatDirtyMap: Record<string, boolean>,
  ): Partial<T> {
    // Recursive helper function to process the object
    function processObject(currentObj: any, currentPath = ''): any {
      if (!_.isObject(currentObj) || _.isArray(currentObj)) {
        // If it's not an object (or is an array), return it as is
        return currentObj;
      }

      return _.reduce(
        currentObj,
        (result, value, key) => {
          const fullPath = currentPath ? `${currentPath}.${key}` : key;

          if (_.isObject(value) && !_.isArray(value)) {
            // Recursively process nested objects
            const nestedResult = processObject(value, fullPath);
            if (!_.isEmpty(nestedResult)) {
              result[key] = nestedResult;
            }
          } else if (flatDirtyMap[fullPath]) {
            // Include the value if it's marked as dirty
            result[key] = value;
          }

          return result;
        },
        {} as Record<string, any>,
      );
    }

    return processObject(obj);
  }
}
