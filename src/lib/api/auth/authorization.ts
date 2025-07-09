//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { UserRole } from '@/data/feature';
import { UserRequest, UserResponse } from '@/interfaces/user.interface';

export class AuthorizationService {
  private static rolePriority: Record<UserRole, number> = {
    [UserRole.MASTER_ADMIN]: 3, // Assuming MASTER_USER is the highest role
    [UserRole.SUPER_ADMIN]: 2,
    [UserRole.ADMIN]: 1,

    // lower roles these role will be like user only
    [UserRole.USER]: 0,
    [UserRole.GUEST]: 0,
    [UserRole.SUPPLIER]: 0,
    [UserRole.MANAGER]: 0,
    [UserRole.EMPLOYEE]: 0,
    [UserRole.AUDITOR]: 0,
  };

  public static getHightest(roles: UserRole[]): UserRole {
    if (!roles || roles.length === 0) {
      throw new Error('Logged user or roles are not defined');
    }

    const highestRole = roles.reduce((highest, current) => {
      return this.rolePriority[current] > this.rolePriority[highest]
        ? current
        : highest;
    }, roles[0]);

    return highestRole;
  }

  public static hasEqualOrHigherRole(
    roles: UserRole[],
    requiredRole: UserRole,
  ): boolean {
    if (!roles || roles.length === 0) {
      console.error('Logged user or roles are not defined');
      return false;
    }

    // check of support role - logged user

    const highestRole = this.getHightest(roles);
    return this.rolePriority[highestRole] >= this.rolePriority[requiredRole];
  }

  public static hasEqualOrLowerRole(
    roles: UserRole[],
    requiredRole: UserRole,
  ): boolean {
    if (!roles || roles.length === 0) {
      console.error('Logged user or roles are not defined');
      return false;
    }

    const highestRole = this.getHightest(roles);
    return this.rolePriority[highestRole] <= this.rolePriority[requiredRole]; // Use highestRole instead of loggedUser.roles[0]
  }

  public static hasHigherRole(
    roles: UserRole[],
    requiredRole: UserRole,
  ): boolean {
    if (!roles || roles.length === 0) {
      console.error('Logged user or roles are not defined');
      return false;
    }

    const highestRole = this.getHightest(roles); // Use highestRole instead of loggedUser.roles[0]
    return this.rolePriority[highestRole] > this.rolePriority[requiredRole];
  }

  public static hasLowerRole(
    roles: UserRole[],
    requiredRole: UserRole,
  ): boolean {
    if (!roles || roles.length === 0) {
      console.error('Logged user or roles are not defined');
      return false;
    }
    const highestRole = this.getHightest(roles); // Use highestRole instead of loggedUser.roles[0]
    console.log(
      `Highest role: ${this.rolePriority[highestRole]}, Required role: ${this.rolePriority[requiredRole]}`,
    );
    return this.rolePriority[highestRole] < this.rolePriority[requiredRole];
  }

  public static authorizeUser(
    loggedUser: UserResponse,
    resource: string,
  ): boolean {
    console.log(
      `Authorizing loggedUser ${loggedUser?._id} for resource ${resource}`,
    );
    return true;
  }

  public static getUserPermissions(loggedUser: UserResponse): string[] {
    // This should return a list of permissions for the loggedUser
    // For now, returning an empty array
    console.log(`Fetching permissions for loggedUser ${loggedUser?._id}`);
    return [];
  }

  public hasPermission(
    loggedUser: UserResponse,
    permission: string[],
  ): boolean {
    const userPermissions = AuthorizationService.getUserPermissions(loggedUser);
    return userPermissions.some((per) => permission.includes(per));
  }

  public static hasAccessToCreateUser(
    loggedUser: UserResponse,
    newUser: UserRequest,
  ) {
    // Assigned three admin role only one can be assigned
    if (
      newUser.roles.filter((r) =>
        [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(
          r,
        ),
      ).length > 1
    ) {
      throw new Error('Only one admin role can be assigned to a user');
    }

    // organization & unit match should match
    // const validateOrgAndUnit = () => {
    //   if (loggedUser?.roles.includes(UserRole.MASTER_ADMIN) && newUser.roles.includes(UserRole.ADMIN)) {
    //     if (!newUser.organization) {
    //       throw new Error('Admin user must belong to a organization');
    //     }

    //     if (loggedUser?.roles.includes(UserRole.MASTER_ADMIN) && (newUser.roles.includes(UserRole.USER) || newUser.roles.includes(UserRole.GUEST))) {)) {
    //       if (!(newUser.organization && newUser.unit)) {
    //         throw new Error('Admin user must belong to a organization and unit');
    //       }
    //     }

    //   if (loggedUser?.roles.includes(UserRole.SUPER_ADMIN) && newUser.roles.includes(UserRole.ADMIN)) {
    //     if (!(newUser.organization && newUser.organization === loggedUser.organization)) {
    //       throw new Error('Admin user must have same org as logged user to a organization');
    //     }
    //   }

    //   if (
    //     (loggedUser?.roles.includes(UserRole.SUPER_ADMIN) || loggedUser?.roles.includes(UserRole.ADMIN)) &&
    //     (newUser.roles.includes(UserRole.USER) || newUser.roles.includes(UserRole.GUEST))
    //   ) {
    //     if (loggedUser?.organization !== newUser.organization || loggedUser?.unit !== newUser.unit) {
    //       throw new Error('User must belong to the same organization and unit as the logged-in user');
    //     }
    //   }
    // };

    // if (loggedUser?.roles?.includes(UserRole.MASTER_ADMIN)) {
    //   // validateOrgAndUnit();
    //   return true; // Master Admin can create any loggedUser
    // }

    // Super Admin can create users with roles USER, GUEST, and ADMIN
    // if (loggedUser?.roles?.includes(UserRole.SUPER_ADMIN)) {
    //   // validateOrgAndUnit();
    //   const allowedRole = [UserRole.USER, UserRole.GUEST, UserRole.ADMIN];
    //   return newUser.roles.every(r => allowedRole.includes(r));
    // }

    // Admin can create role havi
    // if (loggedUser?.roles?.includes(UserRole.ADMIN)) {
    //   // validateOrgAndUnit();
    //   const allowedRole = [UserRole.USER, UserRole.GUEST];
    //   if (!newUser.roles.every(r => allowedRole.includes(r))) {
    //     throw new Error('User can only be assigned USER or GUEST roles');
    //   }
    // }

    // To create SUPER_ADMIN does not require any org or unit

    // To create ADMIN requires org
    // if (loggedUser?.roles?.includes()) {
    //   // Support can create users with roles USER and GUEST
    //   const allowedRole = [UserRole.USER, UserRole.GUEST];
    //   if (!newUser.roles.every(role => allowedRole.includes(role))) {
    //     throw new Error('Support can only create users with USER or GUEST roles');
    //   }
    // }

    return true;
  }
}
