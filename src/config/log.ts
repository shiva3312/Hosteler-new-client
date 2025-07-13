//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
// import { createLogger, format, transports } from 'winston';

import log from 'loglevel';

import { env } from './env';

log.setLevel(env.DEPLOYED ? 'warn' : 'debug');

export default log;
