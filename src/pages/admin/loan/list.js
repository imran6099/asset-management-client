import { useState, useEffect } from 'react';
// next
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Iconify from '../../../components/Iconify';

// @mui
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Switch,
  Divider,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Button,
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
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../components/table';
// sections
import { LoanTableRow, LoanTableToolbar } from '../../../sections/@dashboard/loan/list';

import { getUsers } from '../../../redux/slices/user';
import { getLoans } from '../../../redux/slices/loan';

import { useDispatch, useSelector } from 'react-redux';
import { deleteLoan } from '../../../redux/thunk/loan';

import { useSnackbar } from 'notistack';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'under review', 'accepted', 'rejected'];
const RETURN_OPTIONS = ['all', 'returned', 'not returned'];

const TABLE_HEAD = [
  { id: 'itemName', label: 'ItemName', align: 'left' },
  { id: 'loanRequestFrom', label: 'Loan By', align: 'left' },
  { id: 'dateOfLoan', label: 'Date Of Loan', align: 'left' },
  { id: 'owner', label: 'Item owner', align: 'left' },
  { id: 'location', label: 'Location of use', align: 'left' },
  { id: 'dateOfReturn', label: 'Date Of Return', align: 'left' },
  { id: 'returned', label: 'Return', align: 'left' },
  { id: 'loanReqStatus', label: 'Loan Request Status', align: 'left' },
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

  const { userBase, loan } = useSelector((state) => state);

  useEffect(() => {
    const fetchLoans = async () => {
      await dispatch(getLoans(rowsPerPage, page));
    };
    const fetchUsers = async () => {
      await dispatch(getUsers());
    };

    {
      user.role === 'user'
        ? setTableData(loan?.loans.filter((res) => res.loanRequestFrom.id === user.id))
        : setTableData(loan?.loans);
    }

    fetchLoans();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, rowsPerPage, page]);

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
    const reduxResponse = await dispatch(deleteLoan(id));
    if (reduxResponse.type === 'loan/remove/rejected') {
      enqueueSnackbar('Failed', {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'loan/remove/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      const deleteRow = tableData.filter((row) => row.id !== id);
      setSelected([]);
      setTableData(deleteRow);
      await dispatch(getLoans());
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
  //     await dispatch(getLoans());
  //   }
  // };

  const handleEditRow = (id) => {
    push(PATH_ADMIN.loan.edit(id));
  };

  const handleShowMore = (id) => {
    push(PATH_ADMIN.loan.view(id));
  };

  const onReturn = (id) => {
    push(PATH_ADMIN.loan.return(id));
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
      <Page title="Loan: List">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Loans List"
            links={[
              { name: 'ADMIN', href: PATH_ADMIN.root },
              { name: 'Loan', href: PATH_ADMIN.loan.root },
              { name: 'List' },
            ]}
            action={
              <Box>
                <Box>
                  <NextLink href={PATH_ADMIN.loan.new} passHref>
                    <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                      New Loan
                    </Button>
                  </NextLink>
                </Box>
              </Box>
            }
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

            <LoanTableToolbar
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
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <>
                        <LoanTableRow
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
                rowsPerPageOptions={[10, 25, 50, 100]}
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
    tableData = tableData.filter((item) => item.itemName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.loanReqStatus === filterStatus);
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
