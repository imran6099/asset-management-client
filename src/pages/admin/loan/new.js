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
import LoanNewEditForm from '../../../sections/@dashboard/loan/LoanNewEditForm';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { useEffect } from 'react';
import { getUsers } from '../../../redux/slices/user';
import { useDispatch } from 'react-redux';
import { createLoan } from '../../../redux/thunk/loan';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getLoans } from '../../../redux/slices/loan';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

CompanyCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CompanyCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  useEffect(() => {
    const getAllUsers = async () => {
      await dispatch(getUsers());
    };
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoanCreate = async (id, transfer) => {
    const reduxResponse = await dispatch(createLoan(transfer));
    if (reduxResponse.type === 'loan/create/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'loan/create/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getLoans());
      router.push(PATH_ADMIN.loan.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager', 'user']} hasContent={true}>
      <Page title="Loan: Create a new loan">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new loan"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Loan', href: PATH_ADMIN.loan.list },
              { name: 'New Loan' },
            ]}
          />
          <LoanNewEditForm handleLoanCreate={handleLoanCreate} userId={user.id} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
