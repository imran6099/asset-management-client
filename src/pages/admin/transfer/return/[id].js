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
import { TransferReturn } from '../../../../sections/@dashboard/transfer/details';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { getTransfers } from '../../../../redux/slices/transfer';
import { updateTransferReturnStatus } from '../../../../redux/thunk/transfer';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

ReturnTransfer.getLayout = (page) => <Layout>{page}</Layout>;

// ----------------------------------------------------------------------

export default function ReturnTransfer() {
  const {
    query: { id },
  } = useRouter();
  const router = useRouter();

  const { transfer } = useSelector((state) => state);

  const { transfers } = transfer;

  const currentItem = transfers.find((item) => item.id === id);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const handleReturnUpdate = async (id, data) => {
    const reqObject = {
      id,
      data,
    };
    const reduxResponse = await dispatch(updateTransferReturnStatus(reqObject));
    if (reduxResponse.type === 'transfer/update-return-status/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'transfer/update-return-status/fulfilled') {
      enqueueSnackbar('Transfer Status Updated!', {
        variant: 'success',
      });
      await dispatch(getTransfers());
      router.push(PATH_ADMIN.transfer.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager', 'user']} hasContent={true}>
      <Page title="Transfer: Return">
        <Container maxWidth={'lg'}>
          <HeaderBreadcrumbs
            heading="Transfer Return"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Transfer', href: PATH_ADMIN.transfer.list },
              { name: currentItem?.id || '' },
            ]}
          />

          {currentItem && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={5}>
                  <TransferReturn transfer={currentItem} handleReturnUpdate={handleReturnUpdate} />
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
