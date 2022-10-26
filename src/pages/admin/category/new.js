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
import CategoryNewEditForm from '../../../sections/@dashboard/category/CategoryNewEditForm';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

import { useDispatch } from 'react-redux';
import { createCategory } from '../../../redux/thunk/category';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getCategories } from '../../../redux/slices/category';

// ----------------------------------------------------------------------

CategoryCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CategoryCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleCategoryCreate = async (id, category) => {
    const reduxResponse = await dispatch(createCategory(category));
    if (reduxResponse.type === 'category/create/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'category/create/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getCategories());
      router.push(PATH_ADMIN.category.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'superAdmin']} hasContent={true}>
      <Page title="Category: Create a new category">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new category"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Category', href: PATH_ADMIN.category.list },
              { name: 'New Category' },
            ]}
          />
          <CategoryNewEditForm handleCategoryCreate={handleCategoryCreate} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
