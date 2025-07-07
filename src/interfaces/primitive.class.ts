//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';
import xss from 'xss';
import { z } from 'zod';

/**
 * A utility class providing various safe validation and sanitization methods using Zod.
 * This class helps sanitize and validate common types like strings, numbers, booleans, and more,
 * while preventing malicious input and ensuring data integrity.
 */
export class Primitive {
  /**
   * Creates a safe string schema that sanitizes input using `xss`, trims whitespace, and enforces length constraints.
   * @param key Optional: A label used for error messages (e.g., 'Email', 'Username').
   * @param allowedTags Optional: A list of HTML tags that should be preserved in the sanitized string.
   * @param min Optional: Minimum length for the string. If not provided, no minimum length is enforced.
   * @param max Optional: Maximum length for the string. If not provided, no maximum length is enforced.
   * @returns A Zod schema for a sanitized and validated string.
   */
  public static safeString = (
    key?: string,
    allowedTags: string[] = [],
    min?: number,
    max?: number,
  ) => {
    const xssOptions = {
      whiteList: allowedTags.reduce<Record<string, string[]>>((acc, tag) => {
        acc[tag] = [];
        return acc;
      }, {}),
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
    };

    return z
      .string({
        required_error: `${key ?? 'String'} is required`,
        invalid_type_error: `${key ?? 'String'} must be a string`,
      })
      .transform((val: string) => xss(val.trim(), xssOptions))
      .superRefine((val: string, ctx) => {
        if (min !== undefined && val.length < min) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            message: `${key ?? 'String'} must be at least ${min} characters long`,
            minimum: min,
            inclusive: true,
            type: 'string',
          });
        }
        if (max !== undefined && val.length > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            message: `${key ?? 'String'} must be at most ${max} characters long`,
            maximum: max,
            inclusive: true,
            type: 'string',
          });
        }
      });
  };

  /**
   * Creates a safe number schema that validates and transforms input into a valid number.
   * @param key Optional: A label used for error messages (e.g., 'Age', 'Price').
   * @param min Optional: Minimum value for the number. If not provided, no minimum value is enforced.
   * @param max Optional: Maximum value for the number. If not provided, no maximum value is enforced.
   * @returns A Zod schema for a validated number.
   */
  public static safeNumber = (key?: string, min?: number, max?: number) => {
    return z
      .union([z.string(), z.number()])
      .transform((val: string | number, ctx) => {
        if (typeof val === 'number') return val;
        const parsed = parseFloat(val);
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${key ?? 'Number'} is not a valid number`,
          });
          return z.NEVER;
        }
        return parsed;
      })
      .superRefine((val: number, ctx) => {
        if (
          min !== undefined &&
          max !== undefined &&
          min === max &&
          val !== min
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${key ?? 'Number'} must be exactly ${min}`,
          });
        }
        if (min !== undefined && val < min) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            message: `${key ?? 'Number'} must be at least ${min}`,
            minimum: min,
            inclusive: true,
            type: 'number',
          });
        }
        if (max !== undefined && val > max) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            message: `${key ?? 'Number'} must be at most ${max}`,
            maximum: max,
            inclusive: true,
            type: 'number',
          });
        }
      });
  };

  /**
   * Creates a safe boolean schema that validates and transforms input into a boolean value.
   * @param key Optional: A label used for error messages (e.g., 'Active', 'Enabled').
   * @returns A Zod schema for a validated boolean.
   */
  public static safeBoolean = (key = '') => {
    return z
      .union([
        z.boolean(),
        z
          .string()
          .transform((val: string) => xss(val.trim()))
          .refine((val) => val === 'true' || val === 'false', {
            message: `${key} Invalid value. Expected "true" or "false".`,
          })
          .transform((val) => val === 'true'),
      ])
      .superRefine((val, ctx) => {
        if (typeof val !== 'boolean') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${key} Invalid value. Expected true or false.`,
          });
        }
      });
  };

  /**
   * Creates a safe array schema that validates array length constraints.
   * @param minLength Optional: Minimum number of elements in the array. If not provided, no minimum is enforced.
   * @param maxLength Optional: Maximum number of elements in the array. If not provided, no maximum is enforced.
   * @returns A Zod schema for a validated array.
   */
  public static safeArray = (minLength?: number, maxLength?: number) => {
    return z
      .array(z.unknown())
      .refine(
        (val) => (minLength !== undefined ? val.length >= minLength : true),
        {
          message: `Array must have at least ${minLength} elements`,
        },
      )
      .refine(
        (val) => (maxLength !== undefined ? val.length <= maxLength : true),
        {
          message: `Array must have no more than ${maxLength} elements`,
        },
      );
  };

  /**
   * Creates a safe date schema that ensures the value is a valid date.
   * @param key Optional: A label used for error messages (e.g., 'Birthday', 'Created At').
   * @returns A Zod schema for a validated date.
   */
  public static safeDate = (key = '') => {
    return z.union([z.string(), z.number(), z.date()]).refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: `${key ?? 'Date'} Must be a valid date` },
    );
  };

  /**
   * Creates a safe time schema that ensures the value is a valid time in various formats:
   * - HH:MM AM/PM
   * - HH:MM:SS AM/PM
   * - HH:MM (24-hour)
   * - HH:MM:SS (24-hour)
   * @param key Optional: A label used for error messages (e.g., 'Start Time', 'End Time').
   * @returns A Zod schema for a validated time.
   */
  public static safeTime = (key = '') => {
    return z.string().refine(
      (val) =>
        /^([01]?\d|2[0-3]):([0-5]\d)(:[0-5]\d)?\s?(AM|PM|am|pm)?$/.test(val) || // 12-hour format with AM/PM
        /^([01]?\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(val), // 24-hour format
      {
        message: `${key ?? 'Time'} must be a valid time in HH:MM AM/PM, HH:MM:SS AM/PM, or 24-hour format`,
      },
    );
  };

  /**
   * Creates a safe email schema that validates the email format and ensures it is not empty.
   * @returns A Zod schema for a validated email address.
   */
  public static safeEmail = () => {
    return z.coerce
      .string()
      .email({ message: 'Must be a valid email address' })
      .refine((val) => val.trim().length > 0, {
        message: 'Email cannot be empty or only whitespace',
      })
      .transform((val) => val.trim().toLowerCase());
  };

  /**
   * Creates a safe URL schema that validates the URL format and ensures it uses HTTPS.
   * @param key Optional: A label used for error messages (e.g., 'Website URL').
   * @param allowedDomains Optional: A list of allowed domains for the URL.
   * @returns A Zod schema for a validated URL.
   */
  public static safeURL = (key = 'URL', allowedDomains: string[] = []) => {
    return z.coerce
      .string()
      .url({ message: `${key} must be a valid URL` })
      .refine((val) => val.startsWith('https://'), {
        message: `${key} must use HTTPS`,
      })
      .refine(
        (val) => {
          if (allowedDomains.length === 0) return true;
          try {
            const { hostname } = new URL(val);
            return allowedDomains.includes(hostname);
          } catch {
            return false;
          }
        },
        {
          message: `${key} must be from an allowed domain: ${allowedDomains.join(', ')}`,
        },
      );
  };

  /**
   * Creates a safe enum schema that validates the value against an enum.
   * @param enumObject The enum object to validate the value against.
   * @returns A Zod schema for a validated enum value.
   */
  public static safeEnum = <T extends Record<string, unknown>>(
    enumObject: T,
  ) => {
    return z.string().refine((val) => Object.values(enumObject).includes(val), {
      message: 'Value must be a valid enum member',
    });
  };

  /**
   * Creates a safe JSON schema that validates the input as a valid JSON string.
   * @returns A Zod schema for a validated JSON string.
   */
  public static safeJSON = () => {
    return z.string().refine(
      (val) => {
        try {
          JSON.parse(val);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: 'Must be a valid JSON string',
      },
    );
  };

  /**
   * Creates a safe object schema that ensures the value is an object.
   * @param schema The Zod schema describing the shape of the object.
   * @returns A Zod schema for a validated object.
   */
  public static safeObject = (schema: z.ZodRawShape) => {
    return z
      .object(schema)
      .refine((val) => typeof val === 'object' && val !== null, {
        message: 'Must be a valid object',
      });
  };

  /**
   * Creates a safe ID schema that validates an ID against multiple formats (UUID, CUID, MongoID, etc.).
   * @param type Optional: The type of ID to validate (e.g., 'uuid', 'cuid', 'nanoid').
   * @returns A Zod schema for a validated ID.
   */
  public static safeID = (type?: 'uuid' | 'cuid' | 'cuid2' | 'nanoid') => {
    return z.coerce.string().refine(
      (val) => {
        const UUID_REGEX =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const CUID_REGEX = /^c[^\s-]{24}$/;
        const CUID2_REGEX = /^[0-9a-zA-Z]{8,}$/;
        const NANOID_REGEX = /^[0-9a-zA-Z_-]{5,21}$/;
        const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;
        switch (type) {
          case 'uuid':
            return UUID_REGEX.test(val);
          case 'cuid':
            return CUID_REGEX.test(val);
          case 'cuid2':
            return CUID2_REGEX.test(val);
          case 'nanoid':
            return NANOID_REGEX.test(val);
          default:
            return MONGO_ID_REGEX.test(val);
        }
      },
      {
        message: `Must be a valid ${type}`,
      },
    );
  };

  /**
   * Creates a safe phone number schema that validates and formats a phone number.
   * @param key Optional: A label used for error messages (e.g., 'Phone Number').
   * @param countryCode Optional: The country code to validate the phone number against (default is 'IN').
   * @returns A Zod schema for a validated and formatted phone number.
   */
  public static safePhoneNumber = (key = '', countryCode?: CountryCode) => {
    return z
      .string()
      .refine(
        (val) => {
          const parsed = parsePhoneNumberFromString(val, countryCode ?? 'IN');
          return parsed?.isValid() ?? false;
        },
        {
          message: `Invalid ${key ?? 'phone number'}`,
        },
      )
      .transform((val) => {
        const parsed = parsePhoneNumberFromString(val, countryCode ?? 'IN');
        return parsed ? parsed.formatInternational() : val;
      });
  };
}
