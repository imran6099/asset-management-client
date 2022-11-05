import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  users: [],
  page: 0,
  limit: 0,
  totalPages: 0,
  totalResults: 0,
};

const slice = createSlice({
  name: 'user',
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
    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload.results;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
      state.totalResults = action.payload.totalResults;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions (If There are any action to export)

// ----------------------------------------------------------------------

export function getUsers(limit = 10, page = 0) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/users?limit=${limit}&&page=${page}`);
      dispatch(slice.actions.getUsersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
