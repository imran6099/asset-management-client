import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createCategory = createAsyncThunk('category/create', async (category) => {
  const res = await axios.post('/categories', { ...category });
  return res;
});

export const updateCategory = createAsyncThunk('category/update', async ({ id, category }) => {
  const res = await axios.patch(`/categories/${id}`, { ...category });
  return res;
});

export const deleteCategory = createAsyncThunk('category/remove', async (id) => {
  const res = await axios.delete(`/categories/${id}`);
  return res;
});
