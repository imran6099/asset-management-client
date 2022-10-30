import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, IconButton, InputAdornment } from '@mui/material';
// utils
// routes
// _mock
// components
import { FormProvider, RHFTextField, RHFSelect } from '../../../components/hook-form';
import Iconify from '../../../components/Iconify';
import { ROLE } from './user.config';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  handleUserCreate: PropTypes.func.isRequired,
  id: PropTypes.string,
};

export default function UserNewEditForm({ isEdit = false, currentUser, id, handleUserCreate }) {
  const NewUserSchema = Yup.object().shape({
    requirePassword: Yup.boolean(),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    password: Yup.string().when('requirePassword', {
      is: true,
      then: Yup.string().required('Must enter email address'),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || 'Imran',
      email: currentUser?.email || 'imro@bixi.so',
      password: !isEdit ? currentUser?.password || '' : undefined,
      requirePassword: isEdit ? false : true,
      role: currentUser?.role || 'admin',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (values) => {
    try {
      await handleUserCreate(id, values);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
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
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFSelect name="location" label="Location" placeholder="Location">
                <option value="" />
                {ROLE.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.id}
                  </option>
                ))}
              </RHFSelect>
              {!isEdit && (
                <RHFTextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
