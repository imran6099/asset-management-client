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
import { getUsers } from '../../../redux/slices/user';
import { useDispatch } from 'react-redux';
import { createUser } from '../../../redux/thunk/user';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

CompanyCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CompanyCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

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
          <UserNewEditForm handleUserCreate={handleUserCreate} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
