import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@mui/material';
import CSVReader from 'react-csv-reader';
import { loadData } from '../../../../redux/slices/data';
import { useDispatch, useSelector } from 'react-redux';
import ItemBulkData from './BulkTable';
import { addItemsToCategory } from '../../../../redux/slices/data';
import { v4 as uuidv4 } from 'uuid';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';

// ----------------------------------------------------------------------

MaxWidthDialog.propTypes = {
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  handleBulkUpload: PropTypes.func,
};

export default function MaxWidthDialog({ handleOpen, handleClose, open, handleBulkUpload }) {
  const dispatch = useDispatch();

  const { bulk } = useSelector((state) => state);

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  };

  const handleFileUpload = async (data) => {
    const bulkArray = data.map((res) => ({ ...res, id: uuidv4() }));
    await dispatch(loadData(bulkArray));
  };

  const handleCategoryUpdate = (id, UpdateBody) => {
    const payload = { id, UpdateBody };
    dispatch(addItemsToCategory(payload));
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager']}>
      <Button variant="outlined" onClick={handleOpen}>
        Max Width Dialog
      </Button>

      <Dialog open={open} maxWidth={false} fullWidth={true}>
        <DialogTitle>Upload Items using CSV Files</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please double check your data <Typography variant="body2">Especialy ID Fields</Typography>
          </DialogContentText>

          <Box
            component="form"
            noValidate
            sx={{
              margin: 'auto',
              display: 'flex',
              width: 'fit-content',
              flexDirection: 'column',
            }}
          >
            {!bulk.data?.length > 0 && (
              <CSVReader onFileLoaded={(data) => handleFileUpload(data)} parserOptions={papaparseOptions} />
            )}
          </Box>
          {bulk.data?.length > 0 ? (
            <ItemBulkData handleCategoryUpdate={handleCategoryUpdate} />
          ) : (
            <Typography> Upload Data</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {bulk.data?.length > 0 && (
            <Button onClick={() => handleBulkUpload(bulk.data)} variant="outlined" disabled={!bulk.isLoading}>
              Upload Data
            </Button>
          )}
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </RoleBasedGuard>
  );
}
