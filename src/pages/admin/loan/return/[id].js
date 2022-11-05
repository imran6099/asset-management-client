// next
import { useRouter } from 'next/router';
// @mui
import { Grid, Container } from '@mui/material';
// redux
import { useSelector, useDispatch } from '../../../../redux/store';
// routes
import { PATH_ADMIN } from '../../../../routes/paths';
// layouts
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';

// components
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

// sections
import { LoanReturn } from '../../../../sections/@dashboard/loan/details';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { getLoans } from '../../../../redux/slices/loan';
import { updateLoanReturnStatus } from '../../../../redux/thunk/loan';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

ReturnTransfer.getLayout = (page) => <Layout>{page}</Layout>;

// ----------------------------------------------------------------------

export default function ReturnTransfer() {
  const {
    query: { id },
  } = useRouter();
  const router = useRouter();

  const { loan } = useSelector((state) => state);

  const { loans } = loan;

  const currentItem = loans.find((item) => item.id === id);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const handleReturnUpdate = async (id, data) => {
    const reqObject = {
      id,
      data,
    };
    const reduxResponse = await dispatch(updateLoanReturnStatus(reqObject));
    if (reduxResponse.type === 'loan/update-return-status/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'loan/update-return-status/fulfilled') {
      enqueueSnackbar('Loan Return Status Updated!', {
        variant: 'success',
      });
      await dispatch(getLoans());
      router.push(PATH_ADMIN.loan.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager', 'user']} hasContent={true}>
      <Page title="Loan: Return">
        <Container maxWidth={'lg'}>
          <HeaderBreadcrumbs
            heading="Loan Return"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Transfer', href: PATH_ADMIN.transfer.list },
              { name: currentItem?.itemName || '' },
            ]}
          />

          {currentItem && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={5}>
                  <LoanReturn loan={currentItem} handleReturnUpdate={handleReturnUpdate} />
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
