import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
// next
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { STATUS } from './config.company';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../firebase.config';
// ----------------------------------------------------------------------

ItemNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentItem: PropTypes.object,
  handleItemCreate: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  id: PropTypes.string,
};

export default function ItemNewEditForm({ isEdit = false, id, currentItem, handleItemCreate, categories }) {
  const NewCompanySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    price: Yup.string().required('Price is required'),
    imageUrl: Yup.string().required('Item Image is required'),
    dateOfPurchase: Yup.date().required('Date Of  Purchase is required'),
    location: Yup.string().required('Location is required'),
    status: Yup.string().required('Status is required'),
    category: Yup.string().required('Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || '',
      description: currentItem?.description || '',
      price: currentItem?.price || '',
      imageUrl: currentItem?.imageUrl || '',
      dateOfPurchase: currentItem?.dateOfPurchase.split('T')[0] || '',
      location: currentItem?.location || '',
      status: currentItem?.status || 'active',
      category: currentItem?.category.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewCompanySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentItem) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentItem]);

  const onSubmit = async (values) => {
    try {
      await handleItemCreate(id, values);
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
        setValue('imageUrl', fileUrl);
      }
    },
    [setValue]
  );

  const handleRemove = async (fileName) => {
    const desertRef = ref(storage, fileName);
    await deleteObject(desertRef);
    setValue('imageUrl', '');
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
                name="imageUrl"
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
                    {values.imageUrl && (
                      <Button color="error" onClick={() => handleRemove(values.imageUrl)}>
                        Remove
                      </Button>
                    )}
                  </Box>
                }
              />
            </Box>
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
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="description" label="Description" />
              <RHFTextField name="price" label="Price" type="number" />

              <RHFSelect name="status" label="Status" placeholder="Status">
                <option value="" />
                {STATUS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.id}
                  </option>
                ))}
              </RHFSelect>
              {categories.length && (
                <RHFSelect name="category" label="Category" placeholder="Category">
                  <option value="" />
                  {categories.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>
              )}

              <RHFTextField name="location" label="Location" />
              <RHFTextField name="dateOfPurchase" type="date" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Item' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
