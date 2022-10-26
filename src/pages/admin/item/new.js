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
import ItemNewEditForm from '../../../sections/@dashboard/item/ItemNewEditForm';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { useEffect } from 'react';
import { getCategories } from '../../../redux/slices/category';
import { useDispatch } from 'react-redux';
import { createItem } from '../../../redux/thunk/item';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getItems } from '../../../redux/slices/item';

// ----------------------------------------------------------------------

CompanyCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CompanyCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { category } = useSelector((state) => state);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { categories } = category;

  useEffect(() => {
    const getAllCategories = async () => {
      await dispatch(getCategories());
    };
    getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleItemCreate = async (id, item) => {
    const reduxResponse = await dispatch(createItem(item));
    if (reduxResponse.type === 'item/create/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'item/create/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getItems());
      router.push(PATH_ADMIN.item.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'superAdmin']} hasContent={true}>
      <Page title="Item: Create a new item">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new item"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Item', href: PATH_ADMIN.item.list },
              { name: 'New item' },
            ]}
          />
          <ItemNewEditForm handleItemCreate={handleItemCreate} categories={categories} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
