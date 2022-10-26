import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createItem = createAsyncThunk('item/create', async (item) => {
  const res = await axios.post('/items', { ...item });
  return res;
});

export const updateItem = createAsyncThunk('item/update', async ({ id, item }) => {
  const res = await axios.patch(`/items/${id}`, { ...item });
  return res;
});

export const deleteItem = createAsyncThunk('item/remove', async (id) => {
  const res = await axios.delete(`/items/${id}`);
  return res;
});
