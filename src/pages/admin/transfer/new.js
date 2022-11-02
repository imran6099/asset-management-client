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
import TransferNewEditForm from '../../../sections/@dashboard/transfer/TransferNewEditForm';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { useEffect } from 'react';
import { getUsers } from '../../../redux/slices/user';
import { useDispatch } from 'react-redux';
import { createTransfer } from '../../../redux/thunk/transfer';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getTransfers } from '../../../redux/slices/transfer';
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

  const { query } = useRouter();

  const { itemId } = query;

  useEffect(() => {
    const getAllUsers = async () => {
      await dispatch(getUsers());
    };
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTransferCreate = async (id, transfer) => {
    const reduxResponse = await dispatch(createTransfer(transfer));
    if (reduxResponse.type === 'transfer/create/rejected') {
      const { error } = reduxResponse;
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'transfer/create/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      await dispatch(getTransfers());
      router.push(PATH_ADMIN.transfer.list);
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager', 'user']} hasContent={true}>
      <Page title="Transfer: Create a new transfer">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new transfer"
            links={[
              { name: 'Admin', href: PATH_ADMIN.root },
              { name: 'Transfer', href: PATH_ADMIN.issue.list },
              { name: 'New Transfer' },
            ]}
          />
          <TransferNewEditForm handleTransferCreate={handleTransferCreate} itemId={itemId} userId={user.id} />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
