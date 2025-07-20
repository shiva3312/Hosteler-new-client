//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useViewportSize } from '@mantine/hooks';

import { ScreenType } from '@/interfaces/enums';

export function useScreenType() {
  const { width } = useViewportSize();

  let screenType: ScreenType;

  if (width < 600) {
    screenType = ScreenType.Small; // Mobile
  } else if (width >= 600 && width < 1024) {
    screenType = ScreenType.Medium; // Tablet
  } else if (width >= 1024 && width < 1440) {
    screenType = ScreenType.Large; // PC
  } else {
    screenType = ScreenType.ExtraLarge; // Monitors
  }

  return { width, screenType };
}
