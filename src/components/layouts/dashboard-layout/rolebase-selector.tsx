//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Flex } from '@mantine/core';
import { useSelector, useDispatch } from 'react-redux';

import { AsyncAutocompleteCombobox } from '@/components/ui/core/dropdown';
import { Action, Authorization } from '@/lib/api/auth/authorization-wrapper';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { RootState, AppDispatch } from '@/lib/store';
import { Selected, setSelected } from '@/lib/store/slice/context-slice';

function RoleBasedSelector() {
  const { selected } = useSelector((state: RootState) => state.context);
  const dispatch: AppDispatch = useDispatch();
  const { data: unitResponse, isLoading: unitLoading } = useUnits();
  const { data: organizationResponse, isLoading: orgLoading } =
    useOrganizations();

  const handleClick = (selected: Partial<Selected>) => {
    if (selected.organization === '') {
      selected.unit = '';
    }

    console.log('setting selected:', selected);
    dispatch(setSelected({ data: selected, updateLocalStorage: true }));
  };

  console.log(unitResponse?.data, organizationResponse?.data);

  const filteredUnit =
    unitResponse?.data.filter(
      (unit) => unit?.organization === selected?.organization,
    ) ?? [];

  // unit and organization dropdowns
  return (
    <Flex gap={'xs'}>
      <Authorization action={Action.organization_select}>
        <AsyncAutocompleteCombobox
          data={(organizationResponse?.data || []).map((org) => ({
            label: org.name,
            value: org._id,
          }))}
          loading={orgLoading}
          onChange={(value) => {
            handleClick({ organization: value });
          }}
          selected={selected.organization}
          placeholder="Select Organization"
        />
      </Authorization>
      <Authorization action={Action.unit_select}>
        <AsyncAutocompleteCombobox
          data={filteredUnit.map((unit) => ({
            label: unit.name,
            value: unit._id,
          }))}
          loading={unitLoading}
          onChange={(value) => {
            handleClick({ unit: value });
          }}
          selected={selected.unit}
          placeholder="Select Unit"
        />
      </Authorization>
    </Flex>
  );
}

export default RoleBasedSelector;
