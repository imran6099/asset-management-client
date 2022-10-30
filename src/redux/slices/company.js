import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  companies: [],
};

const slice = createSlice({
  name: 'company',
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
    getCompaniesSuccess(state, action) {
      state.isLoading = false;
      state.companies = action.payload.results;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions (If There are any action to export)

// ----------------------------------------------------------------------

export function getCompanies() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/company?populate=userId');
      dispatch(slice.actions.getCompaniesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createCompany(company) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/company', { ...company });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateCompany({ id }) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`api/companies/${id}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteCompany({ id }) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`api/companies/${id}`);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
