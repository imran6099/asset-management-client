import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
// @mui
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormProvider, RHFUploadMultiFile } from '../../../components/hook-form';
import { LoadingButton } from '@mui/lab';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase.config';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// ----------------------------------------------------------------------

MaxWidthDialog.propTypes = {
  open: PropTypes.bool,
  handleOpen: PropTypes.func,
  handleClose: PropTypes.func,
  handleReturnUpdate: PropTypes.func,
  transfer: PropTypes.object,
  id: PropTypes.string,
};

export default function MaxWidthDialog({ id, transfer, handleClose, open, handleReturnUpdate }) {
  const NewItemSchema = Yup.object().shape({
    POD: Yup.array().required('Prove of delivery is required'),
  });

  const defaultValues = useMemo(
    () => ({
      returned: true,
      POD: [],
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
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

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

  console.log(errors);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Dialog open={open} maxWidth={false} fullWidth={false}>
        <DialogTitle>Upload Items using CSV Files</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} direction="column" alignItems="center" justify="center">
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={1}>
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
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoadingButton type="submit" variant="outlined" size="large" loading={isSubmitting}>
            Update Return
          </LoadingButton>
          <Button onClick={handleClose} variant="contained" color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
