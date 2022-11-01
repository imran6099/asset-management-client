import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem, Select } from '@mui/material';

// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  handleCategoryUpdate: PropTypes.func,
  index: PropTypes.string,
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  index,
  onDeleteRow,
  handleCategoryUpdate,
}) {
  const theme = useTheme();
  const { name, price, id, dateOfPurchase, location, status } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const { category } = useSelector((state) => state);
  const { categories } = category;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left">{price}</TableCell>

      <TableCell align="left">{dateOfPurchase}</TableCell>

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

      <TableCell sx={{ alignItems: 'center' }}>
        {categories.length && (
          <Select name="category" onChange={(e) => handleCategoryUpdate(id, e.target.value)} fullWidth>
            {categories.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </TableCell>
    </TableRow>
  );
}
