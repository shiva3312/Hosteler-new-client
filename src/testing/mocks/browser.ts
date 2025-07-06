//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
