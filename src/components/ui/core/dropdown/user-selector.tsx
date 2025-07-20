//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import { SearchQuery } from '@/lib/api/search-query';
import { useUsers } from '@/lib/api/user/get-users';

import { AsyncAutocompleteCombobox } from './async-autocomplete';
import { getUserName } from '../../user/user-list-avatar';

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
  onUserChange?: (value: string | null) => void;
  selectedUser?: string | null;
  unit?: string;
  organization?: string;
};

const UserDropdown = ({
  unit,
  organization,
  onUserChange,
  selectedUser,
  form, // mantine form instance or Mantine form instance
}: Props) => {
  const { data: users, isLoading: usersLoading } = useUsers({
    params: SearchQuery.userSearchQuery({
      unit: form.values.unit ?? unit,
      organization: form.values.organization ?? organization,
    }),
  });

  return (
    <LoaderWrapper isLoading={usersLoading} loadingText="Loading users ...">
      <AsyncAutocompleteCombobox
        label="User"
        placeholder="Select user"
        data={
          users?.data?.map((user) => ({
            label: getUserName(user),
            value: user._id,
          })) || []
        }
        // if form then pass form related props else pass normal props
        {...(form
          ? {
              selected: form.values.user ?? '',
              onChange: (value) => form.setFieldValue('user', value),
            }
          : {
              selected: selectedUser ?? '',
              onChange: (value) => {
                onUserChange?.(value);
              },
            })}
        loading={usersLoading}
      />
    </LoaderWrapper>
  );
};

export default UserDropdown;
