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
import IssueNewEditForm from '../../../sections/@dashboard/issue/IssueNewEditForm';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { useEffect } from 'react';
import { getUsers } from '../../../redux/slices/user';
import { useDispatch } from 'react-redux';
import { createIssue } from '../../../redux/thunk/issue';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getIssues } from '../../../redux/slices/issue';
import useAuth from '../../../hooks/useAuth';

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
  const { user } = useAuth();

  const { query } = useRouter();

  const { itemId } = query;

  useEffect(() => {
    const getAllUsers = async () => {
      await dispatch(getUsers());
    };
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleIssueCreate = async (id, issue) => {
    const reduxResponse = await dispatch(createIssue(issue));
    if (reduxResponse.type === 'issue/create/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'issue/create/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getIssues());
      router.push(PATH_ADMIN.issue.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'superAdmin']} hasContent={true}>
      <Page title="Issue: Create a new issue">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new issue"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Issue', href: PATH_ADMIN.issue.list },
              { name: 'New issue' },
            ]}
          />
          <IssueNewEditForm handleIssueCreate={handleIssueCreate} itemId={itemId} userId={user.id} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
