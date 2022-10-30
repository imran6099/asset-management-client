import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const createIssue = createAsyncThunk('issue/create', async (issue) => {
  const res = await axios.post('/issues', { ...issue });
  return res;
});

export const updateIssue = createAsyncThunk('issue/update', async ({ id, issue }) => {
  const res = await axios.patch(`/issues/${id}`, { ...issue });
  return res;
});

export const deleteIssue = createAsyncThunk('issue/remove', async (id) => {
  const res = await axios.delete(`/issues/${id}`);
  return res;
});

export const deleteManyIssues = createAsyncThunk('issue/remove-many', async (ids) => {
  const res = await axios.post(`/issues/delete-many`, { ids });
  return res;
});

export const updateIssueStatus = createAsyncThunk('issue/update-status', async ({ id, status }) => {
  const res = await axios.post(`/issues/update-status/${id}`, { ...status });
  return res;
});
