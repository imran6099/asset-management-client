// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { useEffect } from 'react';
import { getUsers } from '../../../redux/slices/user';
import { useDispatch } from 'react-redux';
import { createUser } from '../../../redux/thunk/user';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getCompanies } from '../../../redux/slices/company';

// ----------------------------------------------------------------------

CompanyCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CompanyCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { company } = useSelector((state) => state);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { companies } = company;

  useEffect(() => {
    const getAllCompanies = async () => {
      await dispatch(getCompanies());
    };
    getAllCompanies().catch((err) => {
      console.log(err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleUserCreate = async (id, user) => {
    try {
      const reduxResponse = await dispatch(createUser(user));
      if (reduxResponse.type === 'user/create/rejected') {
        const { error } = reduxResponse;
        enqueueSnackbar(`${error.message}`, {
          variant: 'error',
        });
      } else if (reduxResponse.type === 'user/create/fulfilled') {
        enqueueSnackbar('Done', {
          variant: 'success',
        });
        await dispatch(getUsers());
        router.push(PATH_ADMIN.user.list);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RoleBasedGuard roles={['admin']} hasContent={true}>
      <Page title="User: Create a new user">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new user"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'User', href: PATH_ADMIN.user.list },
              { name: 'New user' },
            ]}
          />
          <UserNewEditForm handleUserCreate={handleUserCreate} companies={companies} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
