import { createSlice } from '@reduxjs/toolkit';

import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  data: [],
};

const slice = createSlice({
  name: 'category',
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

    // GET CATEGORIES
    loadDataSuccess(state, action) {
      state.isLoading = false;
      state.data = action.payload;
    },

    destroyData(state) {
      state.isLoading = false;
      state.data = [];
    },
    addItemsToCategory(state, action) {
      const id = action.payload.id;
      const categoryId = action.payload.UpdateBody;
      const updatedArray = state.data.map((res) => {
        if (res.id === id) {
          return {
            ...res,
            category: categoryId,
          };
        }
        return res;
      });
      state.data = updatedArray;
    },
    isItemLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { destroyData, addItemsToCategory, isItemLoading } = slice.actions;

// Reducer
export default slice.reducer;

// Actions (If There are any action to export)

// ----------------------------------------------------------------------

export function loadData(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(slice.actions.loadDataSuccess(data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------
