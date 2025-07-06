//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { authHandlers } from './auth';
import { commentsHandlers } from './comments';
import { discussionsHandlers } from './discussions';
import { teamsHandlers } from './teams';
import { usersHandlers } from './users';
import { networkDelay } from '../utils';

export const handlers = [
  ...authHandlers,
  ...commentsHandlers,
  ...discussionsHandlers,
  ...teamsHandlers,
  ...usersHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
