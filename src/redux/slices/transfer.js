import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  transfers: [],
};

const slice = createSlice({
  name: 'transfer',
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
    getTransfersSuccess(state, action) {
      state.isLoading = false;
      state.transfers = action.payload.results;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions (If There are any action to export)

// ----------------------------------------------------------------------

export function getTransfers(limit = 10, page = 0) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/transfers?limit=${limit}&&page=${page}&&populate=transferRequestFrom,item`);
      dispatch(slice.actions.getTransfersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
