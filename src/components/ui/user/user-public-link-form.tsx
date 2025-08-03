//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  TextInput,
  Group,
  Button,
  Grid,
  PasswordInput,
  Flex,
  Paper,
  Card,
  Title,
  Text,
  Divider,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { paths } from '@/config/paths';
import { ImageSize, MealType } from '@/interfaces/enums';
import {
  UserRequest,
  UserRequestZodSchema,
  UserResponse,
} from '@/interfaces/user.interface';
import { useRegisterUserByLink } from '@/lib/api/auth/register-user-by-link';
import { UtilHelper } from '@/utils/cn';

import UserProfileForm from './user-profile-form';
import { CelebrationModal } from '../core/celebration-modal';
import { GenericFieldset } from '../core/fieldset/fieldset';
import { DropzoneButton } from '../core/file-hanling/dropzone';
import UsernameInput from '../core/username-input';

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
    education: [],
  },
};

export const RegisterUserByLink = () => {
  const { token: encodedToken, unitName: encodedUnitName } = useParams();
  const unitName = encodedUnitName ? decodeURIComponent(encodedUnitName) : null;
  const navigate = useNavigate();
  const [celebrate, setCelebrate] = useState(false);
  const timeout = 5000;

  const form = useForm<Partial<UserRequest>>({
    validate: zodResolver(UserRequestZodSchema),
    initialValues: {
      profile: { ...defaultInitialValues.profile },
    },
  });
  const [newUser, setNewUser] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const createProfileMutation = useRegisterUserByLink({
    mutationConfig: {
      onSuccess: (data) => {
        setNewUser(data.data._id);
        form.reset();
        setTimeout(() => {
          setNewUser(null);
        }, 100);
        form.reset();
        setCelebrate(true);

        // after 2 second redirect to login page
        setTimeout(() => {
          setCelebrate(false);
          navigate(paths.auth.login.getHref(), { replace: true });
        }, timeout);
      },
    },
  });

  const onSubmit = (values: Partial<UserRequest>): void => {
    const dirtyFields = form.getDirty();
    const dirtyValues = UtilHelper.removeUnchangedValues(values, dirtyFields);

    createProfileMutation.mutate({
      data: dirtyValues as UserRequest,
      token: encodedToken as string,
      unitName: encodedUnitName as string,
    });
  };

  return (
    <Paper style={{ display: 'flex', justifyContent: 'center' }}>
      <Card
        m={'md'}
        component="form"
        onSubmit={form.onSubmit(onSubmit)}
        shadow="md"
      >
        <Flex direction={'column'} align="center" p="sm" bg={'blue.0'}>
          <Title order={2} mb="md">
            {` ${unitName?.toUpperCase()} Registration`}
          </Title>
          <Text c={'gray'} color="dimmed">
            {'Fill the form below to register a new user.'}
          </Text>
        </Flex>

        <Divider mb="xl" />
        <Flex justify="center" align="center" mb="md">
          <DropzoneButton
            userId={(form.values as UserResponse)?._id ?? newUser}
            size={ImageSize.Large}
            onDropAutoUpload={false}
            triggerUpload={!!newUser}
            imageUrl={form.values?.imageUrl ?? undefined}
          />
        </Flex>

        <GenericFieldset legend={'Credentials'} p="md" mb="xl">
          <Grid>
            <Grid.Col>
              <UsernameInput form={form} required />
            </Grid.Col>
            <Grid.Col>
              <PasswordInput
                placeholder="Enter password"
                description="Password must be at least 8 characters long"
                required
                key={form.key('password')}
                label="Password"
                type="password"
                {...form.getInputProps('password')}
              />
            </Grid.Col>
            <Grid.Col>
              <PasswordInput
                placeholder="Enter password"
                description="Confirm Password must be the same as Password"
                required
                key={form.key('confirmPassword')}
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.currentTarget.value);
                  if (e.currentTarget.value !== form.values.password) {
                    setPasswordError('Passwords do not match');
                  } else {
                    setPasswordError(null);
                  }
                }}
                error={passwordError}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                label="Room Number"
                description="Enter the room number for the user"
                required
                autoComplete="off"
                key={form.key('room')}
                placeholder="Enter room number"
                {...form.getInputProps('room')}
              />
            </Grid.Col>
          </Grid>
        </GenericFieldset>

        <UserProfileForm form={form} w={'100%'} />

        <Group justify="right" mt="md">
          <Button
            w={{ base: '100%' }}
            title={
              Object.keys(form.getDirty()).length == 0
                ? 'Please add some data'
                : 'Click to submit'
            }
            disabled={Object.keys(form.getDirty()).length == 0}
            type="submit"
          >
            Submit
          </Button>
        </Group>
      </Card>
      <CelebrationModal
        open={celebrate}
        text="Registration Successful!"
        onClose={() => setCelebrate(false)}
        duration={timeout}
      />
    </Paper>
  );
};
