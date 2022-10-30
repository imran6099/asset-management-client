import { useSelector } from 'react-redux';
import { paramCase, capitalCase } from 'change-case';
// next
import { useRouter } from 'next/router';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_ADMIN } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
// layouts
import Layout from '../../../../layouts';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../../../sections/@dashboard/user/UserNewEditForm';
// Guards
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateUser } from '../../../../redux/thunk/user';
import { getUsers } from '../../../../redux/slices/user';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const { userBase } = useSelector((state) => state);

  const { users } = userBase;

  const currentUser = users.find((user) => paramCase(user.id) === id);

  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleUserCreate = async (id, user) => {
    const reqObject = {
      id,
      user,
    };
    const reduxResponse = await dispatch(updateUser(reqObject));
    if (reduxResponse.type === 'user/update/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'user/update/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getUsers());
      router.push(PATH_ADMIN.user.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin']}>
      <Page title="User: Edit user">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit user"
            links={[
              { name: 'Dashboard', href: PATH_ADMIN.root },
              { name: 'user', href: PATH_ADMIN.user.list },
              { name: capitalCase(id) },
            ]}
          />

          <UserNewEditForm isEdit id={id} currentUser={currentUser} handleUserCreate={handleUserCreate} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
