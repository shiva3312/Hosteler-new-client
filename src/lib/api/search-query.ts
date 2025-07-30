//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { UserRole } from '@/data/feature';

import { store } from '../store';
export class SearchQuery {
  public static getContext() {
    return store.getState().context;
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
  public static organizationSearchQuery(
    organizations?: string[],
  ): Record<string, any> {
    const context = this.getContext();

    // If no organization is provided, use the context organization
    const query: Record<string, any> = {};

    if (!organizations || organizations.length === 0) {
      query.organization =
        context?.selectedOrganization ?? context?.user?.organization;
    } else {
      query.organization = { in: organizations };
    }

    // logger.info('organizationSearchQuery', query);
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
    units?: string[];
  }): Record<string, any> {
    const context = this.getContext();

    // If no organization is provided, use the context organization
    const query: Record<string, any> = {};
    if (!args?.organization) {
      query.organization =
        context?.selectedOrganization ??
        context?.user?.organization ??
        undefined;
    } else {
      query.organization = { in: args?.organization };
    }

    if (!args?.units || args?.units.length === 0) {
      query._id = context?.selectedUnit ?? context?.user?.unit ?? undefined;
    } else {
      query._id = { in: args?.units };
    }

    // logger.info('unitSearchQuery', query);
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
    const context = this.getContext();

    // If no organization is provided, use the context organization
    const query: Record<string, any> = {};
    if (!args?.organization)
      args.organization = context?.user?.organization ?? undefined;
    if (!args?.unit) args.unit = context?.user?.unit ?? undefined;
    else {
      query.organization = args?.organization;
    }
    if (args?.unit) {
      query.unit = args?.unit;
    }
    // logger.info('groupSearchQuery', query);
    return query;
  }

  /**
   * @param organization The organization ID to filter by.
   * @param unit The unit ID to filter by.
   * Generates a MongoDB query to check if a user belongs to a specific organization and unit.
   * This is useful for filtering users that are associated with a particular organization and unit.
   * @returns
   */
  public static userSearchQuery(args?: {
    organization?: string;
    unit?: string;
    hasAllRoles?: UserRole[];
    anyRoles?: UserRole[];
    usersId?: string[];
  }): Record<string, any> {
    const context = this.getContext();
    const query: Record<string, any> = {};
    // If no organization or unit is provided, return an empty query
    if (!args?.organization)
      query.organization =
        context?.selectedOrganization ??
        context?.user?.organization ??
        undefined;
    if (!args?.unit)
      query.unit = context?.selectedUnit ?? context?.user?.unit ?? undefined;

    query.organization = args?.organization;
    query.unit = args?.unit;

    if (args?.hasAllRoles && args?.hasAllRoles.length > 0) {
      query.roles = { all: args?.hasAllRoles };
    }

    if (args?.anyRoles && args?.anyRoles.length > 0) {
      query.roles = { in: args?.anyRoles };
    }

    if (args?.anyRoles && args?.anyRoles.length > 0) {
      query.roles = { in: args?.anyRoles };
    }

    if (args?.usersId) {
      query._id = { in: args?.usersId };
    }

    return query;
  }

  public static scheduleSearchQuery(args?: {
    organization?: string[];
    unit?: string[];
    scheduleFor?: string[];
  }): Record<string, any> {
    const context = this.getContext();
    const query: Record<string, any> = {};

    if (!args?.organization || args?.organization.length === 0) {
      query.organization =
        context?.selectedOrganization ??
        context?.user?.organization ??
        undefined;
    } else {
      query.organization = { in: args?.organization };
    }

    if (!args?.unit || args?.unit.length === 0) {
      query.unit = context?.selectedUnit ?? context?.user?.unit ?? undefined;
    } else {
      query.unit = { in: args?.unit };
    }

    if (args?.scheduleFor && args?.scheduleFor.length > 0) {
      query.scheduleFor = { in: args?.scheduleFor };
    }

    return query;
  }

  public static mealChartSearchQuery(args?: {
    organization?: string[];
    unit?: string[];
    mealType?: string[];
  }): Record<string, any> {
    const context = this.getContext();
    const query: Record<string, any> = {};

    if (!args?.organization || args?.organization.length === 0) {
      query.organization =
        context?.selectedOrganization ??
        context?.user?.organization ??
        undefined;
    } else {
      query.organization = { in: args?.organization };
    }

    if (!args?.unit || args?.unit.length === 0) {
      query.unit = context?.selectedUnit ?? context?.user?.unit ?? undefined;
    } else {
      query.unit = { in: args?.unit };
    }

    if (args?.mealType && args?.mealType.length > 0) {
      query.mealType = { in: args?.mealType };
    }

    return query;
  }

  public static mealPreferenceSearchQuery(args?: {
    organization?: string[];
    unit?: string[];
    users?: string[];
  }): Record<string, any> {
    const context = this.getContext();
    const query: Record<string, any> = {};

    if (!args?.organization || args?.organization.length === 0) {
      query.organization =
        context?.selectedOrganization ??
        context?.user?.organization ??
        undefined;
    } else {
      query.organization = { in: args?.organization };
    }

    if (!args?.unit || args?.unit.length === 0) {
      query.unit = context?.selectedUnit ?? context?.user?.unit ?? undefined;
    } else {
      query.unit = { in: args?.unit };
    }

    if (args?.users && args?.users.length > 0) {
      query.user = { in: args?.users };
    }

    return query;
  }
}
