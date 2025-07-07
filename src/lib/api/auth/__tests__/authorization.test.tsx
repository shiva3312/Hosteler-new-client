//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { UserRole } from '@/data/feature';
import { createUser, renderApp, screen } from '@/testing/test-utils';

import { Authorization } from '../authorization';

test('should view protected resource if user role is matching', async () => {
  const user = await createUser({
    role: UserRole.ADMIN,
  });

  const protectedResource = 'This is very confidential data';

  await renderApp(
    <Authorization allowedRoles={[UserRole.ADMIN]}>
      {protectedResource}
    </Authorization>,
    {
      user,
    },
  );

  expect(screen.getByText(protectedResource)).toBeInTheDocument();
});

test('should not view protected resource if user role does not match and show fallback message instead', async () => {
  const user = await createUser({
    role: UserRole.USER,
  });

  const protectedResource = 'This is very confidential data';

  const forbiddenMessage = 'You are unauthorized to view this resource';
  await renderApp(
    <Authorization
      forbiddenFallback={<div>{forbiddenMessage}</div>}
      allowedRoles={[UserRole.ADMIN]}
    >
      {protectedResource}
    </Authorization>,
    { user },
  );

  expect(screen.queryByText(protectedResource)).not.toBeInTheDocument();

  expect(screen.getByText(forbiddenMessage)).toBeInTheDocument();
});

test('should view protected resource if policy check passes', async () => {
  const user = await createUser({
    role: UserRole.ADMIN,
  });

  const protectedResource = 'This is very confidential data';

  await renderApp(
    <Authorization policyCheck={true}>{protectedResource}</Authorization>,
    { user },
  );

  expect(screen.getByText(protectedResource)).toBeInTheDocument();
});

test('should not view protected resource if policy check fails and show fallback message instead', async () => {
  const user = await createUser({
    role: UserRole.USER,
  });

  const protectedResource = 'This is very confidential data';

  const forbiddenMessage = 'You are unauthorized to view this resource';
  await renderApp(
    <Authorization
      forbiddenFallback={<div>{forbiddenMessage}</div>}
      policyCheck={false}
    >
      {protectedResource}
    </Authorization>,
    { user },
  );

  expect(screen.queryByText(protectedResource)).not.toBeInTheDocument();

  expect(screen.getByText(forbiddenMessage)).toBeInTheDocument();
});
