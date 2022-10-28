import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Box,
  Button,
  Dialog,
  Select,
  Switch,
  MenuItem,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  FormControlLabel,
  DialogContentText,
} from '@mui/material';

// ----------------------------------------------------------------------

MaxWidthDialog.propTypes = {
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
};

export default function MaxWidthDialog({ handleOpen, handleClose, open }) {
  const [fullWidth, setFullWidth] = useState(true);

  const [maxWidth, setMaxWidth] = useState('lg');

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Max Width Dialog
      </Button>

      <Dialog open={open} maxWidth={maxWidth} onClose={handleClose} fullWidth={fullWidth}>
        <DialogTitle>Optional sizes</DialogTitle>
        <DialogContent>
          <DialogContentText>You can set my maximum width and whether to adapt or not.</DialogContentText>

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
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                label="maxWidth"
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
                <MenuItem value={false}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch checked={fullWidth} onChange={handleFullWidthChange} />}
              label="Full width"
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
