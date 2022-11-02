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
import TransferNewEditForm from '../../../../sections/@dashboard/transfer/TransferNewEditForm';
// Guards
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { updateTransfer } from '../../../../redux/thunk/transfer';
import { getTransfers } from '../../../../redux/slices/transfer';

// ----------------------------------------------------------------------

UserEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettings();

  const { query } = useRouter();

  const { id } = query;

  const { transfer } = useSelector((state) => state);

  const { transfers } = transfer;

  const currentTransfer = transfers.find((res) => paramCase(res.id) === id);

  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleTransferCreate = async (id, transfer) => {
    const reqObject = {
      id,
      transfer,
    };
    const reduxResponse = await dispatch(updateTransfer(reqObject));
    if (reduxResponse.type === 'transfer/update/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'transfer/update/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getTransfers());
      router.push(PATH_ADMIN.transfer.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager']}>
      <Page title="Transfer: Edit transfer">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit transfer"
            links={[
              { name: 'Dashboard', href: PATH_ADMIN.root },
              { name: 'Transfer', href: PATH_ADMIN.transfer.list },
              { name: capitalCase(id) },
            ]}
          />

          <TransferNewEditForm
            id={id}
            handleTransferCreate={handleTransferCreate}
            isEdit
            currentTransfer={currentTransfer}
          />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
