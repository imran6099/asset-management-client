import PropTypes from 'prop-types';
import { useEffect } from 'react';
// next
// form
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography } from '@mui/material';
// routes
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// _mock
// components
import { FormProvider } from '../../../../components/hook-form';

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
          <Typography
            variant="overline"
            component="div"
            sx={{
              color: (status === 'damaged' && 'error') || (status === 'inactive' && 'warning') || 'success',
            }}
          >
            {status}
          </Typography>

          <Typography variant="h5">{name}</Typography>

          <Typography variant="h4">{fCurrency(price)}</Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle2">{itemNumber}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="subtitle2"
            sx={{
              height: 36,
              lineHeight: '36px',
            }}
          >
            {category?.name}
          </Typography>

          <Stack spacing={1}>
            <Typography variant="caption" component="div" sx={{ textAlign: 'right', color: 'text.secondary' }}>
              Location: {location}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>
    </FormProvider>
  );
}
