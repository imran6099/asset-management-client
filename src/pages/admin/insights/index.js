import { useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// _mock_
// components
import Page from '../../../components/Page';
// sections
import {
  AppWelcome,
  AppWidgetSummary,
  AppCurrentDownload,
  BookingBookedRoom,
  BookingCheckInWidgets,
  IssuesBasedOnStatus,
  EcommerceSaleByGender,
} from '../../../sections/@dashboard/insights';
// assets
import { SeoIllustration } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTotals,
  getItemWithCategory,
  getItemWithStatus,
  getIssueWithStatus,
  getItemWithLocation,
  getTransfersWithReturnStatus,
  getLoansWithReturnStatus,
} from '../../../redux/slices/insights';

// ----------------------------------------------------------------------

GeneralApp.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();

  const theme = useTheme();

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const { insight } = useSelector((state) => state);

  useEffect(() => {
    const fetchTotals = async () => {
      await dispatch(getTotals());
    };
    const fetchItemsBasedOnStatus = async () => {
      await dispatch(getItemWithStatus());
    };
    const fetchIssuesBasedOnStatus = async () => {
      await dispatch(getIssueWithStatus());
    };
    const fetchItemsBasedOnLocation = async () => {
      await dispatch(getItemWithLocation());
    };
    const fetchItemsBasedOnCategory = async () => {
      await dispatch(getItemWithCategory());
    };
    const fetchTransfersBasedOnReturnStatus = async () => {
      await dispatch(getTransfersWithReturnStatus());
    };
    const fetchLoansBasedOnReturnStatus = async () => {
      await dispatch(getLoansWithReturnStatus());
    };
    fetchItemsBasedOnCategory();
    fetchItemsBasedOnLocation();
    fetchItemsBasedOnStatus();
    fetchIssuesBasedOnStatus();
    fetchTotals();
    fetchTransfersBasedOnReturnStatus();
    fetchLoansBasedOnReturnStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Page title="Insights">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AppWelcome
              title={`Welcome back! \n ${user?.name}`}
              description="This Information is generated from the data you enter, please keep your data consistant!"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary title="Total Items" total={insight?.totals?.totalItems} ix="Items" prefix="Items" />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary title="Total Issues" total={insight?.totals?.totalIssues} prefix="Issues" />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary title="Total Categories" total={insight?.totals?.totalCategories} prefix="Categories" />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary title="Total Transfers" total={insight?.totals?.totalTransfers} prefix="Categories" />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary title="Total Loans" total={insight?.totals?.totalLoans} prefix="Categories" />
          </Grid>

          {user.role != 'user' && (
            <Grid item xs={12} md={4}>
              <AppWidgetSummary title="Total Users" total={insight?.totals?.totalUsers} prefix="Categories" />
            </Grid>
          )}

          <Grid item xs={12}>
            <AppCurrentDownload
              title="Item based on category"
              chartColors={[
                theme.palette.primary.lighter,
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.dark,
              ]}
              chartData={insight?.itemsBasedOnCategory}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <BookingBookedRoom title="Items based on status" data={insight?.itemsBasedOnStatus} />
              </Grid>
              <Grid item xs={12} md={6}>
                <IssuesBasedOnStatus title="Issues based on status" data={insight?.issuesBasedOnStatus} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <BookingCheckInWidgets title="Items based on Location" chartData={insight?.itemsBasedOnLocation} />
          </Grid>
          <Grid item xs={12} md={6}>
            <EcommerceSaleByGender
              title="Transfers By Return Status"
              total={insight.totals?.totalTransfers}
              chartData={insight?.transfersBasedOnReturn}
              chartColors={[
                [theme.palette.primary.light, theme.palette.primary.main],
                [theme.palette.warning.light, theme.palette.warning.main],
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <EcommerceSaleByGender
              title="Loans By Return Status"
              total={insight.totals?.totalLoans}
              chartData={insight?.loansBasedOnReturn}
              chartColors={[
                [theme.palette.primary.light, theme.palette.primary.main],
                [theme.palette.warning.light, theme.palette.warning.main],
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
