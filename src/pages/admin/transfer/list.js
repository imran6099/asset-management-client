import { useState, useEffect } from 'react';
// next
import NextLink from 'next/link';
import { useRouter } from 'next/router';
// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// routes
import { PATH_ADMIN } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// layouts
import Layout from '../../../layouts';

// Guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../components/table';
// sections
import { TransferTableToolbar, TransferTableRow } from '../../../sections/@dashboard/transfer/list';

import { getUsers } from '../../../redux/slices/user';
import { getTransfers } from '../../../redux/slices/transfer';

import { useDispatch, useSelector } from 'react-redux';
import { deleteTransfer } from '../../../redux/thunk/transfer';

import { useSnackbar } from 'notistack';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'under review', 'accepted', 'rejected'];
const RETURN_OPTIONS = ['all', 'returned', 'not returned'];

const TABLE_HEAD = [
  { id: 'item', label: 'Item', align: 'left' },
  { id: 'transferRequestFrom', label: 'Transferred By', align: 'left' },
  { id: 'dateOfTransfer', label: 'Date Of Transfer', align: 'left' },
  { id: 'transferTO', label: 'Transferred', align: 'left' },
  { id: 'dateOfReturn', label: 'Date Of Return', align: 'left' },
  { id: 'returned', label: 'Return', align: 'left' },
  { id: 'transferReqStatus', label: 'Transfer Request Status', align: 'left' },
  { id: '' },
];

// Companies Mock Data

// ----------------------------------------------------------------------

UserList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
// ----------------------------------------------------------------------

export default function UserList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchTransfers = async () => {
      await dispatch(getTransfers());
    };
    const fetchUsers = async () => {
      await dispatch(getUsers());
    };

    {
      user.role === 'user'
        ? setTableData(transfer?.transfers.filter((res) => res.transferRequestFrom.id === user.id))
        : setTableData(transfer?.transfers);
    }

    fetchTransfers();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const { userBase, transfer } = useSelector((state) => state);
  const { users } = userBase;

  const USER_OPTIONS = users.map((res) => res.name);
  USER_OPTIONS.push('all');

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const { currentTab: filterReturn, onChangeTab: onChangeReturnStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    const reduxResponse = await dispatch(deleteTransfer(id));
    if (reduxResponse.type === 'transfer/remove/rejected') {
      enqueueSnackbar('Failed', {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'transfer/remove/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      const deleteRow = tableData.filter((row) => row.id !== id);
      setSelected([]);
      setTableData(deleteRow);
      await dispatch(getTransfers());
    }
  };

  // const handleDeleteRows = async (selected) => {
  //   const reduxResponse = await dispatch(selected);
  //   if (reduxResponse.type === 'item/remove-many/rejected') {
  //     enqueueSnackbar('Failed', {
  //       variant: 'error',
  //     });
  //   } else if (reduxResponse.type === 'item/remove-many/fulfilled') {
  //     enqueueSnackbar('Done', {
  //       variant: 'success',
  //     });
  //     const deleteRows = tableData.filter((row) => !selected.includes(row.id));
  //     setSelected([]);
  //     setTableData(deleteRows);
  //     await dispatch(getTransfers());
  //   }
  // };

  const handleEditRow = (id) => {
    push(PATH_ADMIN.transfer.edit(id));
  };

  const handleShowMore = (id) => {
    push(PATH_ADMIN.transfer.view(id));
  };

  const onReturn = (id) => {
    push(PATH_ADMIN.transfer.return(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
    filterReturn,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterReturn);

  return (
    <RoleBasedGuard roles={['admin', 'manager', 'user']} hasContent={true}>
      <Page title="Transfer: List">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Tranfers List"
            links={[
              { name: 'ADMIN', href: PATH_ADMIN.root },
              { name: 'Transfer', href: PATH_ADMIN.transfer.root },
              { name: 'List' },
            ]}
          />

          <Card>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterStatus}
              onChange={onChangeFilterStatus}
              sx={{ px: 2, bgcolor: 'background.neutral' }}
            >
              {STATUS_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterReturn}
              onChange={onChangeReturnStatus}
              sx={{ px: 2, marginTop: '1%', bgcolor: 'background.warning' }}
            >
              {RETURN_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <Divider />

            <TransferTableToolbar
              filterName={filterName}
              filterRole={filterRole}
              onFilterName={handleFilterName}
              onFilterRole={handleFilterRole}
              sectorOptions={USER_OPTIONS}
            />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                    // actions={
                    //   <Box>
                    //     {user.role !== 'user' && (
                    //       <Tooltip title="Delete">
                    //         <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                    //           <Iconify icon={'eva:trash-2-outline'} />
                    //         </IconButton>
                    //       </Tooltip>
                    //     )}
                    //   </Box>
                    // }
                  />
                )}

                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                      <>
                        <TransferTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row.id)}
                          onShowMore={() => handleShowMore(row.id)}
                          onReturn={() => onReturn(row.id)}
                        />
                      </>
                    ))}

                    <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: 'relative' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={dataFiltered.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
              />

              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
              />
            </Box>
          </Card>
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterReturn, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.title.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.transferReqStatus === filterStatus);
  }

  if (filterReturn !== 'all') {
    tableData = tableData.filter((item) => {
      if (filterReturn === 'returned') {
        return item.returned === true;
      }
      if (filterReturn === 'not returned') {
        return item.returned === false;
      }
    });
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item) => item.transferRequestFrom?.name === filterRole);
  }

  return tableData;
}
