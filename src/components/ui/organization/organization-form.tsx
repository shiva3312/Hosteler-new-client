//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';

import { useNotifications } from '@/components/ui/core/notifications';
import {
  OrganizationRequest,
  OrganizationRequestZodSchema,
} from '@/interfaces/organization.interface';
import { useCreateOrganization } from '@/lib/api/organization/create-organization';
import { useUpdateOrganization } from '@/lib/api/organization/update-organization';

type OrganizationFormProps = {
  initialValues?: Partial<OrganizationRequest>;
};

export const OrganizationForm = ({
  initialValues = {},
}: OrganizationFormProps) => {
  const form = useForm<Partial<OrganizationRequest>>({
    validate: zodResolver(OrganizationRequestZodSchema),
    initialValues,
  });

  const { addNotification } = useNotifications();

  const createOrganizationMutation = useCreateOrganization({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Organization Created',
        });
        form.reset();
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Error Creating Organization',
          message: error.message,
        });
      },
    },
  });

  const updateOrganizationMutation = useUpdateOrganization({
    organizationId: initialValues._id || '',
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Organization Updated',
        });
        form.reset();
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Error Updating Organization',
          message: error.message,
        });
      },
    },
  });

  const handleSubmit = (values: Partial<OrganizationRequest>) => {
    if (initialValues._id) {
      // Update existing organization
      updateOrganizationMutation.mutate({
        organizationId: initialValues._id,
        data: values,
      });
    } else {
      // Create new organization
      createOrganizationMutation.mutate({
        data: values as OrganizationRequest,
      });
    }
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      {/* Basic Info */}
      <Title order={3}>Basic Info</Title>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Enter organization name"
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Description"
          placeholder="Enter organization description"
          {...form.getInputProps('description')}
        />
      </Stack>

      <Divider my="md" />

      {/* Address */}
      <Title order={3}>Address</Title>
      <Stack>
        <TextInput
          label="Address Line 1"
          {...form.getInputProps('address.addressLine1')}
        />
        <TextInput label="City" {...form.getInputProps('address.city')} />
        <TextInput label="State" {...form.getInputProps('address.state')} />
        <TextInput label="Country" {...form.getInputProps('address.country')} />
        <TextInput
          label="Postal Code"
          {...form.getInputProps('address.postalCode')}
        />
      </Stack>

      <Divider my="md" />

      {/* Contacts */}
      <Title order={3}>Contacts</Title>
      <Stack>
        <TextInput label="Email" {...form.getInputProps('contacts.email')} />
        <TextInput label="Phone" {...form.getInputProps('contacts.phone')} />
        <TextInput
          label="Alternate Phone"
          {...form.getInputProps('contacts.alternatePhone')}
        />
        <TextInput
          label="Emergency Phone"
          {...form.getInputProps('contacts.emergencyPhone')}
        />
      </Stack>

      <Divider my="md" />

      {/* Submit */}
      <Group position="right" mt="md">
        <Button type="submit">
          {initialValues._id ? 'Update Organization' : 'Create Organization'}
        </Button>
      </Group>
    </Box>
  );
};
