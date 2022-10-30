import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  issues: [],
};

const slice = createSlice({
  name: 'issue',
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
    getIssuesSuccess(state, action) {
      state.isLoading = false;
      state.issues = action.payload.results;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions (If There are any action to export)

// ----------------------------------------------------------------------

export function getIssues() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/issues?populate=issuedBy,item');
      dispatch(slice.actions.getIssuesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
