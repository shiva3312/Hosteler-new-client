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
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { IconEdit } from '@tabler/icons-react';

import { useNotifications } from '@/components/ui/core/notifications';
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

import { useUpdateProfile } from '../../../lib/api/user/update-profile';
import { useCreateUser } from '../../../lib/api/user/user-create';

type Props = {
  initialValues?: Partial<UserResponse>;
};

const genderOptions = Object.values(Gender).map((value) => ({
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

const UserForm = ({ initialValues = {} }: Props) => {
  const form = useForm<Partial<UserRequest>>({
    validate: zodResolver(UserRequestZodSchema),
    initialValues,
  });
  const { addNotification } = useNotifications();

  const updateProfileMutation = useUpdateProfile({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
        });
      },
    },
  });

  const createProfileMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Profile Updated',
        });
      },
    },
  });

  const onSubmit = (values: Partial<UserRequest>): void => {
    console.log('Form submitted with values:', values);
    if (initialValues) {
      // Update existing user
      console.log('Updating user:', initialValues.username);
      updateProfileMutation.mutate({
        userId: initialValues._id!,
        data: values as UserRequest,
      });
      form.reset();
    } else {
      // Create new user
      console.log('Creating new user');
      createProfileMutation.mutate({ data: values as UserRequest });
      form.reset();
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)}>
      {/* Basic Info */}
      <Title order={3}>Basic Info</Title>
      <Stack>
        <TextInput label="Username" {...form.getInputProps('username')} />
        <TextInput
          label="Password"
          type="password"
          {...form.getInputProps('password')}
        />
      </Stack>

      <Divider my="md" />

      {/* Profile */}
      <Title order={3}>Profile</Title>
      <Stack>
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
      </Stack>

      <Divider my="md" />

      {/* Address */}
      <Title order={3}>Address</Title>
      <Stack>
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
      </Stack>

      <Divider my="md" />

      {/* Contacts */}
      <Title order={3}>Contacts</Title>
      <Stack>
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
      </Stack>

      <Divider my="md" />

      {/* Preferences */}
      <Title order={3}>Preferences</Title>
      <Stack>
        <TextInput
          label="Preferred Language"
          {...form.getInputProps('profile.preferences.preferredLanguage')}
        />
        <Select
          label="Food Preference"
          data={foodOptions}
          {...form.getInputProps('profile.preferences.foodPreference')}
        />
      </Stack>

      <Divider my="md" />

      {/* Medical */}
      <Title order={3}>Medical</Title>
      <Stack>
        <Select
          label="Blood Group"
          data={bloodGroupOptions}
          {...form.getInputProps('profile.medical.bloodGroup')}
        />
        <TextInput
          label="Allergies"
          {...form.getInputProps('profile.medical.allergies')}
        />
      </Stack>

      <Divider my="md" />

      {/* Finance */}
      <Title order={3}>Finance</Title>
      <Stack>
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
      </Stack>

      <Divider my="md" />

      {/* Identity */}
      <Title order={3}>Identity</Title>
      <Stack>
        <TextInput
          label="Aadhar Card"
          {...form.getInputProps('profile.identity.aadharCard')}
        />
        <TextInput
          label="PAN Card"
          {...form.getInputProps('profile.identity.panCard')}
        />
      </Stack>

      <Divider my="md" />

      {/* Tech Info */}
      <Title order={3}>Tech Info</Title>
      <Stack>
        <TextInput
          label="IP Address"
          {...form.getInputProps('profile.techInfo.ipAddress')}
        />
        <Select
          label="Device Type"
          data={deviceTypeOptions}
          {...form.getInputProps('profile.techInfo.deviceType')}
        />
      </Stack>

      <Divider my="md" />

      {/* Submit */}
      <Group justify="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </Box>
  );
};

// ----------------------
// Drawer wrapper component
// ----------------------

function UserFormDrawer({ initialValues }: Props) {
  const { isOpen: opened, open, close } = useDisclosure(false);

  return (
    <>
      <Drawer
        size="xl"
        opened={opened}
        onClose={close}
        title={initialValues ? 'Edit User' : 'Create User'}
        position="right"
        closeOnClickOutside={false}
      >
        <UserForm initialValues={initialValues} />
      </Drawer>

      {initialValues ? (
        <UnstyledButton onClick={open}>
          <IconEdit size={25} />
        </UnstyledButton>
      ) : (
        <Button size="xs" onClick={open}>
          {'Add New'}
        </Button>
      )}
    </>
  );
}

export default UserFormDrawer;
