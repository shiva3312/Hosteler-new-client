//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, Button, Select, Grid } from '@mantine/core';
import { useForm } from '@mantine/form';
import { isEmpty } from 'lodash';

import { MealCategory, MealType, Unit } from '@/interfaces/enums';
import {
  MealItemRequest,
  MealItemResponse,
} from '@/interfaces/mess/meal-item.interface';
import { useCreateMealItem } from '@/lib/api/mess/meal-item/create-meal-item';
import { useUpdateMealItem } from '@/lib/api/mess/meal-item/update-meal-item';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';

import { AsyncAutocompleteCombobox } from '../../core/dropdown';
import { useNotifications } from '../../core/notifications';

interface Props {
  initialValues?: Partial<MealItemResponse>;
}

const unitTypeOptions = Object.values(Unit).map((unit) => ({
  value: unit,
  label: unit,
}));
const mealTypeOptions = Object.values(MealType).map((mealType) => ({
  value: mealType,
  label: mealType,
}));
const mealCategoryOptions = Object.values(MealCategory).map((mealCategory) => ({
  value: mealCategory,
  label: mealCategory,
}));

export function MealItemForm({ initialValues }: Props) {
  const form = useForm({
    initialValues,
    // validate : MealItemRequestZodSchema
  });
  const { addNotification } = useNotifications();
  const { data: organizations, isLoading: orgLoading } = useOrganizations({});
  const { data: units, isLoading: unitLoading } = useUnits({
    params: SearchQuery.unitSearchQuery({
      organization: [form.values.organization!],
    }),
    enabled: !!form.values.organization,
  });

  const updateMealItemMutation = useUpdateMealItem({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealItem Updated',
        });
      },
    },
  });

  const createMealItemMutation = useCreateMealItem({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'MealItem Created',
        });
      },
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    if (isEmpty(initialValues)) {
      // validate the form values before proceeding

      // Handle create mealItem logic
      createMealItemMutation.mutate({
        data: values as MealItemRequest,
      });
      console.log('Creating mealItem with values:', values);
    } else {
      updateMealItemMutation.mutate({
        mealItemId: (initialValues as MealItemResponse)?._id,
        data: values as Partial<MealItemRequest>,
      });

      console.log('Updating mealItem with values:', values);
    }
    // Add logic to handle form submission, e.g., API call
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        label="MealItem Name"
        placeholder="Enter mealItem name"
        {...form.getInputProps('name')}
        required
      />
      <TextInput
        label="Description"
        placeholder="Enter description"
        {...form.getInputProps('description')}
        required
      />

      <Select
        label="Meal Type"
        placeholder="Select meal type"
        data={mealTypeOptions}
        {...form.getInputProps('mealType')}
        required
      />

      <Select
        label="Meal Category"
        placeholder="Select meal category"
        data={mealCategoryOptions}
        {...form.getInputProps('mealCategory')}
        required
      />

      <TextInput
        label="Quantity"
        placeholder="Enter quantity"
        type="number"
        {...form.getInputProps('quantity')}
        required
      />

      <Select
        label="Unit Type"
        placeholder="Select unit type"
        data={unitTypeOptions}
        {...form.getInputProps('unitType')}
        required
      />

      <TextInput
        label="Price"
        placeholder="Enter price"
        type="number"
        {...form.getInputProps('price')}
        required
      />

      <Grid>
        <Grid.Col span={6}>
          <AsyncAutocompleteCombobox
            label="Organization"
            placeholder="Select organization"
            data={
              organizations?.data?.map((org) => ({
                label: org.name,
                value: org._id,
              })) || []
            }
            selected={form.values.organization ?? ''}
            onChange={(value) => {
              form.setFieldValue('organization', value);
              form.setFieldValue('unit', null);
            }}
            loading={orgLoading}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <AsyncAutocompleteCombobox
            label="Unit"
            placeholder="Select Unit"
            data={
              units?.data?.map((unit) => ({
                label: unit.name,
                value: unit._id,
              })) || []
            }
            selected={form.values.unit ?? ''}
            onChange={(value) => form.setFieldValue('unit', value ?? null)}
            loading={unitLoading}
          />
        </Grid.Col>
      </Grid>

      <Button type="submit" mt="md">
        {initialValues ? 'Update' : 'Create'}
      </Button>
    </form>
  );
}
