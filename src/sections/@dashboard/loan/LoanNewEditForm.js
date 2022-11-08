import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useCallback } from 'react';
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
import { FormProvider, RHFTextField, RHFEditor, RHFSelect, RHFUploadMultiFile } from '../../../components/hook-form';
import { styled } from '@mui/material/styles';
import { LOCATION } from './config.loan';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase.config';
// ----------------------------------------------------------------------

ItemNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentLoan: PropTypes.object,
  handleLoanCreate: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default function ItemNewEditForm({ isEdit = false, id, currentLoan, handleLoanCreate, userId }) {
  const NewItemSchema = Yup.object().shape({
    itemName: Yup.string().required('Item Name is required'),
    loanRequestFrom: Yup.string().required('Required'),
    reason: Yup.string().required('Reason is required'),
    owner: Yup.string().required('Owner name is required'),
    locationOfUse: Yup.string().required('Place of usage is required'),
    dateOfLoan: Yup.date().required('Loan Date is required'),
    dateOfReturn: Yup.date().required('Return Date is required'),
  });
  const theme = useTheme();
  const defaultValues = useMemo(
    () => ({
      itemName: currentLoan?.itemName || '',
      loanRequestFrom: currentLoan?.loanRequestFrom.id || userId,
      reason: currentLoan?.reason || '',
      owner: currentLoan?.owner || '',
      images: currentLoan?.images || [],
      locationOfUse: currentLoan?.locationOfUse || '',
      dateOfLoan: currentLoan?.dateOfLoan.split('T')[0] || '',
      dateOfReturn: currentLoan?.dateOfReturn.split('T')[0] || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLoan]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentLoan) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentLoan]);

  const values = watch();

  const onSubmit = async (values) => {
    try {
      await handleLoanCreate(id, values);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = useCallback(() => {
    const Images = [...values.images];
    const newImages = [];
    Images.map(async (file) => {
      const fileRef = ref(storage, file.name);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      newImages.push(fileUrl);
      setValue('images', newImages);
    });
  }, [setValue, values.images]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles]);
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
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
                (currentLoan.loanReqStatus === 'rejected' && 'error') ||
                (currentLoan.loanReqStatus === 'under review' && 'warning') ||
                'success'
              }
              sx={{ textTransform: 'capitalize' }}
            >
              {currentLoan.loanReqStatus}
            </Label>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <LabelStyle>Item Name</LabelStyle>
              <RHFTextField name="itemName" />

              <LabelStyle>Images</LabelStyle>
              <RHFUploadMultiFile
                showPreview
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={handleUpload}
              />

              <LabelStyle>Reason</LabelStyle>

              <RHFEditor simple name="reason" />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <LabelStyle>Date Of Loan</LabelStyle>
              <RHFTextField name="dateOfLoan" type="date" />

              <LabelStyle>Date Of Return</LabelStyle>
              <RHFTextField name="dateOfReturn" type="date" />
              <Stack spacing={2}>
                <LabelStyle>Owner</LabelStyle>
                <RHFTextField name="owner" />
              </Stack>

              <RHFSelect name="locationOfUse" label="Location Of Use" placeholder="Location">
                <option value="" />
                {LOCATION.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.id}
                  </option>
                ))}
              </RHFSelect>

              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Create Loan' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
