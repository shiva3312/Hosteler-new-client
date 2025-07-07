//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { UserRole } from '@/data/feature';
import { LocalStorage } from '@/utils/local-storage.class';

export interface Selected {
  organization?: string | null;
  unit?: string | null;
}

export interface ContextState {
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

const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setContext: (
      state,
      action: PayloadAction<{
        data: Partial<ContextState>;
        updateLocalStorage?: boolean;
      }>,
    ) => {
      const { roles, organization, unit, user, activeRoute } =
        action.payload.data || {};
      if (roles !== undefined) state.roles = roles;
      if (organization !== undefined) state.organization = organization;
      if (unit !== undefined) state.unit = unit;
      if (user !== undefined) state.user = user;
      if (activeRoute !== undefined) state.activeRoute = activeRoute;

      // save state in localStorage
      if (action.payload.updateLocalStorage) {
        console.log('Setting selected in context slice:', state.selected);
        LocalStorage.set(LocalStorage.KEY.CONTEXT, _.cloneDeep(state));
      }
    },

    setSelected: (
      state,
      action: PayloadAction<{
        data: Partial<Selected>;
        updateLocalStorage?: boolean;
      }>,
    ) => {
      const { organization, unit } = action.payload.data || {};
      if (organization !== undefined)
        state.selected.organization = organization;
      if (unit !== undefined) state.selected.unit = unit;

      // save state in localStorage
      if (action.payload.updateLocalStorage) {
        console.log('Setting selected in context slice:', state.selected);
        LocalStorage.set(LocalStorage.KEY.CONTEXT, _.cloneDeep(state));
      }
    },
  },
});

export const { setContext, setSelected } = contextSlice.actions;
export default contextSlice.reducer;
