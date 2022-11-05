import PropTypes from 'prop-types';
import { useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, Divider, Grid, Card, Typography } from '@mui/material';
import { FormProvider, RHFSelect, RHFCheckbox, RHFUploadMultiFile } from '../../../../components/hook-form';
import Label from '../../../../components/Label';
import { STATUS } from '../config.transfer';
import { LoadingButton } from '@mui/lab';
import useAuth from '../../../../hooks/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase.config';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

ItemDetailsSummary.propTypes = {
  transfer: PropTypes.object,
  handleReturnUpdate: PropTypes.func,
};

export default function ItemDetailsSummary({ transfer, handleReturnUpdate, ...other }) {
  const NewItemSchema = Yup.object().shape({
    returned: Yup.boolean(),
    POD: Yup.array().when('returned', {
      is: true,
      then: Yup.array().min(1, 'Please upload prove of delivery image'),
    }),
  });

  const { id } = transfer;
  const defaultValues = useMemo(
    () => ({
      returned: transfer?.returned,
      POD: transfer?.POD || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transfer]
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
    if (transfer) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transfer]);

  const onSubmit = async (data) => {
    try {
      handleReturnUpdate(id, data);
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();

  console.log(values);

  // Files section

  const handleUpload = useCallback(() => {
    const Images = [...values.POD];
    const newImages = [];
    Images.map(async (file) => {
      const fileRef = ref(storage, file.name);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);
      newImages.push(fileUrl);
      setValue('POD', newImages);
    });
  }, [setValue, values.POD]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('POD', [...files, ...newFiles]);
    },
    [setValue, values.images]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.images && values.images?.filter((file) => file !== inputFile);
    setValue('POD', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('POD', []);
  };

  const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  }));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} direction="column" alignItems="center" justify="center">
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <LabelStyle>Transfer Returned?</LabelStyle>
              <RHFCheckbox name="returned" label="Returned">
                Return
              </RHFCheckbox>

              <LabelStyle>Upload Prove Of Delivery</LabelStyle>
              <RHFUploadMultiFile
                showPreview
                name="POD"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={handleUpload}
              />
              <LoadingButton type="submit" variant="outlined" size="large" loading={isSubmitting}>
                {'Update Transfer Return Status'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
