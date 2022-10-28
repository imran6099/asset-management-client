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
import IssueNewEditForm from '../../../../sections/@dashboard/issue/IssueNewEditForm';
// Guards
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateIssue } from '../../../../redux/thunk/issue';
import { getIssues } from '../../../../redux/slices/issue';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const { issue, user } = useSelector((state) => state);

  const { issues } = issue;

  const currentIssue = issues.find((issue) => paramCase(issue.id) === id);

  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleIssueCreate = async (id, issue) => {
    const reqObject = {
      id,
      issue,
    };
    const reduxResponse = await dispatch(updateIssue(reqObject));
    if (reduxResponse.type === 'issue/update/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'issue/update/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getIssues());
      router.push(PATH_ADMIN.issue.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'superAdmin']}>
      <Page title="Issue: Edit issue">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit user"
            links={[
              { name: 'Dashboard', href: PATH_ADMIN.root },
              { name: 'Issue', href: PATH_ADMIN.issue.list },
              { name: capitalCase(id) },
            ]}
          />

          <IssueNewEditForm id={id} handleIssueCreate={handleIssueCreate} isEdit currentIssue={currentIssue} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
