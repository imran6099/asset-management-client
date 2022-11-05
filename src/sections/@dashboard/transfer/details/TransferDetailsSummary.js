import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Divider, Typography } from '@mui/material';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';
import Label from '../../../../components/Label';
import { STATUS } from '../config.transfer';
import { LoadingButton } from '@mui/lab';
import useAuth from '../../../../hooks/useAuth';

// ----------------------------------------------------------------------

ItemDetailsSummary.propTypes = {
  transfer: PropTypes.object,
  handleTransferUpdate: PropTypes.func,
};

export default function ItemDetailsSummary({ transfer, handleTransferUpdate, ...other }) {
  const { id, item, transferRequestFrom, dateOfTransfer, transferTO, dateOfReturn, returned, transferReqStatus } =
    transfer;
  const { user } = useAuth();
  const theme = useTheme();

  const defaultValues = {
    transferReqStatus,
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (transfer) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transfer]);

  const onSubmit = async (data) => {
    try {
      handleTransferUpdate(id, data);
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
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Transfer Request Status:</Typography>
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
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Item</Typography>
          <Typography variant="subtitle2">{item?.name}</Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Transfer Request By</Typography>
          <Typography variant="subtitle2">{transferRequestFrom?.name}</Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Transfer Date</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              height: 36,
              lineHeight: '36px',
            }}
          >
            {dateOfTransfer?.split('T')[0]}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Return Date</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              height: 36,
              lineHeight: '36px',
            }}
          >
            {dateOfReturn?.split('T')[0]}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Transfer To</Typography>
          <Typography variant="subtitle2">
            To {transferTO?.whom} in {transferTO?.where}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Returned</Typography>
          <Typography variant="subtitle2">{returned ? 'Yes' : 'No'}</Typography>
        </Stack>
        {user.role === 'admin' && (
          <>
            <Stack direction="row" justifyContent="space-between">
              <RHFSelect name="transferReqStatus">
                <option value="" />
                {STATUS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.id}
                  </option>
                ))}
              </RHFSelect>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <LoadingButton type="submit" variant="outlined" size="large" loading={isSubmitting}>
                {'Update Transfer Request Status'}
              </LoadingButton>
            </Stack>
          </>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>
    </FormProvider>
  );
}
