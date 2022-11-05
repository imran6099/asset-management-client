import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  loans: [],
};

const slice = createSlice({
  name: 'loan',
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
    },

    // GET COMPANIES
    getLoansSuccess(state, action) {
      state.isLoading = false;
      state.loans = action.payload.results;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions (If There are any action to export)

// ----------------------------------------------------------------------

export function getLoans(limit = 10, page = 0) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/loans?limit=${limit}&page=${page}&populate=loanRequestFrom`);
      dispatch(slice.actions.getLoansSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
