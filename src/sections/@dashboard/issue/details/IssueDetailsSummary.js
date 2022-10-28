import PropTypes from 'prop-types';
import { useEffect } from 'react';
// next
// form
import { useForm } from 'react-hook-form';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Divider, Typography } from '@mui/material';
import { FormProvider, RHFSelect } from '../../../../components/hook-form';
import Label from '../../../../components/Label';
import { STATUS } from '../config.issue';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

ItemDetailsSummary.propTypes = {
  issue: PropTypes.object,
  handleIssueUpdate: PropTypes.func,
};

export default function ItemDetailsSummary({ issue, handleIssueUpdate, ...other }) {
  const { id, title, item, issuedBy, issuedDate, status } = issue;
  const theme = useTheme();

  const defaultValues = {
    status,
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
    if (item) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onSubmit = async (data) => {
    try {
      handleIssueUpdate(id, data);
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
          <Typography variant="h5">Issue Status:</Typography>
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(status === 'rejected' && 'error') || (status === 'under review' && 'warning') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Issue Title</Typography>
          <Typography variant="subtitle2">{title}</Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Item</Typography>
          <Typography variant="subtitle2">{item?.name}</Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Issued By</Typography>
          <Typography variant="subtitle2">{issuedBy?.name}</Typography>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5">Issued Date</Typography>
          <Typography
            variant="subtitle2"
            sx={{
              height: 36,
              lineHeight: '36px',
            }}
          >
            {issuedDate?.split('T')[0]}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <RHFSelect name="status">
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
            {'Update Issue Status'}
          </LoadingButton>
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />
      </Stack>
    </FormProvider>
  );
}
