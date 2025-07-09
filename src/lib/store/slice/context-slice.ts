//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

import { UserResponse } from '@/interfaces/user.interface';
import { LocalStorage } from '@/utils/local-storage.class';

export interface Selected {
  organization?: string | null;
  unit?: string | null;
}

export interface ContextState {
  user: UserResponse | null;
  activeRoute: string | null;
  selectedOrganization?: string | null;
  selectedUnit?: string | null;
}

export const initialContextState: ContextState = {
  user: null,
  activeRoute: null,
  selectedOrganization: null,
  selectedUnit: null,
};

const contextSlice = createSlice({
  name: 'context',
  initialState: initialContextState,
  reducers: {
    setContext: (
      state,
      action: PayloadAction<{
        data: Partial<ContextState>;
        updateLocalStorage?: boolean;
      }>,
    ) => {
      const { user, activeRoute, selectedOrganization, selectedUnit } =
        action.payload.data || {};
      if (user !== undefined) state.user = user;
      if (activeRoute !== undefined) state.activeRoute = activeRoute;
      if (selectedOrganization !== undefined)
        state.selectedOrganization = selectedOrganization;
      if (selectedUnit !== undefined) state.selectedUnit = selectedUnit;

      // save state in localStorage
      if (action.payload.updateLocalStorage) {
        console.log('Setting selected in context slice:', state);
        LocalStorage.set(LocalStorage.KEY.CONTEXT, _.cloneDeep(state));
      }
    },
  },
});

export const { setContext } = contextSlice.actions;
export default contextSlice.reducer;
