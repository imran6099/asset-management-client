import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem, Select } from '@mui/material';

// components
import Label from '../../../../components/Label';
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

export default function UserTableRow({ row, selected, onSelectRow, handleCategoryUpdate }) {
  const theme = useTheme();

  const { category } = useSelector((state) => state);
  const { categories } = category;

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" noWrap>
          {row?.name}
        </Typography>
      </TableCell>

      <TableCell align="left">{row?.price}</TableCell>

      <TableCell align="left">{row?.dateOfPurchase}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {row?.location}
      </TableCell>

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(row?.status === 'damaged' && 'error') || (row?.status === 'inactive' && 'warning') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {row?.status}
        </Label>
      </TableCell>

      <TableCell sx={{ alignItems: 'center' }}>
        {categories.length && (
          <Select name="category" onChange={(e) => handleCategoryUpdate(row?.id, e.target.value)} fullWidth>
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
