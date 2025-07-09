//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  TextInput,
  Select,
  Group,
  Button,
  Box,
  Textarea,
  Divider,
  Title,
  Stack,
  NumberInput,
  Drawer,
  UnstyledButton,
  MultiSelect,
  Grid,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconEdit, IconKey } from '@tabler/icons-react';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';

import { useNotifications } from '@/components/ui/core/notifications';
import { UserRole } from '@/data/feature';
import { useDisclosure } from '@/hooks/use-disclosure';
import {
  Gender,
  Religion,
  CasteCategory,
  MealType,
  BloodGroup,
  DeviceType,
} from '@/interfaces/enums';
import {
  UserRequest,
  UserRequestZodSchema,
  UserResponse,
} from '@/interfaces/user.interface';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useOrganizations } from '@/lib/api/organization/get-all-organizations';
import { SearchQuery } from '@/lib/api/search-query';
import { useUnits } from '@/lib/api/unit/get-all-units';

import { useUpdateProfile } from '../../../lib/api/user/update-profile';
import { useCreateUser } from '../../../lib/api/user/user-create';
import { AsyncAutocompleteCombobox } from '../core/dropdown';
import { GenericFieldset } from '../core/fieldset/fieldset';
import { useAuth } from '@/lib/api/auth/auth';
import { useMe } from '@/lib/api/user/get-me';

type Props = {
  initialValues?: Partial<UserResponse>;
};

const genderOptions = Object.entries(Gender).map(([value]) => ({
  value,
  label: value,
}));
const religionOptions = Object.values(Religion).map((value) => ({
  value,
  label: value,
}));
const casteCategoryOptions = Object.values(CasteCategory).map((value) => ({
  value,
  label: value,
}));
const foodOptions = Object.values(MealType).map((value) => ({
  value,
  label: value,
}));
const bloodGroupOptions = Object.values(BloodGroup).map((value) => ({
  value,
  label: value,
}));
const deviceTypeOptions = Object.values(DeviceType).map((value) => ({
  value,
  label: value,
}));
const userRoles = Object.entries(UserRole).map(([key, value]) => ({
  value,
  label: key,
}));

export const UserForm = ({ initialValues = {} }: Props) => {
  const form = useForm<Partial<UserRequest>>({
    validate: zodResolver(UserRequestZodSchema),
    initialValues,
  });
  const { data: me } = useMe();
  const { addNotification } = useNotifications();
  const { data: organizations, isLoading: orgLoading } = useOrganizations({});
  const { data: units, isLoading: unitLoading } = useUnits({
    params: SearchQuery.unitSearchQuery({
      organization: [form.values.organization!],
    }),
    enabled: !!form.values.organization,
  });

  const updateProfileMutation = useUpdateProfile({
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

  const createProfileMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        form.reset();
        addNotification({
          type: 'success',
          title: 'User Created',
        });
      },
    },
  });

  const onSubmit = (values: Partial<UserRequest>): void => {
    console.log('Form submitted with values:', values);
    if (!isEmpty(initialValues)) {
      // Update existing user
      console.log('Updating user:', initialValues.username);
      updateProfileMutation.mutate({
        userId: initialValues._id!,
        data: values,
      });
    } else {
      // Create new user
      console.log('Creating new user');
      createProfileMutation.mutate({ data: values as UserRequest });
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      {/* Basic Info */}
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
            <Grid.Col span={6}>
              <TextInput label="Username" {...form.getInputProps('username')} />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Password"
                type="password"
                {...form.getInputProps('password')}
              />
            </Grid.Col>
          </Grid>

          <Divider label="Access Details" labelPosition="center" mt="sm" />

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
                  form.setFieldValue('unit', '');
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
                onChange={(value) => form.setFieldValue('unit', value)}
                loading={unitLoading}
              />
            </Grid.Col>
          </Grid>

          <MultiSelect
            label="Select Roles"
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
            searchable
          />
        </Stack>
      </GenericFieldset>

      {/* <Divider my="md" /> */}

      {/* Profile */}
      {/* <Title order={3}>Profile</Title> */}
      {/* <Stack>
        <TextInput
          label="First Name"
          {...form.getInputProps('profile.firstName')}
        />
        <TextInput
          label="Last Name"
          {...form.getInputProps('profile.lastName')}
        />
        <Textarea label="Bio" {...form.getInputProps('profile.bio')} />
        <TextInput
          label="Image URL"
          {...form.getInputProps('profile.imageUrl')}
        />
        <TextInput
          label="Date of Birth"
          type="date"
          {...form.getInputProps('profile.dob')}
        />
        <Select
          label="Gender"
          data={genderOptions}
          {...form.getInputProps('profile.gender')}
        />
        <Select
          label="Religion"
          data={religionOptions}
          {...form.getInputProps('profile.religion')}
        />
        <Select
          label="Caste Category"
          data={casteCategoryOptions}
          {...form.getInputProps('profile.casteCategory')}
        />
      </Stack> */}

      {/* <Divider my="md" /> */}

      {/* Address */}
      {/* <Title order={3}>Address</Title> */}
      {/* <Stack>
        <TextInput
          label="Address Line 1"
          {...form.getInputProps('profile.address.addressLine1')}
        />
        <TextInput
          label="City"
          {...form.getInputProps('profile.address.city')}
        />
        <TextInput
          label="State"
          {...form.getInputProps('profile.address.state')}
        />
        <TextInput
          label="Country"
          {...form.getInputProps('profile.address.country')}
        />
        <NumberInput
          label="Postal Code"
          {...form.getInputProps('profile.address.postalCode')}
        />
      </Stack> */}

      {/* <Divider my="md" /> */}

      {/* Contacts */}
      {/* <Title order={3}>Contacts</Title> */}
      {/* <Stack>
        <TextInput
          label="Email"
          {...form.getInputProps('profile.contacts.email')}
        />
        <TextInput
          label="Phone"
          {...form.getInputProps('profile.contacts.phone')}
        />
        <TextInput
          label="Emergency Phone"
          {...form.getInputProps('profile.contacts.emergencyPhone')}
        />
        <TextInput
          label="LinkedIn"
          {...form.getInputProps('profile.contacts.linkedinAccount')}
        />
      </Stack> */}

      {/* <Divider my="md" /> */}

      {/* Preferences */}
      {/* <Title order={3}>Preferences</Title> */}
      {/* <Stack>
        <TextInput
          label="Preferred Language"
          {...form.getInputProps('profile.preferences.preferredLanguage')}
        />
        <Select
          label="Food Preference"
          data={foodOptions}
          {...form.getInputProps('profile.preferences.foodPreference')}
        />
      </Stack> */}

      {/* <Divider my="md" /> */}

      {/* Medical */}
      {/* <Title order={3}>Medical</Title> */}
      {/* <Stack>
        <Select
          label="Blood Group"
          data={bloodGroupOptions}
          {...form.getInputProps('profile.medical.bloodGroup')}
        />
        <TextInput
          label="Allergies"
          {...form.getInputProps('profile.medical.allergies')}
        />
      </Stack> */}

      {/* <Divider my="md" /> */}

      {/* Finance */}
      {/* <Title order={3}>Finance</Title> */}
      {/* <Stack>
        <TextInput
          label="Bank Name"
          {...form.getInputProps('profile.finance.bankName')}
        />
        <TextInput
          label="Account Number"
          {...form.getInputProps('profile.finance.accountNumber')}
        />
        <TextInput
          label="IFSC Code"
          {...form.getInputProps('profile.finance.ifscCode')}
        />
      </Stack> */}

      {/* <Divider my="md" /> */}

      {/* Identity */}
      {/* <Title order={3}>Identity</Title> */}
      {/* <Stack>
        <TextInput
          label="Aadhar Card"
          {...form.getInputProps('profile.identity.aadharCard')}
        />
        <TextInput
          label="PAN Card"
          {...form.getInputProps('profile.identity.panCard')}
        />
      </Stack> */}

      {/* <Divider my="md" /> */}

      {/* Tech Info */}
      {/* <Title order={3}>Tech Info</Title> */}
      {/* <Stack>
        <TextInput
          label="IP Address"
          {...form.getInputProps('profile.techInfo.ipAddress')}
        />
        <Select
          label="Device Type"
          data={deviceTypeOptions}
          {...form.getInputProps('profile.techInfo.deviceType')}
        />
      </Stack> */}

      <Divider my="md" />

      {/* Submit */}
      <Group justify="right" mt="md">
        <Button type="submit">
          {!isEmpty(initialValues) ? 'Update' : 'Create'}
        </Button>
      </Group>
    </Box>
  );
};

// ----------------------
// Drawer wrapper component
// ----------------------

// function UserFormDrawer({ initialValues }: Props) {
//   const { isOpen: opened, open, close } = useDisclosure(false);

//   return (
//     <>
//       <Drawer
//         size="xl"
//         opened={opened}
//         onClose={close}
//         title={initialValues ? 'Edit User' : 'Create User'}
//         position="right"
//         closeOnClickOutside={false}
//       >
//         <UserForm initialValues={initialValues} />
//       </Drawer>

//       {initialValues ? (
//         <UnstyledButton onClick={open}>
//           <IconEdit size={25} />
//         </UnstyledButton>
//       ) : (
//         <Button size="xs" onClick={open}>
//           {'Add New'}
//         </Button>
//       )}
//     </>
//   );
// }

// export default UserFormDrawer;
