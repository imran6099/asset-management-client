import { useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Tab, Tabs, Card, Grid, Divider, Container } from '@mui/material';
// redux
import { useSelector, useDispatch } from '../../../redux/store';
// routes
import { PATH_ADMIN } from '../../../routes/paths';
// layouts
import Layout from '../../../layouts';
import Page from '../../../components/Page';

// components
import Markdown from '../../../components/Markdown';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

// sections
import { IssueDetailsSummary } from '../../../sections/@dashboard/issue/details';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { getIssues } from '../../../redux/slices/issue';
import { updateIssueStatus } from '../../../redux/thunk/issue';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

IssueDetails.getLayout = (page) => <Layout>{page}</Layout>;

// ----------------------------------------------------------------------

export default function IssueDetails() {
  const {
    query: { id },
  } = useRouter();

  const { issue } = useSelector((state) => state);

  const { issues } = issue;

  const currentItem = issues.find((item) => item.id === id);
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState('description');

  const TABS = [
    {
      value: 'description',
      label: 'description',
      component: currentItem ? <Markdown children={currentItem?.description} /> : null,
    },
  ];

  const dispatch = useDispatch();

  const handleIssueUpdate = async (id, status) => {
    const reqObject = {
      id,
      status,
    };
    const reduxResponse = await dispatch(updateIssueStatus(reqObject));
    if (reduxResponse.type === 'issue/update-status/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'issue/update-status/fulfilled') {
      enqueueSnackbar('Issue Status Updated!', {
        variant: 'success',
      });
      await dispatch(getIssues());
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'superAdmin']} hasContent={true}>
      <Page title="Item: List">
        <Container maxWidth={'lg'}>
          <HeaderBreadcrumbs
            heading="Issue Details"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Issue', href: PATH_ADMIN.issue.list },
              { name: currentItem.title || '' },
            ]}
          />

          {currentItem && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={5}>
                  <IssueDetailsSummary issue={currentItem} handleIssueUpdate={handleIssueUpdate} />
                </Grid>
              </Grid>
              <Card>
                <Tabs
                  value={currentTab}
                  onChange={(event, newValue) => setCurrentTab(newValue)}
                  sx={{ px: 3, bgcolor: 'background.neutral' }}
                >
                  {TABS.map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                  ))}
                </Tabs>

                <Divider />

                {TABS.map(
                  (tab) =>
                    tab.value === currentTab && (
                      <Box
                        key={tab.value}
                        sx={{
                          ...(currentTab === 'description' && {
                            p: 3,
                          }),
                        }}
                      >
                        {tab.component}
                      </Box>
                    )
                )}
              </Card>
            </>
          )}
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
