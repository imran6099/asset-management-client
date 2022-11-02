import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createTransfer = createAsyncThunk('transfer/create', async (transfer) => {
  const res = await axios.post('/transfers', { ...transfer });
  return res;
});

export const updateTransfer = createAsyncThunk('transfer/update', async ({ id, transfer }) => {
  const res = await axios.patch(`/transfers/${id}`, { ...transfer });
  return res;
});

export const deleteTransfer = createAsyncThunk('transfer/remove', async (id) => {
  const res = await axios.delete(`/transfers/${id}`);
  return res;
});

export const updateTransferReqStatus = createAsyncThunk('loan/update-req-status', async ({ id, transferReqStatus }) => {
  const res = await axios.post(`/transfers/update-transfer-req-status/${id}`, { ...transferReqStatus });
  return res;
});

export const updateTransferReturnStatus = createAsyncThunk('loan/update-return-status', async ({ id, status }) => {
  const res = await axios.post(`/transfers/update-transfer-return-status/${id}`, { ...status });
  return res;
});
