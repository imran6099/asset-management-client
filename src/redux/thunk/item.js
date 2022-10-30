import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createItem = createAsyncThunk('item/create', async (item) => {
  const res = await axios.post('/items', { ...item });
  return res;
});

export const createManyItems = createAsyncThunk('item/create-many', async (items) => {
  const res = await axios.post('/items/create-many', { items });
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

export const deleteManyItem = createAsyncThunk('item/remove-many', async (ids) => {
  const res = await axios.post(`/items/delete-many`, { ids });
  return res;
});
