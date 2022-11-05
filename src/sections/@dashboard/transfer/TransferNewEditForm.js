import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
// next
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Typography } from '@mui/material';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFTextField, RHFEditor } from '../../../components/hook-form';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

ItemNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentTransfer: PropTypes.object,
  handleTransferCreate: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default function ItemNewEditForm({ isEdit = false, id, currentTransfer, handleTransferCreate, userId, itemId }) {
  const NewItemSchema = Yup.object().shape({
    item: Yup.string().required('Item ID is required'),
    transferRequestFrom: Yup.string().required('Item ID is required'),
    reason: Yup.string().required('Reason is required'),
    dateOfTransfer: Yup.date().required('Transfer Date is required'),
    dateOfReturn: Yup.date().required('Return Date is required'),
    transferTO: Yup.object({
      where: Yup.string(),
      whom: Yup.string(),
    }).required('Required'),
  });
  const theme = useTheme();
  const defaultValues = useMemo(
    () => ({
      item: currentTransfer?.item.id || itemId,
      transferRequestFrom: currentTransfer?.transferRequestFrom.id || userId,
      reason: currentTransfer?.reason || '',
      dateOfTransfer: currentTransfer?.dateOfTransfer.split('T')[0] || '',
      dateOfReturn: currentTransfer?.dateOfReturn.split('T')[0] || '',
      transferTO: currentTransfer?.transferTO || { where: '', whom: '' },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTransfer]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentTransfer) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTransfer]);

  const onSubmit = async (values) => {
    try {
      await handleTransferCreate(id, values);
    } catch (error) {
      console.error(error);
    }
  };

  const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  }));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {isEdit && (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                (currentTransfer.transferReqStatus === 'rejected' && 'error') ||
                (currentTransfer.transferReqStatus === 'under review' && 'warning') ||
                'success'
              }
              sx={{ textTransform: 'capitalize' }}
            >
              {currentTransfer.transferReqStatus}
            </Label>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <LabelStyle>Reason</LabelStyle>

                <RHFEditor simple name="reason" />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <LabelStyle>Date Of Transfer</LabelStyle>
              <RHFTextField name="dateOfTransfer" type="date" />

              <LabelStyle>Date Of Return</LabelStyle>
              <RHFTextField name="dateOfReturn" type="date" />
              <Stack spacing={2}>
                <Grid item>
                  <LabelStyle>Transfer To Where?</LabelStyle>
                  <RHFTextField name="transferTO.where" />
                </Grid>
                <Grid item>
                  <LabelStyle>Transfer To Whom?</LabelStyle>

                  <RHFTextField name="transferTO.whom" />
                </Grid>
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Transfer' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
