import { useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Card, Grid, Divider, Container, Tab, Tabs } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// routes
import { PATH_ADMIN } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import Markdown from '../../../components/Markdown';
import { SkeletonProduct } from '../../../components/skeleton';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { ItemDetailsSummary, ItemDetailsCarousel } from '../../../sections/@dashboard/item-details';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

EcommerceProductDetails.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EcommerceProductDetails() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const { item } = useSelector((state) => state);

  const { items } = item;

  const currentItem = items.find((item) => item.id === id);

  const [currentTab, setCurrentTab] = useState('description');

  const TABS = [
    {
      value: 'description',
      label: 'description',
      component: currentItem ? <Markdown children={currentItem?.description} /> : null,
    },
  ];

  return (
    <Page title="Items: Item Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Item Details"
          links={[
            { name: 'Dashboard', href: PATH_ADMIN.root },
            {
              name: 'Items',
              href: PATH_ADMIN.item.root,
            },
            { name: id || '' },
          ]}
        />

        {currentItem && (
          <>
            <Card>
              <Grid container>
                <Grid item xs={12} md={6} lg={7}>
                  <ItemDetailsCarousel product={currentItem} />
                </Grid>
                <Grid item xs={12} md={6} lg={5}>
                  <ItemDetailsSummary item={currentItem} />
                </Grid>
              </Grid>
            </Card>

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

        {!currentItem && <SkeletonProduct />}
      </Container>
    </Page>
  );
}
