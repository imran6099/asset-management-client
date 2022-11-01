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
// ----------------------------------------------------------------------

ItemNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentIssue: PropTypes.object,
  handleIssueCreate: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default function ItemNewEditForm({ isEdit = false, id, currentIssue, handleIssueCreate, userId, itemId }) {
  const NewItemSchema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    description: Yup.string(),
    item: Yup.string().required('Item ID is required'),
    issuedBy: Yup.string().required('Item ID is required'),
    issuedDate: Yup.date().required('Issued Date is required'),
    status: Yup.string().required('Status is required'),
  });
  const theme = useTheme();
  const defaultValues = useMemo(
    () => ({
      title: currentIssue?.title || '',
      description: currentIssue?.description || '',
      issuedDate: currentIssue?.issuedDate.split('T')[0] || '2022-10-20',
      status: currentIssue?.status || 'under review',
      item: currentIssue?.item.id || itemId,
      issuedBy: currentIssue?.issuedBy.id || userId,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentIssue]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  useEffect(() => {
    if (isEdit && currentIssue) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentIssue]);

  const onSubmit = async (values) => {
    try {
      await handleIssueCreate(id, values);
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();
  console.log(values);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {isEdit && (
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={
                (currentIssue.status === 'rejected' && 'error') ||
                (currentIssue.status === 'under review' && 'warning') ||
                'success'
              }
              sx={{ textTransform: 'capitalize' }}
            >
              {currentIssue.status}
            </Label>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Issue Title" />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Description
                </Typography>

                <RHFEditor simple name="description" />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Issued Date
              </Typography>
              <RHFTextField name="issuedDate" type="date" />
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Issue' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
