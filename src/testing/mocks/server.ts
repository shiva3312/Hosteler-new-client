//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

export const server = setupServer(...handlers);
