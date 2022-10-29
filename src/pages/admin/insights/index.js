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
import { _bookingReview, _bookingsOverview } from '../../../_mock';
// components
import Page from '../../../components/Page';
// sections
import {
  AppWelcome,
  AppWidgetSummary,
  AppCurrentDownload,
  BookingBookedRoom,
  BookingCheckInWidgets,
} from '../../../sections/@dashboard/insights';
// assets
import { SeoIllustration } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { getTotals, getItemWithStatus } from '../../../redux/slices/insights';

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

  const { insight, item } = useSelector((state) => state);
  const { totalItems, totalIssues, totalCategories } = insight.totals;
  const { items } = item;
  useEffect(() => {
    const fetchTotals = async () => {
      await dispatch(getTotals());
    };
    const fetchItemsBasedOnStatus = async () => {
      await dispatch(getItemWithStatus());
    };
    fetchItemsBasedOnStatus();
    fetchTotals();
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
            <AppWidgetSummary title="Total Items" total={totalItems} ix="Items" prefix="Items" />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary title="Total Issues" total={totalIssues} prefix="Issues" />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary title="Total Categories" total={totalCategories} prefix="Categories" />
          </Grid>

          <Grid item xs={12}>
            <AppCurrentDownload
              title="Item based on category"
              chartColors={[
                theme.palette.primary.lighter,
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.dark,
              ]}
              chartData={[
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <BookingBookedRoom
                  title="Items based on status"
                  data={[
                    { quantity: 12, status: 'active' },
                    { quantity: 5, status: 'inactive' },
                    { quantity: 80, status: 'damaged' },
                  ]}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <BookingBookedRoom title="Issues based on status" data={_bookingsOverview} />
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item xs={12} md={12}>
            <BookingCheckInWidgets
              title="Items based on Location"
              chartData={[
                { label: 'In ', percent: 72, total: 38566 },
                { label: 'Check Out', percent: 64, total: 18472 },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
