//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  TextInput,
  Group,
  Button,
  Box,
  Divider,
  Stack,
  MultiSelect,
  Grid,
  PasswordInput,
  Select,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { UserRole } from '@/data/feature';
import { ImageSize, MealStatus } from '@/interfaces/enums';
import {
  UserRequest,
  UserRequestZodSchema,
  UserResponse,
} from '@/interfaces/user.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';
import { useMe } from '@/lib/api/user/get-me';
import { UtilHelper } from '@/utils/cn';

import UserProfileForm from './user-profile-form';
import { useUpdateUser } from '../../../lib/api/user/update-profile';
import { useCreateUser } from '../../../lib/api/user/user-create';
import { AsyncAutocompleteCombobox } from '../core/dropdown';
import { GenericFieldset } from '../core/fieldset/fieldset';
import { DropzoneButton } from '../core/file-hanling/dropzone';

const userRoles = Object.entries(UserRole).map(([key, value]) => ({
  value,
  label: key,
}));
const mealStatus = Object.entries(MealStatus).map(([key, value]) => ({
  value,
  label: key,
}));

type Props = {
  initialValues?: Partial<UserResponse>;
};

const defaultInitialValues: Partial<UserRequest> = {
  profile: {
    address: {},
    contacts: {},
    preferences: {},
    medical: {},
    finance: {},
    identity: {},
    techInfo: {},
  },
};

export const UserForm = ({ initialValues = {} }: Props) => {
  const form = useForm<Partial<UserRequest>>({
    validate: zodResolver(UserRequestZodSchema),
    initialValues: { ...defaultInitialValues, ...initialValues },
  });

  const { data: me } = useMe();
  const isEditing = useMemo(
    () => !UtilHelper.isAllFieldsFalsy(initialValues),
    [initialValues],
  );
  const [newUser, setNewUser] = useState<string | null>(null);
  const isNoneAdminRoles = useMemo(() => {
    return AuthorizationService.isNoneAdminRoles(me?.data?.roles ?? []);
  }, [me?.data?.roles]);
  const { addNotification } = useNotifications();
  const { data: organizations, isLoading: orgLoading } = useOrganizations({});
  const { data: units, isLoading: unitLoading } = useUnits({
    params: SearchQuery.unitSearchQuery({
      organization: [form.values.organization!],
    }),
    enabled: !!form.values.organization,
  });

  const updateProfileMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        form.reset();
        addNotification({
          type: 'success',
          title: 'User Updated',
        });
      },
    },
  });

  useEffect(() => {
    if (me?.data) {
      // form.resetDirty();
      if (
        me?.data?.roles?.includes(UserRole.SUPER_ADMIN) &&
        !form.values.organization
      ) {
        form.setValues({
          // ...initialValues,
          organization: me.data?.organization,
        });
      }

      if (me?.data?.roles?.includes(UserRole.ADMIN) && !form.values.unit) {
        form.setValues({
          // ...initialValues,
          organization: me.data?.organization,
          unit: me.data?.unit,
        });
      } else if (
        isNoneAdminRoles &&
        !form.values.username &&
        !form.values.password
      ) {
        form.setValues({
          // ...initialValues,
          organization: me.data?.organization,
          unit: me.data?.unit,
          roles: [UserRole.GUEST],
          username: Math.random().toString(36).substring(2, 15),
          password: Math.random().toString(36).substring(2, 15),
          parent: me.data?._id,
        });
      }
    }

    // IMPORTANT: adding more dependencies here will cause infinite loop
    // This is because form.setValues triggers a re-render and useEffect runs again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, form.values, isNoneAdminRoles]);

  const createProfileMutation = useCreateUser({
    mutationConfig: {
      onSuccess: (data) => {
        form.reset();
        setNewUser(data.data._id);
        setTimeout(() => {
          setNewUser(null);
        }, 100);
        addNotification({
          type: 'success',
          title: 'User Created',
        });
      },
    },
  });

  const onSubmit = (values: Partial<UserRequest>): void => {
    // const dirtyFields = form.getDirty();
    // const dirtyValues = UtilHelper.removeUnchangedValues(values, dirtyFields);

    // logger.info('Dirty Values:', dirtyValues, dirtyFields);

    if (isEditing) {
      // Update existing user
      updateProfileMutation.mutate({
        userId: initialValues._id!,
        data: values,
      });
    } else {
      // Create new user
      createProfileMutation.mutate({ data: values as UserRequest });
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      {/* Basic Info */}
      {!isNoneAdminRoles && (
        <GenericFieldset legend={'User Credential'} radius="md" p="md" mb="xl">
          {/* Fake inputs to prevent browser autofill */}
          <TextInput
            type="text"
            name="username-fake"
            autoComplete="username"
            style={{ display: 'none' }}
          />
          <TextInput
            type="password"
            name="password-fake"
            autoComplete="new-password"
            style={{ display: 'none' }}
          />
          <Stack gap="sm">
            <Grid>
              <Grid.Col
                span={{ base: 12, md: isEditing ? 12 : 3 }}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <DropzoneButton
                  userId={(form.values as UserResponse)?._id ?? newUser}
                  size={ImageSize.Large}
                  onDropAutoUpload={isEditing}
                  triggerUpload={!isEditing && !!newUser}
                  imageUrl={form.values?.imageUrl ?? undefined}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 9 }}>
                {!isEditing && (
                  <Grid>
                    <Grid.Col>
                      <TextInput
                        key={form.key('username')}
                        label="Username"
                        {...form.getInputProps('username')}
                      />
                    </Grid.Col>
                    <Grid.Col>
                      <PasswordInput
                        key={form.key('password')}
                        label="Password"
                        type="password"
                        {...form.getInputProps('password')}
                      />
                    </Grid.Col>
                  </Grid>
                )}
              </Grid.Col>
            </Grid>

            <Divider label="Access Details" labelPosition="center" mt="sm" />

            <Grid>
              {me?.data.roles?.includes(UserRole.MASTER_ADMIN) && (
                <Grid.Col>
                  <AsyncAutocompleteCombobox
                    label="Organization"
                    key={form.key('organization')}
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
              )}
              {me?.data.roles?.some((role) =>
                [UserRole.SUPER_ADMIN, UserRole.MASTER_ADMIN].includes(role),
              ) && (
                <Grid.Col>
                  <AsyncAutocompleteCombobox
                    label="Unit"
                    key={form.key('unit')}
                    placeholder="Select Unit"
                    data={
                      units?.data?.map((unit) => ({
                        label: unit.name,
                        value: unit._id,
                      })) || []
                    }
                    selected={form.values.unit ?? ''}
                    onChange={(value) => form.setFieldValue('unit', value)}
                    loading={unitLoading}
                  />
                </Grid.Col>
              )}
            </Grid>

            {!isEditing && (
              <MultiSelect
                mt={'md'}
                label="Select Roles"
                key={form.key('roles')}
                description="Select one or more roles for the user"
                placeholder="Pick value"
                data={userRoles.filter((role) => {
                  const x = AuthorizationService.hasHigherRole(
                    me?.data?.roles ?? [],
                    role.value as UserRole,
                  );

                  return x;
                })}
                {...form.getInputProps('roles')}
                onChange={(value) => {
                  form.setFieldValue('roles', value as UserRole[]);

                  if (value.includes(UserRole.MASTER_ADMIN)) {
                    form.setFieldValue('organization', null);
                    form.setFieldValue('unit', null);
                  }
                  if (value.includes(UserRole.SUPER_ADMIN)) {
                    form.setFieldValue('unit', null);
                  }
                }}
                searchable
              />
            )}

            <Select
              required={false}
              label="Meal Status"
              key={form.key('mealStatus')}
              placeholder="Select meal status"
              data={
                isNoneAdminRoles
                  ? mealStatus.filter((m) => m.value !== MealStatus.Disabled)
                  : mealStatus
              }
              {...form.getInputProps('mealStatus')}
            />
          </Stack>
        </GenericFieldset>
      )}

      <UserProfileForm form={form} />

      {/* Submit */}
      <Group justify="right" mt="md">
        <Button
          title={
            Object.keys(form.getDirty()).length == 0
              ? 'Please update some data'
              : 'Click to submit'
          }
          disabled={Object.keys(form.getDirty()).length == 0}
          type="submit"
        >
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </Group>
    </Box>
  );
};
