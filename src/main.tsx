//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import * as React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { App } from './app';
import { enableMocking } from './testing/mocks';

const root = document.getElementById('root');
if (!root) throw new Error('No root element found');

enableMocking().then(() => {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
