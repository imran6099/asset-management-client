import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onShowMore: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onShowMore }) {
  const theme = useTheme();
  const { item, transferRequestFrom, dateOfTransfer, transferTO, dateOfReturn, returned, transferReqStatus } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { user } = useAuth();

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{item?.name}</TableCell>

      <TableCell align="left">{transferRequestFrom?.name}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {dateOfTransfer.split('T')[0]}
      </TableCell>

      <TableCell align="left">{`To ${transferTO?.whom} in ${transferTO?.where}`}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {dateOfReturn.split('T')[0]}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(!returned && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {returned ? 'Yes' : 'No'}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (transferReqStatus === 'rejected' && 'error') ||
            (transferReqStatus === 'under review' && 'warning') ||
            'success'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {transferReqStatus}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {user.role != 'user' && (
                <>
                  <MenuItem
                    onClick={() => {
                      onDeleteRow();
                      handleCloseMenu();
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <Iconify icon={'eva:trash-2-outline'} />
                    Delete
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onEditRow();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon={'eva:edit-fill'} />
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onShowMore();
                      handleCloseMenu();
                    }}
                  >
                    <Iconify icon={'eva:eye-fill'} />
                    Show More
                  </MenuItem>
                </>
              )}
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
