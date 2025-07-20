//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Grid } from '@mantine/core';
import { useEffect, useMemo } from 'react';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import { UserRole } from '@/data/feature';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { useMe } from '@/lib/api/user/get-me';

import { AsyncAutocompleteCombobox } from './async-autocomplete';

type Props = {
  /**
   * Form instance to manage form state.
   * If provided, the component will use mantine form props & need not to pass other props.
   * If not provided, it will use normal props.
   * This is useful for integrating with mantine forms.
   * If you want to use this component without mantine form, pass `undefined` or `null` here.
   * @default undefined
   * @example
   * <OrganizationUnitDropdown
   *   onOrganizationChange={handleOrganizationChange}
   *   onUnitChange={handleUnitChange}
   *   selectedOrganization={selectedOrg}
   *   selectedUnit={selectedUnit}
   * />
   * @example
   * <OrganizationUnitDropdown
   *   form={form} // mantine form instance
   * />
   * @note If you are using this component with mantine form, No need to pass any other props
   */
  form?: any; // mantine form instance or Mantine form instance

  /**
   * Callbacks to handle organization and unit changes.
   * If you are using this component with mantine form, No need to pass these props.
   *
   * @note If you are not using mantine form, you must provide these callbacks.
   */
  onOrganizationChange?: (value: string | null) => void;
  onUnitChange?: (value: string | null) => void;
  selectedOrganization?: string | null;
  selectedUnit?: string | null;
};

const OrganizationUnitDropdown = ({
  onOrganizationChange,
  onUnitChange,
  selectedOrganization,
  selectedUnit,
  form, // mantine form instance or Mantine form instance
}: Props) => {
  const { data: me } = useMe();

  const hasAccess = useMemo(() => {
    return (
      AuthorizationService.isNoneAdminRoles(me?.data?.roles ?? []) &&
      me?.data.roles?.some((role) =>
        [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(role),
      )
    );
  }, [me?.data?.roles]);

  const { data: organizations, isLoading: orgLoading } = useOrganizations({});
  const { data: units, isLoading: unitLoading } = useUnits({
    params: SearchQuery.unitSearchQuery({
      organization: [form.values.organization ?? selectedOrganization!],
    }),
    enabled: !!(form.values.organization || selectedOrganization),
  });

  useEffect(() => {
    const hasAdminOrLowerRole = AuthorizationService.hasEqualOrLowerRole(
      me?.data?.roles ?? [],
      UserRole.ADMIN,
    );
    const updateRequired = !form.values.unit || !form.values.organization;

    // update organization and unit if user has admin or lower role
    if (hasAdminOrLowerRole && updateRequired) {
      if (form) {
        form.setFieldValue('organization', me?.data?.organization ?? null);
        form.setFieldValue('unit', me?.data?.unit ?? null);
      } else {
        onOrganizationChange?.(me?.data?.organization ?? null);
        onUnitChange?.(me?.data?.unit ?? null);
      }
    }

    // If user is super admin and organization is not set, set it to user's organization
    if (
      me?.data.roles.includes(UserRole.SUPER_ADMIN) &&
      !form.values.organization
    ) {
      if (form) {
        form.setFieldValue('organization', me?.data?.organization ?? null);
      } else {
        onOrganizationChange?.(me?.data?.organization ?? null);
      }
    }
  }, [form, me?.data, onOrganizationChange, onUnitChange]);

  return (
    <>
      {hasAccess ? (
        <>No Access</>
      ) : (
        <LoaderWrapper
          isLoading={orgLoading || unitLoading}
          loadingText="Loading organizations and units..."
        >
          <Grid>
            {me?.data.roles?.includes(UserRole.MASTER_ADMIN) && (
              <Grid.Col>
                <AsyncAutocompleteCombobox
                  label="Organization"
                  placeholder="Select organization"
                  data={
                    organizations?.data?.map((org) => ({
                      label: org.name,
                      value: org._id,
                    })) || []
                  }
                  // if form then pass form related props else pass normal props
                  {...(form
                    ? {
                        selected: form.values.organization ?? '',
                        onChange: (value) =>
                          form.setFieldValue('organization', value),
                      }
                    : {
                        selected: selectedOrganization ?? '',
                        onChange: (value) => {
                          onOrganizationChange?.(value);
                          onUnitChange?.(null); // Reset unit when organization changes
                        },
                      })}
                  loading={orgLoading}
                />
              </Grid.Col>
            )}
            {me?.data.roles?.some((role) =>
              [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(role),
            ) && (
              <Grid.Col>
                <AsyncAutocompleteCombobox
                  label="Unit"
                  placeholder="Select Unit"
                  data={
                    units?.data?.map((unit) => ({
                      label: unit.name,
                      value: unit._id,
                    })) || []
                  }
                  noResultsText={
                    form.values.organization || selectedOrganization
                      ? 'No units found'
                      : 'Select an organization first'
                  }
                  loading={unitLoading}
                  {...(form
                    ? {
                        selected: form.values.unit ?? '',
                        onChange: (value) => form.setFieldValue('unit', value),
                      }
                    : {
                        selected: selectedUnit ?? '',
                        onChange: (value) => onUnitChange?.(value),
                      })}
                />
              </Grid.Col>
            )}
          </Grid>
        </LoaderWrapper>
      )}
    </>
  );
};

export default OrganizationUnitDropdown;
