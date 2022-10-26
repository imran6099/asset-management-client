import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createUser = createAsyncThunk('user/create', async (user) => {
  const res = await axios.post('/users', { ...user });
  return res;
});

export const updateUser = createAsyncThunk('user/update', async ({ id, user }) => {
  const res = await axios.patch(`/users/${id}`, { ...user });
  return res;
});

export const deleteUser = createAsyncThunk('user/remove', async (id) => {
  const res = await axios.delete(`/users/${id}`);
  return res;
});
