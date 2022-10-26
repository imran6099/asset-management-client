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
import ItemNewEditForm from '../../../../sections/@dashboard/item/ItemNewEditForm';
// Guards
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateItem } from '../../../../redux/thunk/item';
import { getItems } from '../../../../redux/slices/item';
import { useEffect } from 'react';
import { getCategories } from '../../../../redux/slices/category';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  useEffect(() => {
    const getAllCategories = async () => {
      await dispatch(getCategories());
    };
    getAllCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const { item, category } = useSelector((state) => state);

  const { items } = item;
  const { categories } = category;

  const currentItem = items.find((item) => paramCase(item.id) === id);

  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleItemCreate = async (id, item) => {
    const reqObject = {
      id,
      item,
    };
    const reduxResponse = await dispatch(updateItem(reqObject));
    if (reduxResponse.type === 'item/update/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'item/update/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getItems());
      router.push(PATH_ADMIN.item.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'superAdmin']}>
      <Page title="Item: Edit item">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit user"
            links={[
              { name: 'Dashboard', href: PATH_ADMIN.root },
              { name: 'Item', href: PATH_ADMIN.item.list },
              { name: capitalCase(id) },
            ]}
          />

          <ItemNewEditForm
            id={id}
            handleItemCreate={handleItemCreate}
            isEdit
            currentItem={currentItem}
            categories={categories}
          />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
