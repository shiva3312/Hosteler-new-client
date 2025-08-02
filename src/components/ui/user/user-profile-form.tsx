//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  TextInput,
  Select,
  Group,
  Box,
  Divider,
  Stack,
  Textarea,
  Grid,
  BoxProps,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';

import { Gender, MealType } from '@/interfaces/enums';

import { GenericFieldset } from '../core/fieldset/fieldset';

const genderOptions = Object.entries(Gender).map(([key, value]) => ({
  value,
  label: key,
}));

const foodOptions = Object.values(MealType).map((value) => ({
  value,
  label: value,
}));

const UserProfileForm = ({ form, ...props }: { form: any } & BoxProps) => {
  if (!form) return <>Props Required to pass</>;

  return (
    <Box mx="auto" {...props}>
      {/* Personal Information */}
      <GenericFieldset legend={'Personal Information'} p="md" mb="xl">
        <Group grow>
          <TextInput
            label="First Name"
            key={form.key('profile.firstName')}
            placeholder="Enter your first name"
            {...form.getInputProps('profile.firstName')}
          />
          <TextInput
            label="Last Name"
            key={form.key('profile.lastName')}
            placeholder="Enter your last name"
            {...form.getInputProps('profile.lastName')}
          />
        </Group>

        <Grid mt="md">
          <Grid.Col span={{ base: 6, md: 4 }}>
            <DateInput
              label="Date of Birth"
              key={form.key('profile.dob')}
              valueFormat="DD/MM/YYYY"
              clearable={true}
              placeholder="Select your date of birth"
              value={
                form.values.profile.dob
                  ? new Date(form.values.profile.dob)
                  : null
              }
              onChange={(date) =>
                form.setFieldValue('profile.dob', date?.toString() ?? null)
              }
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 4 }}>
            <Select
              required={false}
              label="Gender"
              clearable={true}
              key={form.key('profile.gender')}
              placeholder="Select your gender"
              data={genderOptions}
              {...form.getInputProps('profile.gender')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Select
              required={true}
              label="Meal Type"
              key={form.key('profile.preferences.mealType')}
              placeholder="Select your meal type"
              data={foodOptions}
              {...form.getInputProps('profile.preferences.mealType')}
            />
          </Grid.Col>
        </Grid>
        <Textarea
          label="Bio"
          key={form.key('profile.bio')}
          placeholder="Tell us about yourself"
          mt="md"
          {...form.getInputProps('profile.bio')}
        />
      </GenericFieldset>
      {/* Address */}
      <GenericFieldset legend={'Address'} radius="md" p="md" mb="xl">
        <Stack>
          <TextInput
            label="Address Line 1"
            key={form.key('profile.address.addressLine1')}
            placeholder="Enter your address line 1"
            {...form.getInputProps('profile.address.addressLine1')}
          />
          <TextInput
            label="Address Line 2"
            key={form.key('profile.address.addressLine2')}
            placeholder="Enter your address line 2"
            {...form.getInputProps('profile.address.addressLine2')}
          />
          <Group grow>
            <TextInput
              label="City"
              key={form.key('profile.address.city')}
              placeholder="Enter your city"
              {...form.getInputProps('profile.address.city')}
            />
            <TextInput
              label="District"
              key={form.key('profile.address.district')}
              placeholder="Enter your district"
              {...form.getInputProps('profile.address.district')}
            />
          </Group>
          <Group grow>
            <TextInput
              label="State"
              key={form.key('profile.address.state')}
              placeholder="Enter your state"
              {...form.getInputProps('profile.address.state')}
            />
            <TextInput
              label="Country"
              key={form.key('profile.address.country')}
              placeholder="Enter your country"
              {...form.getInputProps('profile.address.country')}
            />
          </Group>
        </Stack>
      </GenericFieldset>

      {/* Contacts */}
      <GenericFieldset legend={'Contacts'} radius="md" p="md" mb="xl">
        <Divider my="sm" />
        <Stack>
          <TextInput
            label="Email"
            key={form.key('profile.contacts.email')}
            placeholder="Enter your email"
            {...form.getInputProps('profile.contacts.email')}
          />
          <TextInput
            label="Phone"
            key={form.key('profile.contacts.phone')}
            placeholder="Enter your phone number"
            {...form.getInputProps('profile.contacts.phone')}
          />
          <TextInput
            label="Emergency Phone"
            key={form.key('profile.contacts.emergencyPhone')}
            placeholder="Enter your emergency phone number"
            {...form.getInputProps('profile.contacts.emergencyPhone')}
          />
        </Stack>
      </GenericFieldset>

      {/* Preferences */}
      {/* <GenericFieldset legend={'Preferences'} radius="md" p="md" mb="xl">
        <Stack>
          <TextInput
            label="Preferred Language"
            key={form.key('preferences.preferredLanguage')}
            placeholder="Enter your preferred language"
            {...form.getInputProps('preferences.preferredLanguage')}
          />
          <TextInput
            label="Preferred Currency"
            key={form.key('preferences.preferredCurrency')}
            placeholder="Enter your preferred currency"
            {...form.getInputProps('preferences.preferredCurrency')}
          />
        </Stack>
      </GenericFieldset> */}
      {/* Medical Information */}

      {/* <GenericFieldset
        legend={'Medical Information'}
        radius="md"
        p="md"
        mb="xl"
      >
        <Stack>
          <Select
            label="Blood Group"
            required={false}
            clearable={true}
            // searchable={true}}
            key={form.key('medical.bloodGroup')}
            placeholder="Select your blood group"
            data={bloodGroupOptions}
            {...form.getInputProps('medical.bloodGroup')}
          />
          <TextInput
            label="Allergies"
            key={form.key('medical.allergies')}
            placeholder="Enter your allergies"
            {...form.getInputProps('medical.allergies')}
          />
        </Stack>
      </GenericFieldset> */}
    </Box>
  );
};

export default UserProfileForm;
