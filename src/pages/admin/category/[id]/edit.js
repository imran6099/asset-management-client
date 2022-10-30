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
import CategoryNewEditForm from '../../../../sections/@dashboard/category/CategoryNewEditForm';
// Guards
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateCategory } from '../../../../redux/thunk/category';
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

  const { category } = useSelector((state) => state);

  const { categories } = category;

  const currentCategory = categories.find((category) => paramCase(category.id) === id);

  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleCategoryCreate = async (id, category) => {
    const reqObject = {
      id,
      category,
    };
    const reduxResponse = await dispatch(updateCategory(reqObject));
    if (reduxResponse.type === 'category/update/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'category/update/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getCategories());
      router.push(PATH_ADMIN.category.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager']}>
      <Page title="Category: Edit Category">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit Category"
            links={[
              { name: 'Dashboard', href: PATH_ADMIN.root },
              { name: 'Category', href: PATH_ADMIN.category.list },
              { name: capitalCase(id) },
            ]}
          />

          <CategoryNewEditForm
            id={id}
            handleCategoryCreate={handleCategoryCreate}
            isEdit
            currentCategory={currentCategory}
          />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
