//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { MultiSelect } from '@mantine/core';
import { useMemo } from 'react';

import { UserRole } from '@/data/feature';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useMe } from '@/lib/api/user/get-me';

type Props = {
  /**
   * Form instance to manage form state.
   * If provided, the component will use mantine form props & need not to pass other props.
   * If not provided, it will use normal props.
   * This is useful for integrating with mantine forms.
   * If you want to use this component without mantine form, pass `undefined` or `null` here.
   * @default undefined
   * @example
   * <UserUnitDropdown
   *   onUserChange={handleUserChange}
   *   onUnitChange={handleUnitChange}
   *   selectedUser={selectedOrg}
   *   selectedUnit={selectedUnit}
   * />
   * @example
   * <UserUnitDropdown
   *   form={form} // mantine form instance
   * />
   * @note If you are using this component with mantine form, No need to pass any other props
   */
  form?: any; // mantine form instance or Mantine form instance

  /**
   * Callbacks to handle user and unit changes.
   * If you are using this component with mantine form, No need to pass these props.
   *
   * @note If you are not using mantine form, you must provide these callbacks.
   */
  selectedRoles?: string[] | null;
  onRolesChange?: (value: string[] | null) => void;
};

const UserRoleDropdown = ({
  selectedRoles, // added selectedRoles
  onRolesChange, // added onRolesChange
  form, // mantine form instance or Mantine form instance
}: Props) => {
  //   const { data: users, isLoading: usersLoading } = useUsers({
  //     params: SearchQuery.userSearchQuery({
  //       unit: form.values.unit ?? unit,
  //       organization: form.values.organization ?? organization,
  //     }),
  //   });
  const { data: me } = useMe();

  const options = useMemo(() => {
    if (
      AuthorizationService.hasLowerRole(me?.data.roles ?? [], UserRole.ADMIN)
    ) {
      return {
        value: UserRole.GUEST,
        label: 'Guest',
      };
    }

    const userRoles = Object.entries(UserRole).map(([key, value]) => ({
      value,
      label: key,
    }));
    // Remove roles that the user cannot assign
    const filteredUserRoles = userRoles.filter((role) => {
      const x = AuthorizationService.hasHigherRole(
        me?.data?.roles ?? [],
        role.value as UserRole,
      );

      return x;
    });

    return filteredUserRoles;
  }, [me?.data.roles]);

  return (
    <MultiSelect
      mt={'md'}
      label="Select Roles"
      key={form.key('roles')}
      description="Select one or more roles for the user"
      placeholder="Pick value"
      data={options}
      {...form.getInputProps('roles')}
      //   onChange={(value) => {
      //     form.setFieldValue('roles', value as UserRole[]);

      //     if (value.includes(UserRole.MASTER_ADMIN)) {
      //       form.setFieldValue('organization', null);
      //       form.setFieldValue('unit', null);
      //     }
      //     if (value.includes(UserRole.SUPER_ADMIN)) {
      //       form.setFieldValue('unit', null);
      //     }
      //   }}
      {...(form
        ? {
            selected: form.values.roles ?? '',
            onChange: (value) => {
              form.setFieldValue('roles', value);

              if (value.includes(UserRole.MASTER_ADMIN)) {
                form.setFieldValue('organization', null);
                form.setFieldValue('unit', null);
              }
              if (value.includes(UserRole.SUPER_ADMIN)) {
                form.setFieldValue('unit', null);
              }
            },
          }
        : {
            selected: selectedRoles ?? '',
            onChange: (value) => {
              onRolesChange?.(value);
            },
          })}
      searchable
    />
  );
};

export default UserRoleDropdown;
