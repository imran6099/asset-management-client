import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
// next
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, Button } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { SECTORS } from './config.company';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebase.config';
// ----------------------------------------------------------------------

CompanyNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCompany: PropTypes.object,
  handleCompanyCreate: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  id: PropTypes.string,
};

export default function CompanyNewEditForm({ isEdit = false, id, currentCompany, handleCompanyCreate, users }) {
  const NewCompanySchema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required'),
    companyLogo: Yup.string(),
    email: Yup.string().required('Email is required').email(),
    companyAddress: Yup.string().required('Company address is required'),
    companyNumber: Yup.string().required('Company number is required'),
    sector: Yup.string().required('Sector is required'),
    status: Yup.string().required('Status is required'),
    isVerified: Yup.boolean(),
    userId: Yup.string().required('User ID is required'),
  });

  const defaultValues = useMemo(
    () => ({
      companyName: currentCompany?.companyName || 'Bixi',
      companyLogo: currentCompany?.companyLogo || 'dsds',
      email: currentCompany?.email || 'info@bixi.so',
      companyAddress: currentCompany?.companyAddress || 'TCC',
      companyNumber: currentCompany?.companyNumber || '256444',
      sector: currentCompany?.sector || '',
      status: currentCompany?.status || 'active',
      isVerified: currentCompany?.isVerified || true,
      userId: currentCompany?.userId.id || '',
      id: !isEdit ? currentCompany?.id : undefined,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCompany]
  );

  const methods = useForm({
    resolver: yupResolver(NewCompanySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentCompany) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCompany]);

  const onSubmit = async (values) => {
    try {
      await handleCompanyCreate(id, values);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileRef = ref(storage, file.name);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      if (fileUrl) {
        setValue('companyLogo', fileUrl);
      }
    },
    [setValue]
  );

  const handleRemove = async (fileName) => {
    const desertRef = ref(storage, fileName);
    await deleteObject(desertRef);
    setValue('companyLogo', '');
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="companyLogo"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                    {values.companyLogo && (
                      <Button color="error" onClick={() => handleRemove(values.companyLogo)}>
                        Remove
                      </Button>
                    )}
                  </Box>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Company Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the company a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="companyName" label="Company Name" />
              <RHFTextField name="email" label="Company Email Address" />
              <RHFTextField name="companyNumber" label="Company Number" />

              <RHFSelect name="sector" label="Sector" placeholder="Sector">
                <option value="" />
                {SECTORS.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="companyAddress" label="Company Address" />

              <RHFSelect name="userId" label="User" placeholder="User">
                <option value="" />
                {users.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Company' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
