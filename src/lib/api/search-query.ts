//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { UserRole } from '@/data/feature';

import { store } from '../store';
import { ContextState } from '../store/slice/context-slice';

export class SearchQuery {
  private static context: ContextState;

  constructor() {
    SearchQuery.context = store.getState().context;
  }

  /**
   * Generates a MongoDB query to check if the user has at least one of the specified roles.
   * @param conditions Array of roles to check.
   * @returns A MongoDB query object.
   */
  public static hasAnyRole(conditions: UserRole[]): Record<string, any> {
    const query: Record<string, any> = {};
    if (!conditions || conditions.length === 0) {
      return query; // Return an empty query if no conditions are provided
    }
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
    const query: Record<string, any> = {};
    if (!conditions || conditions.length === 0) {
      return query;
    }
    return {
      roles: { all: conditions }, // Use `$all` for "all of these roles"
    };
  }

  /**
   * Generates a MongoDB query to check if the user has a specific role.
   * @param organization The organization ID to filter by.
   * Generates a MongoDB query to check if an organization matches the provided ID.
   * If no organization is provided, it uses the context organization.
   * This is useful for filtering organizations based on the current context or a specific organization ID.
   * @returns
   */
  public static organizationSearchQuery(): Record<string, any> {
    // If no organization is provided, use the context organization
    const query: Record<string, any> = { ttt: 'sdf' };

    console.log('organizationSearchQuery', query);
    return query;
  }

  /**
   * @param organization The organization ID to filter by.
   * Generates a MongoDB query to check if a unit belongs to a specific organization.
   * This is useful for filtering units that are associated with a particular organization.
   * @returns
   */
  public static unitSearchQuery(args: {
    organization?: string[];
  }): Record<string, any> {
    // If no organization is provided, use the context organization
    const query: Record<string, any> = {};
    if (!args?.organization) {
      query.organization = this.context?.organization ?? undefined;
    } else {
      query.organization = { in: args.organization };
    }
    console.log('unitSearchQuery', query);
    return query;
  }

  /**
   * @param organization The organization ID to filter by.
   * Generates a MongoDB query to check if a group belongs to a specific organization.
   * This is useful for filtering groups that are associated with a particular organization.
   * If no organization is provided, it uses the context organization.
   * @returns A MongoDB query object.
   */
  public static groupSearchQuery(args: {
    organization?: string;
    unit?: string;
  }): Record<string, any> {
    // If no organization is provided, use the context organization
    const query: Record<string, any> = {};
    if (!args?.organization)
      args.organization = this.context?.organization ?? undefined;
    if (!args?.unit) args.unit = this.context?.unit ?? undefined;
    else {
      query.organization = args.organization;
    }
    if (args.unit) {
      query.unit = args.unit;
    }
    console.log('groupSearchQuery', query);
    return query;
  }

  /**
   * @param organization The organization ID to filter by.
   * @param unit The unit ID to filter by.
   * Generates a MongoDB query to check if a user belongs to a specific organization and unit.
   * This is useful for filtering users that are associated with a particular organization and unit.
   * @returns
   */
  public static userSearchQuery(args: {
    organization?: string;
    unit?: string;
    hasAllRoles?: UserRole[];
    anyRoles?: UserRole[];
  }): Record<string, any> {
    // If no organization or unit is provided, return an empty query
    if (!args?.organization)
      args.organization = this.context?.organization ?? undefined;
    if (!args?.unit) args.unit = this.context?.unit ?? undefined;

    const query: Record<string, any> = {
      organization: args.organization,
      unit: args.unit,
    };

    if (args.hasAllRoles && args.hasAllRoles.length > 0) {
      query.roles = { all: args.hasAllRoles };
    }

    if (args.anyRoles && args.anyRoles.length > 0) {
      query.roles = { in: args.anyRoles };
    }

    return query;
  }
}
