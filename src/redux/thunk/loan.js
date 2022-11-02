import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createLoan = createAsyncThunk('loan/create', async (loan) => {
  const res = await axios.post('/loans', { ...loan });
  return res;
});

export const updateLoan = createAsyncThunk('loan/update', async ({ id, loan }) => {
  const res = await axios.patch(`/loans/${id}`, { ...loan });
  return res;
});

export const deleteLoan = createAsyncThunk('loan/remove', async (id) => {
  const res = await axios.delete(`/loans/${id}`);
  return res;
});

export const updateLoanReqStatus = createAsyncThunk('loan/update-req-status', async ({ id, status }) => {
  const res = await axios.post(`/loans/update-loan-req-status/${id}`, { ...status });
  return res;
});

export const updateLoanReturnStatus = createAsyncThunk('loan/update-return-status', async ({ id, status }) => {
  const res = await axios.post(`/loans/update-loan-return-status/${id}`, { ...status });
  return res;
});
