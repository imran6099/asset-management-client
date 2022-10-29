import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  totals: {
    totalItems: 0,
    totalIssues: 0,
    totalCategories: 0,
  },
  itemsBasedOnStatus: {
    activeItems: 0,
    inactiveItems: 0,
    damagedItems: 0,
  },
};

const slice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.totals;
    },

    // GET INSIGHTS
    laodTotalsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.totals = action.payload;
    },
    laodItemOnStatusSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.itemsBasedOnStatus = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions (If There are any action to export)

// ----------------------------------------------------------------------

export function getTotals() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/insights/get-totals');
      dispatch(slice.actions.laodTotalsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getItemWithStatus() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/insights/get-items-based-on-status');
      dispatch(slice.actions.laodItemOnStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
