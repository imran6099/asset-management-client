import { useState } from 'react';
// next
import Head from 'next/head';
import { useRouter } from 'next/router';
// @mui
import { Box, Tab, Tabs, Card, Grid, Divider, Container } from '@mui/material';
// redux
import { useSelector } from '../../../redux/store';
// routes
import { PATH_ADMIN } from '../../../routes/paths';
// layouts
import Layout from '../../../layouts';
import Page from '../../../components/Page';

// components
import Markdown from '../../../components/Markdown';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

import { SkeletonProductDetails } from '../../../components/skeleton';
// sections
import { ItemDetailsSummary, ItemDetailsCarousel } from '../../../sections/@dashboard/item/details';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

// ----------------------------------------------------------------------

ItemDetails.getLayout = (page) => <Layout>{page}</Layout>;

// ----------------------------------------------------------------------

export default function ItemDetails() {
  const {
    query: { id },
  } = useRouter();

  const { item, category } = useSelector((state) => state);

  const { items } = item;
  const { categories } = category;

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
    <RoleBasedGuard roles={['admin', 'superAdmin']} hasContent={true}>
      <Page title="Item: Create a new item">
        <Container maxWidth={'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new item"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Item', href: PATH_ADMIN.item.list },
              { name: currentItem.name || '' },
            ]}
          />

          {currentItem && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={7}>
                  <ItemDetailsCarousel item={currentItem} />
                </Grid>

                <Grid item xs={12} md={6} lg={5}>
                  <ItemDetailsSummary item={currentItem} />
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
