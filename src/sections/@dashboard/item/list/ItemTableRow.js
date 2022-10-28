import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import Image from '../../../../components/Image';
// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onShowMore: PropTypes.func,
  onNewIssue: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onNewIssue, onDeleteRow, onShowMore }) {
  const theme = useTheme();
  const { itemNumber, name, images, price, category, dateOfPurchase, location, status } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image
          disabledEffect
          visibleByDefault
          alt={name}
          src={images}
          sx={{ borderRadius: 1.5, width: 48, height: 48 }}
        />
      </TableCell>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>
      <TableCell align="left">{itemNumber}</TableCell>
      <TableCell align="left">{price}</TableCell>

      <TableCell align="left">{category?.name}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {dateOfPurchase?.split('T')[0]}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {location}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 'damaged' && 'error') || (status === 'inactive' && 'warning') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
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
              <MenuItem
                onClick={() => {
                  onNewIssue();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                New Issue
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
