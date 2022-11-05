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
import LoanNewEditForm from '../../../../sections/@dashboard/loan/LoanNewEditForm';
// Guards
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateLoan } from '../../../../redux/thunk/loan';
import { getLoans } from '../../../../redux/slices/loan';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const { loan } = useSelector((state) => state);

  const { loans } = loan;

  const currentLoan = loans.find((res) => paramCase(res.id) === id);

  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleLoanCreate = async (id, loan) => {
    const reqObject = {
      id,
      loan,
    };
    const reduxResponse = await dispatch(updateLoan(reqObject));
    if (reduxResponse.type === 'loan/update/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'loan/update/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getLoans());
      router.push(PATH_ADMIN.loan.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager']}>
      <Page title="Loan: Edit loan">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit loan"
            links={[
              { name: 'Dashboard', href: PATH_ADMIN.root },
              { name: 'Loan', href: PATH_ADMIN.loan.list },
              { name: capitalCase(id) },
            ]}
          />

          <LoanNewEditForm id={id} handleLoanCreate={handleLoanCreate} isEdit currentLoan={currentLoan} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
