//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Button } from '@mantine/core';

export const MainErrorFallback = () => {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center text-red-500"
      role="alert"
    >
      <h2 className="text-lg font-semibold">Ooops, something went wrong :( </h2>
      <Button onClick={() => window.location.assign(window.location.origin)}>
        Refresh
      </Button>
    </div>
  );
};
