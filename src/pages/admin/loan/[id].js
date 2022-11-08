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
import { LoanDetailsSummary } from '../../../sections/@dashboard/loan/details';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { getLoans } from '../../../redux/slices/loan';
import { updateLoanReqStatus } from '../../../redux/thunk/loan';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

IssueDetails.getLayout = (page) => <Layout>{page}</Layout>;

// ----------------------------------------------------------------------

export default function IssueDetails() {
  const {
    query: { id },
  } = useRouter();

  const { loan } = useSelector((state) => state);

  const { loans } = loan;

  const currentItem = loans.find((item) => item.id === id);
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState('reason');

  const TABS = [
    {
      value: 'reason',
      label: 'Reason',
      component: currentItem ? <Markdown children={currentItem?.reason} /> : null,
    },
  ];

  const dispatch = useDispatch();

  const handleLoanUpdate = async (id, status) => {
    const reqObject = {
      id,
      status,
    };
    const reduxResponse = await dispatch(updateLoanReqStatus(reqObject));
    if (reduxResponse.type === 'loan/update-req-status/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'loan/update-req-status/fulfilled') {
      enqueueSnackbar('Transfer Status Updated!', {
        variant: 'success',
      });
      await dispatch(getLoans());
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager', 'user']} hasContent={true}>
      <Page title="Loan: List">
        <Container maxWidth={'lg'}>
          <HeaderBreadcrumbs
            heading="Loan Details"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Loans', href: PATH_ADMIN.loan.list },
              { name: currentItem?.itemName || '' },
            ]}
          />

          {currentItem && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={5}>
                  <LoanDetailsSummary loan={currentItem} handleLoanUpdate={handleLoanUpdate} />
                </Grid>
              </Grid>
              <Card sx={{ marginTop: '2%' }}>
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
                          ...(currentTab === 'reason' && {
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
