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
import CompanyNewEditForm from '../../../../sections/@dashboard/company/CompanyNewEditForm';
// Guards
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateCompany } from '../../../../redux/thunk/company';
import { getCompanies } from '../../../../redux/slices/company';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const { company, user } = useSelector((state) => state);

  const { companies } = company;
  const { users } = user;

  const currentCompany = companies.find((company) => paramCase(company.id) === id);

  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleCompanyCreate = async (id, company) => {
    const reqObject = {
      id,
      company,
    };
    const reduxResponse = await dispatch(updateCompany(reqObject));
    if (reduxResponse.type === 'company/update/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'company/update/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getCompanies());
      router.push(PATH_ADMIN.company.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin']}>
      <Page title="Company: Edit company">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit user"
            links={[
              { name: 'Dashboard', href: PATH_ADMIN.root },
              { name: 'Company', href: PATH_ADMIN.company.list },
              { name: capitalCase(id) },
            ]}
          />

          <CompanyNewEditForm
            id={id}
            handleCompanyCreate={handleCompanyCreate}
            isEdit
            currentCompany={currentCompany}
            users={users}
          />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
