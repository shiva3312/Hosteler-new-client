//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { type ClassValue, clsx } from 'clsx';
import _ from 'lodash';
import { twMerge } from 'tailwind-merge';

import { Link } from '@/components/layouts/dashboard-layout/sidebar-links';
import { ScheduleType } from '@/interfaces/enums';

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

  public static getPathByLabel(pathname: string, links: Link[]): string {
    for (const link of links) {
      // Check if the pathname matches the main link
      if (link.link === pathname) {
        // If the link has subLinks, append the first subLink label
        if (link.subLinks && link.subLinks.length > 0) {
          return `${link.label}:${link.subLinks[0].label}`; // ParentLabel:FirstChildLabel
        }
        return link.label; // Return the main label
      }

      // Check if the pathname matches any sublink
      if (link.subLinks) {
        for (const subLink of link.subLinks) {
          if (subLink.link === pathname) {
            // If the subLink has subLinks, append the first subLink label
            if (subLink.subLinks && subLink.subLinks.length > 0) {
              return `${link.label}:${subLink.label}:${subLink.subLinks[0].label}`; // ParentLabel:SubLabel:FirstChildLabel
            }
            return `${link.label}:${subLink.label}`; // ParentLabel:SubLabel
          }
        }
      }
    }

    // If no match is found, return an empty string or a default value
    return '';
  }
  public static generateCronExpression = ({
    occurrence,
    time,
    dayOfWeeks,
    daysOfMonth,
    monthsOfYear,
  }: {
    occurrence: ScheduleType; // e.g., 'daily', 'weekly', 'monthly', etc.
    time?: string; // Time in HH:mm format
    dayOfWeeks?: number[]; // Days of the week (0 = Sunday, 6 = Saturday)
    daysOfMonth?: number[]; // Days of the month (1-31)
    monthsOfYear?: number[]; // Months of the year (1-12)
  }): string => {
    // Default cron parts
    let minute = '*';
    let hour = '*';
    let dayOfMonth = '*';
    let month = '*';
    let dayOfWeek = '*';

    // Parse time (HH:mm)
    if (time) {
      const [parsedHour, parsedMinute] = time.split(':');
      hour = parsedHour || '*';
      minute = parsedMinute || '*';
    }

    // Adjust cron parts based on the occurrence
    switch (occurrence) {
      case ScheduleType.Daily:
        // Runs every day at the specified time
        dayOfMonth = '*';
        month = '*';
        dayOfWeek = '*';
        break;

      case ScheduleType.Weekly:
        // Runs on specific days of the week at the specified time
        dayOfMonth = '*';
        month = '*';
        dayOfWeek =
          dayOfWeeks && dayOfWeeks.length > 0 ? dayOfWeeks.join(',') : '*';
        break;

      case ScheduleType.Monthly:
        // Runs on specific days of the month at the specified time
        dayOfMonth =
          daysOfMonth && daysOfMonth.length > 0 ? daysOfMonth.join(',') : '*';
        month = '*';
        dayOfWeek = '*';
        break;

      case ScheduleType.Yearly:
        // Runs on specific months and days of the month at the specified time
        dayOfMonth =
          daysOfMonth && daysOfMonth.length > 0 ? daysOfMonth.join(',') : '*';
        month =
          monthsOfYear && monthsOfYear.length > 0
            ? monthsOfYear.join(',')
            : '*';
        dayOfWeek = '*';
        break;

      case ScheduleType.Custom:
        // Custom cron expression (use all provided fields)
        dayOfMonth =
          daysOfMonth && daysOfMonth.length > 0 ? daysOfMonth.join(',') : '*';
        month =
          monthsOfYear && monthsOfYear.length > 0
            ? monthsOfYear.join(',')
            : '*';
        dayOfWeek =
          dayOfWeeks && dayOfWeeks.length > 0 ? dayOfWeeks.join(',') : '*';
        break;

      default:
        throw new Error(`Unsupported occurrence type: ${occurrence}`);
    }

    // Construct the cron expression
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  };

  public static generatePassword = (): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '@$!%*?&';
    const allCharacters = uppercase + lowercase + numbers + specialCharacters;

    const getRandomChar = (chars: string) =>
      chars[Math.floor(Math.random() * chars.length)];

    // Ensure the password contains at least one of each required character type
    const password = [
      getRandomChar(uppercase),
      getRandomChar(lowercase),
      getRandomChar(numbers),
      getRandomChar(specialCharacters),
    ];

    // Fill the rest of the password with random characters to meet the length requirement
    while (password.length < 8) {
      password.push(getRandomChar(allCharacters));
    }

    // Shuffle the password to randomize character positions
    return password.sort(() => Math.random() - 0.5).join('');
  };
}
