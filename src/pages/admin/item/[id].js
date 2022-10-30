import { useState } from 'react';
// next
import { useRouter } from 'next/router';
// @mui
import { Box, Card, Grid, Divider, Container } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
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

  const [value, setValue] = useState('1');

  const { query } = useRouter();

  const { id } = query;

  const { item } = useSelector((state) => state);

  const { items } = item;

  const currentItem = items.find((item) => item.id === id);

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

            <Card>
              <TabContext value={value}>
                <Divider />

                <TabPanel value="1">
                  <Box sx={{ p: 3 }}>
                    <Markdown children={currentItem.description} />
                  </Box>
                </TabPanel>
              </TabContext>
            </Card>
          </>
        )}

        {!currentItem && <SkeletonProduct />}
      </Container>
    </Page>
  );
}
