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
import { ItemTableToolbar, ItemTableRow } from '../../../sections/@dashboard/item/list';

import { getItems } from '../../../redux/slices/item';
import { destroyData } from '../../../redux/slices/data';
import { getCategories } from '../../../redux/slices/category';
import { useDispatch, useSelector } from 'react-redux';
import { deleteItem, createManyItems, deleteManyItem } from '../../../redux/thunk/item';
import useAuth from '../../../hooks/useAuth';

import { useSnackbar } from 'notistack';
import MaxWidthDialog from './bulk/BulkFiles';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'active', 'damaged', 'inactive'];

const TABLE_HEAD = [
  { id: 'image', label: 'Image', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'itemNumber', label: 'Item ID Number', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'dateOfPurchase', label: 'Date Of Purchase', align: 'left' },
  { id: 'location', label: 'Location', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

// Companies Mock Data

// ----------------------------------------------------------------------

ItemList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
// ----------------------------------------------------------------------

export default function ItemList() {
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

  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchItems = async () => {
      await dispatch(getItems(rowsPerPage, page));
    };
    const fetchCategoreis = async () => {
      await dispatch(getCategories());
    };
    fetchItems();
    fetchCategoreis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, rowsPerPage, page]);

  const { item, category } = useSelector((state) => state);
  const { categories } = category;

  const CATEGORY_OPTIONS = categories.map((res) => res.name);
  CATEGORY_OPTIONS.push('all');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    dispatch(destroyData());
  };

  const { themeStretch } = useSettings();

  const { push } = useRouter();

  const [tableData, setTableData] = useState(item?.items || []);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('all');

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    const reduxResponse = await dispatch(deleteItem(id));
    if (reduxResponse.type === 'item/remove/rejected') {
      enqueueSnackbar('Failed', {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'item/remove/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      const deleteRow = tableData.filter((row) => row.id !== id);
      setSelected([]);
      setTableData(deleteRow);
      await dispatch(getItems());
    }
  };

  const handleDeleteRows = async (selected) => {
    const reduxResponse = await dispatch(deleteManyItem(selected));
    if (reduxResponse.type === 'item/remove-many/rejected') {
      enqueueSnackbar('Failed', {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'item/remove-many/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      const deleteRows = tableData.filter((row) => !selected.includes(row.id));
      setSelected([]);
      setTableData(deleteRows);
      await dispatch(getItems());
    }
  };

  const handleEditRow = (id) => {
    push(PATH_ADMIN.item.edit(id));
  };
  const handleShowMore = (id) => {
    push(PATH_ADMIN.item.view(id));
  };
  const handleNewIssue = (id) => {
    push(PATH_ADMIN.item.newIssue(id));
  };
  const handleTransfer = (id) => {
    push(PATH_ADMIN.item.newTransfer(id));
  };
  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  // Bulk File Upload
  const handleBulkUpload = async (data) => {
    const newArray = data.map(({ id, ...rest }) => rest);
    const reduxResponse = await dispatch(createManyItems(newArray));
    if (reduxResponse.type === 'item/create-many/rejected') {
      enqueueSnackbar('Failed', {
        variant: 'error',
      });
    } else if (reduxResponse.type === 'item/create-many/fulfilled') {
      enqueueSnackbar('Done', {
        variant: 'success',
      });
      dispatch(destroyData());
      dispatch(getItems());
      window.location.reload();
    }
  };

  return (
    <RoleBasedGuard roles={['admin', 'manager', 'user']} hasContent={true}>
      <Page title="Item: List">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Item List"
            links={[
              { name: 'ADMIN', href: PATH_ADMIN.root },
              { name: 'Item', href: PATH_ADMIN.item.root },
              { name: 'List' },
            ]}
            action={
              <Box>
                {user.role !== 'user' && (
                  <Box>
                    <NextLink href={PATH_ADMIN.item.new} passHref>
                      <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                        New item
                      </Button>
                    </NextLink>

                    <Button
                      sx={{ m: 2 }}
                      onClick={handleOpen}
                      variant="outlined"
                      startIcon={<Iconify icon={'eva:plus-fill'} />}
                    >
                      Upload CSV
                    </Button>
                  </Box>
                )}
              </Box>
            }
          />
          {open && (
            <MaxWidthDialog
              handleBulkUpload={handleBulkUpload}
              handleOpen={handleOpen}
              handleClose={handleClose}
              open={open}
            />
          )}

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

            <Divider />

            <ItemTableToolbar
              filterName={filterName}
              filterRole={filterRole}
              onFilterName={handleFilterName}
              onFilterRole={handleFilterRole}
              sectorOptions={CATEGORY_OPTIONS}
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
                    actions={
                      <Box>
                        {user.role !== 'user' && (
                          <Tooltip title="Delete">
                            <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                              <Iconify icon={'eva:trash-2-outline'} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    }
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
                      <ItemTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onShowMore={() => handleShowMore(row.id)}
                        onNewIssue={() => handleNewIssue(row.id)}
                        onTransfer={() => handleTransfer(row.id)}
                      />
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

function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item) => item.category?.name === filterRole);
  }

  return tableData;
}
