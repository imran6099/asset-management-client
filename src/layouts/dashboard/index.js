import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from '../../config';
//
import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import { useDispatch } from 'react-redux';
import { getCategories } from '../../redux/slices/category';
import { getIssues } from '../../redux/slices/issue';
import { getItems } from '../../redux/slices/item';
import { getLoans } from '../../redux/slices/loan';
import { getTransfers } from '../../redux/slices/transfer';

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();

  // All API calls
  useEffect(() => {
    const loadCategories = () => dispatch(getCategories());
    const loadItems = () => dispatch(getItems());
    const loadIssues = () => dispatch(getIssues());
    const loadTransfers = () => dispatch(getTransfers());
    const loadLoans = () => dispatch(getLoans());

    loadCategories();
    loadItems();
    loadIssues();
    loadTransfers();
    loadLoans();
  });

  const { collapseClick, isCollapse } = useCollapseDrawer();

  const { themeLayout } = useSettings();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);

  const verticalLayout = themeLayout === 'vertical';

  if (verticalLayout) {
    return (
      <>
        <DashboardHeader onOpenSidebar={() => setOpen(true)} verticalLayout={verticalLayout} />

        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        )}

        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          {children}
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />

      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />

      <MainStyle collapseClick={collapseClick}>{children}</MainStyle>
    </Box>
  );
}
