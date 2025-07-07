//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { UserRole } from '@/data/feature';

export class SearchQuery {
  private query: any;

  constructor(query?: any) {
    this.query = query;
  }

  /**
   * Generates a MongoDB query to check if the user has at least one of the specified roles.
   * @param conditions Array of roles to check.
   * @returns A MongoDB query object.
   */
  public static hasAnyRole(conditions: UserRole[]): Record<string, any> {
    return {
      roles: { in: conditions }, // Use `$in` for "any of these roles"
    };
  }

  /**
   * Generates a MongoDB query to check if the user has all of the specified roles.
   * @param conditions Array of roles to check.
   * @returns A MongoDB query object.
   */
  public static hasAllRoles(conditions: UserRole[]): Record<string, any> {
    return {
      roles: { all: conditions }, // Use `$all` for "all of these roles"
    };
  }
}
