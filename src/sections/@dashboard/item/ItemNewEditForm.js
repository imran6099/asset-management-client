import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// next
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, InputAdornment } from '@mui/material';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFSelect, RHFTextField, RHFEditor, RHFUpload } from '../../../components/hook-form';
import { STATUS } from './config.company';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  const [isFileUploading, setIsFileUploading] = useState(false);
  const NewItemSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    price: Yup.string().required('Price is required'),
    images: Yup.array(),
    dateOfPurchase: Yup.date().required('Date Of  Purchase is required'),
    location: Yup.string().required('Location is required'),
    status: Yup.string().required('Status is required'),
    category: Yup.string().required('Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentItem?.name || 'Canon 80d',
      description: currentItem?.description || 'This Item contains a lot of features',
      price: currentItem?.price || '1600',
      images: currentItem?.images || '',
      dateOfPurchase: currentItem?.dateOfPurchase.split('T')[0] || '2022-10-20',
      location: currentItem?.location || 'Juungal',
      status: currentItem?.status || 'active',
      category: currentItem?.category.id || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem]
  );

  const methods = useForm({
    resolver: yupResolver(NewItemSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
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

  const handleUpload = useCallback(() => {
    setIsFileUploading(true);
    const Images = [...values.images];
    const newImages = [];
    Images.map(async (file) => {
      const fileRef = ref(storage, file.name);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      newImages.push(fileUrl);
      setValue('images', newImages);
    });
    setIsFileUploading(false);
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

  // const handleDrop = useCallback(
  //   async (acceptedFiles) => {
  //     const file = acceptedFiles[0];
  //     const fileRef = ref(storage, file.name);
  //     await uploadBytes(fileRef, file);
  //     const fileUrl = await getDownloadURL(fileRef);

  //     if (fileUrl) {
  //       setValue('imageUrl', fileUrl);
  //     }
  //   },
  //   [setValue]
  // );

  // const handleRemove = async (fileName) => {
  //   const desertRef = ref(storage, fileName);
  //   await deleteObject(desertRef);
  //   setValue('imageUrl', '');
  // };

  console.log(values);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}
            <Stack spacing={3}>
              <RHFTextField name="name" label="Item Name" />

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Description
                </Typography>

                <RHFEditor simple name="description" />
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Images
                </Typography>

                <RHFUpload
                  multiple
                  thumbnail
                  name="images"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemoveFile}
                  onRemoveAll={handleRemoveAllFiles}
                  onUpload={handleUpload}
                  isFileUploading={isFileUploading}
                />
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mt={2}>
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
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="price"
                  label="Price"
                  placeholder="0.00"
                  value={getValues('price') === 0 ? '' : getValues('price')}
                  onChange={(event) => setValue('price', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          $
                        </Box>
                      </InputAdornment>
                    ),
                    type: 'number',
                  }}
                />

                <RHFTextField name="location" label="Location" />
                <RHFTextField name="dateOfPurchase" type="date" />
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
              {!isEdit ? 'Create Item' : 'Save Changes'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
