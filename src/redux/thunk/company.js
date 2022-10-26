import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createCompany = createAsyncThunk('company/create', async (company) => {
  const res = await axios.post('/company', { ...company });
  return res;
});

export const updateCompany = createAsyncThunk('company/update', async ({ id, company }) => {
  const res = await axios.patch(`/company/${id}`, { ...company });
  return res;
});

export const deleteCompany = createAsyncThunk('company/remove', async (id) => {
  const res = await axios.delete(`/company/${id}`);
  return res;
});
