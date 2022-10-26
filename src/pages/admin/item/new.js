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
import CompanyNewEditForm from '../../../sections/@dashboard/company/CompanyNewEditForm';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { useEffect } from 'react';
import { getUsers } from '../../../redux/slices/user';
import { useDispatch } from 'react-redux';
import { createCompany } from '../../../redux/thunk/company';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getCompanies } from '../../../redux/slices/company';

// ----------------------------------------------------------------------

CompanyCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CompanyCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { users } = user;

  useEffect(() => {
    const getAllUsers = async () => {
      await dispatch(getUsers());
    };
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleCompanyCreate = async (id, company) => {
    const reduxResponse = await dispatch(createCompany(company));
    if (reduxResponse.type === 'company/create/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'company/create/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getCompanies());
      router.push(PATH_ADMIN.company.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin']} hasContent={true}>
      <Page title="Company: Create a new company">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new company"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Company', href: PATH_ADMIN.company.list },
              { name: 'New company' },
            ]}
          />
          <CompanyNewEditForm handleCompanyCreate={handleCompanyCreate} users={users} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
