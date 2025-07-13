//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Link } from '@/components/layouts/dashboard-layout/sidebar-links';
import logger from '@/config/log';
import { paths } from '@/config/paths';
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

  private static roleMap: Record<
    string,
    { access: 'public' | 'authenticated' | 'role-based'; roles?: UserRole[] }
  > = {
    [paths.app.dashboard.getHref()]: { access: 'authenticated' }, // Public link
    [paths.app.organization.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN],
    }, // Role-based link
    [paths.app.unit.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN],
    },
    [paths.app.member.getHref()]: {
      access: 'authenticated',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    [paths.app.mess.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    [paths.app.mess.mealItem.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    [paths.app.mess.menu.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    [paths.app.mess.menuCycle.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    [paths.app.mess.mealChart.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    [paths.app.mess.mealPreference.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMIN],
    },
    [paths.app.settings.getHref()]: { access: 'authenticated' }, // Authenticated-only link
    [paths.app.systemSettings.user.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN],
    },
    [paths.app.systemSettings.group.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN],
    },
    [paths.app.systemSettings.feature.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN],
    },
    [paths.app.systemSettings.system.getHref()]: {
      access: 'role-based',
      roles: [UserRole.MASTER_ADMIN, UserRole.SUPER_ADMIN],
    },

    // for image
    ['uploads/686e353d136a8f4d7c868d66/medium.jpeg']: {
      access: 'public', // Public link for image
    },
  };

  // Function to check if a user has access to a link
  public static hasLinkAccess = (
    link: string,
    userRoles: UserRole[],
    isAuthenticated: boolean,
  ): boolean => {
    if (!AuthorizationService.roleMap[link]) {
      logger.error(`Access configuration for link "${link}" is not defined`);
      return false;
    }

    const accessInfo = AuthorizationService.roleMap[link];

    // Handle public links
    if (accessInfo.access === 'public') {
      return true;
    }

    // Handle authenticated-only links
    if (accessInfo.access === 'authenticated') {
      return isAuthenticated;
    }

    // Handle role-based links
    if (accessInfo.access === 'role-based') {
      if (!userRoles || userRoles.length === 0) {
        logger.error('User roles are not defined');
        return false;
      }

      // Get the highest role of the user
      const highestRole = AuthorizationService.getHightest(userRoles);

      // Check if the highest role is allowed for the link
      return accessInfo.roles?.includes(highestRole) ?? false;
    }

    // Default to no access if the access type is unknown
    return false;
  };

  // Function to filter links based on access
  public static filterLinksByAuthorization = (
    links: Link[],
    userRoles: UserRole[],
    isAuthenticated: boolean,
  ): Link[] => {
    return links
      .map((link) => {
        // Recursively filter subLinks
        const filteredSubLinks = link.subLinks
          ? AuthorizationService.filterLinksByAuthorization(
              link.subLinks,
              userRoles,
              isAuthenticated,
            )
          : undefined;

        // Check if the main link or any of its subLinks are accessible
        const hasAccess =
          AuthorizationService.hasLinkAccess(
            link.link,
            userRoles,
            isAuthenticated,
          ) ||
          (filteredSubLinks && filteredSubLinks.length > 0);

        if (hasAccess) {
          return { ...link, subLinks: filteredSubLinks };
        }

        return null; // Exclude links without access
      })
      .filter(Boolean) as Link[];
  };

  public static getHightest(roles: UserRole[]): UserRole {
    if (!roles || roles.length === 0) {
      return UserRole.USER;
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
      logger.error('Logged user or roles are not defined');
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
      logger.error('Logged user or roles are not defined');
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
      logger.error('Logged user or roles are not defined');
      return false;
    }

    const highestRole = this.getHightest(roles); // Use highestRole instead of loggedUser.roles[0]
    return this.rolePriority[highestRole] > this.rolePriority[requiredRole];
  }
  /**
   * Checks if the logged user has a role lower than the required role.
   * @param roles
   * @param requiredRole
   * @returns
   *
   * This method compares the highest role of the logged user with the required role.
   * If the highest role is lower than the required role, it returns true.
   * @example
   * hasLowerRole([UserRole.USER, UserRole.GUEST], UserRole.ADMIN) => true;
   * returns true if the highest role is USER or GUEST, and the required role is ADMIN.
   */
  public static hasLowerRole(
    roles: UserRole[],
    requiredRole: UserRole,
  ): boolean {
    if (!roles || roles.length === 0) {
      logger.error('Logged user or roles are not defined');
      return false;
    }
    const highestRole = this.getHightest(roles); // Use highestRole instead of loggedUser.roles[0]
    logger.info(
      `Highest role: ${this.rolePriority[highestRole]}, Required role: ${this.rolePriority[requiredRole]}`,
    );
    return this.rolePriority[highestRole] < this.rolePriority[requiredRole];
  }

  public static isNoneAdminRoles(roles: UserRole[]): boolean {
    if (!roles || roles.length === 0) {
      logger.error('Roles are not defined');
      return true;
    }

    // check highest role
    const highestRole = this.getHightest(roles);

    // check if the current role is lower than ADMIN ROle
    return AuthorizationService.hasLowerRole([highestRole], UserRole.ADMIN);
  }

  public static authorizeUser(
    loggedUser: UserResponse,
    resource: string,
  ): boolean {
    logger.info(
      `Authorizing loggedUser ${loggedUser?._id} for resource ${resource}`,
    );
    return true;
  }

  public static getUserPermissions(loggedUser: UserResponse): string[] {
    // This should return a list of permissions for the loggedUser
    // For now, returning an empty array
    logger.info(`Fetching permissions for loggedUser ${loggedUser?._id}`);
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
