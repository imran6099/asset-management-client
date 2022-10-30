import PropTypes from 'prop-types';
import { useEffect } from 'react';
// next
import { useTheme } from '@mui/material/styles';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography } from '@mui/material';
// routes
// utils
import { fCurrency } from '../../../utils/formatNumber';
// _mock
// components
import { FormProvider } from '../../../components/hook-form';
import Label from '../../../components/Label';

// ----------------------------------------------------------------------

ItemDetailsSummary.propTypes = {
  item: PropTypes.object,
};

export default function ItemDetailsSummary({ item, ...other }) {
  const { itemNumber, name, price, category, dateOfPurchase, location, status } = item;

  const defaultValues = {
    itemNumber,
    name,
    price,
    category,
    dateOfPurchase,
    location,
    status,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (item) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const theme = useTheme();

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={3}
        sx={{
          p: (theme) => ({
            md: theme.spacing(5, 5, 0, 2),
          }),
        }}
        {...other}
      >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">Item Status:</Typography>
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={(status === 'damaged' && 'error') || (status === 'inactive' && 'warning') || 'success'}
              sx={{ textTransform: 'capitalize' }}
            >
              {status}
            </Label>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">Item Name</Typography>
            <Typography variant="h6">{name}</Typography>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h5">Item Price</Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>
              &nbsp;{fCurrency(price)}
            </Typography>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Item Number</Typography>
            <Typography variant="h6">{itemNumber}</Typography>
          </Stack>
          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Item Location</Typography>
            <Typography variant="h6">{location}</Typography>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5">Item Category</Typography>
            <Typography variant="h6">{category?.name}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>
    </FormProvider>
  );
}
