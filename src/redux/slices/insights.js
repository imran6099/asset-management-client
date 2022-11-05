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
    totalTransfers: 0,
    totalLoans: 0,
    totalUsers: 0,
  },
  itemsBasedOnStatus: [],
  issuesBasedOnStatus: [],
  itemsBasedOnLocation: [],
  itemsBasedOnCategory: [],
  transfersBasedOnReturn: [],
  loansBasedOnReturn: [],
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
    laodIssueOnStatusSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.issuesBasedOnStatus = action.payload;
    },
    laodItemOnLocationSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.itemsBasedOnLocation = action.payload;
    },
    laodItemOnCategorySuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.itemsBasedOnCategory = action.payload;
    },
    loadTransfersWithReturnStatus(state, action) {
      state.isLoading = false;
      state.error = null;
      state.transfersBasedOnReturn = action.payload;
    },
    loadLoansWithReturnStatus(state, action) {
      state.isLoading = false;
      state.error = null;
      state.loansBasedOnReturn = action.payload;
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

export function getIssueWithStatus() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/insights/get-issues-based-on-status');
      dispatch(slice.actions.laodIssueOnStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getItemWithLocation() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/insights/get-items-based-on-location');
      dispatch(slice.actions.laodItemOnLocationSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getItemWithCategory() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/insights/get-items-based-on-category');
      dispatch(slice.actions.laodItemOnCategorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTransfersWithReturnStatus() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/insights/get-transfers-based-on-return-status');
      dispatch(slice.actions.loadTransfersWithReturnStatus(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getLoansWithReturnStatus() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/insights/get-loans-based-on-return-status');
      dispatch(slice.actions.loadLoansWithReturnStatus(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
