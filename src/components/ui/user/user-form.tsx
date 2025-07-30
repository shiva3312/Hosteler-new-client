//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  TextInput,
  Group,
  Button,
  Box,
  Divider,
  Stack,
  Grid,
  PasswordInput,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';

import { useNotifications } from '@/components/ui/core/notifications';
import { UserRole } from '@/data/feature';
import {
  ImageSize,
  MealStatus,
  MealType,
  UserStatus,
} from '@/interfaces/enums';
import { UserRequest, UserResponse } from '@/interfaces/user.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useMe } from '@/lib/api/user/get-me';
import { UtilHelper } from '@/utils/cn';

import UserProfileForm from './user-profile-form';
import { useUpdateUser } from '../../../lib/api/user/update-profile';
import { useCreateUser } from '../../../lib/api/user/user-create';
import OrganizationUnitDropdown from '../core/dropdown/organization-unit-selector';
import UserRoleDropdown from '../core/dropdown/user-role-selector';
import { GenericFieldset } from '../core/fieldset/fieldset';
import { DropzoneButton } from '../core/file-hanling/dropzone';
import UsernameInput from '../core/username-input';

const mealStatus = Object.entries(MealStatus).map(([key, value]) => ({
  value,
  label: key,
}));
const userStatus = Object.entries(UserStatus).map(([key, value]) => ({
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
    preferences: {
      mealType: MealType.AllEater,
    },
    medical: {},
    finance: {},
    identity: {},
    techInfo: {},
  },
};

export const UserForm = ({ initialValues = {} }: Props) => {
  const profile = initialValues.profile || {};

  const form = useForm<Partial<UserRequest>>({
    // validate: zodResolver(UserRequestZodSchema),
    initialValues: {
      ...initialValues,
      profile: { ...defaultInitialValues.profile, ...profile },
    },
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

        form.resetDirty();
      }

      if (me?.data?.roles?.includes(UserRole.ADMIN) && !form.values.unit) {
        form.setValues({
          // ...initialValues,
          organization: me.data?.organization,
          unit: me.data?.unit,
        });
        form.resetDirty();
      } else if (
        (isNoneAdminRoles || form.values.roles?.includes(UserRole.GUEST)) &&
        !form.values.username &&
        !form.values.password
      ) {
        form.setValues({
          // ...initialValues,
          organization: me.data?.organization,
          unit: me.data?.unit,
          roles: [UserRole.GUEST],
          username: Math.random().toString(36).substring(2, 15),
          password: UtilHelper.generatePassword(),
          parent: me.data?._id,
        });
        form.resetDirty();
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
    const dirtyFields = form.getDirty();
    const dirtyValues = UtilHelper.removeUnchangedValues(values, dirtyFields);

    // logger.info('Dirty Values:', dirtyValues, dirtyFields);

    if (isEditing) {
      // Update existing user
      updateProfileMutation.mutate({
        userId: initialValues._id!,
        data: dirtyValues,
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
                      <UsernameInput form={form} required />
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
            <OrganizationUnitDropdown form={form} />

            {/* // user can't change it's own role */}
            {me?.data._id !== (form.values as UserResponse)?._id && (
              <UserRoleDropdown form={form} />
            )}
            {/* )} */}
          </Stack>
        </GenericFieldset>
      )}

      <GenericFieldset
        legend={'Preferences and Status'}
        radius="md"
        p="md"
        mb="xl"
      >
        <TextInput
          label="Room Number"
          required
          description="Room number of the user"
          key={form.key('room')}
          placeholder="Enter room number"
          {...form.getInputProps('room')}
        />

        <Select
          required
          label="Meal Status"
          description="Meal status indicates if the user is allowed to have meals"
          key={form.key('mealStatus')}
          placeholder={
            form.values.mealStatus === MealStatus.Disabled
              ? 'Disabled'
              : 'Select meal status'
          }
          disabled={
            me?.data._id === (form.values as UserResponse)?._id &&
            form.values.mealStatus === MealStatus.Disabled
          }
          data={mealStatus.filter(
            (m) =>
              !(
                m.value === MealStatus.Disabled &&
                me?.data._id === (form.values as UserResponse)?._id
              ),
          )}
          {...form.getInputProps('mealStatus')}
        />

        <Select
          required
          label="Membership Status"
          description="Membership status indicates if the user is a member of the hostel"
          key={form.key('status')}
          placeholder={
            form.values.mealStatus === MealStatus.Disabled
              ? 'Disabled'
              : form.values.status === UserStatus.Banned
                ? 'Banned'
                : 'Select status'
          }
          disabled={
            (me?.data._id === (form.values as UserResponse)?._id &&
              form.values.status === UserStatus.Disabled) ||
            form.values.status === UserStatus.Banned
          }
          data={userStatus.filter(
            (m) =>
              !(
                (m.value === UserStatus.Disabled ||
                  m.value === UserStatus.Banned) &&
                me?.data._id === (form.values as UserResponse)?._id
              ),
          )}
          {...form.getInputProps('status')}
        />
      </GenericFieldset>

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
