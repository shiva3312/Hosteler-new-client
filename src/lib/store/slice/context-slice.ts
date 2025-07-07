//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserRole } from '@/data/feature';
import { LocalStorage } from '@/utils/local-storage.class';

export interface Selected {
  organization?: string | null;
  unit?: string | null;
}

interface ContextState {
  roles: UserRole[];
  organization?: string | null;
  unit?: string | null;
  user: string;
  activeRoute: string;
  selected: Selected;
}

const initialState: ContextState = {
  roles: [],
  organization: '',
  unit: '',
  user: '',
  activeRoute: '',
  selected: {
    organization: '',
    unit: '',
  },
};

// set localStorage key for context
LocalStorage.set(LocalStorage.KEY.CONTEXT, initialState);

const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setContext: (state, action: PayloadAction<Partial<ContextState>>) => {
      const { roles, organization, unit, user, activeRoute } = action.payload;
      if (roles !== undefined) state.roles = roles;
      if (organization !== undefined) state.organization = organization;
      if (unit !== undefined) state.unit = unit;
      if (user !== undefined) state.user = user;
      if (activeRoute !== undefined) state.activeRoute = activeRoute;

      // save state in localStorage
      LocalStorage.set(LocalStorage.KEY.CONTEXT, state);
    },

    setSelected: (state, action: PayloadAction<Partial<Selected>>) => {
      const { organization, unit } = action.payload;
      if (organization !== undefined)
        state.selected.organization = organization;
      if (unit !== undefined) state.selected.unit = unit;

      // save state in localStorage
      LocalStorage.set(LocalStorage.KEY.CONTEXT, state);
    },
  },
});

export const { setContext, setSelected } = contextSlice.actions;
export default contextSlice.reducer;
