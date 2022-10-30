import { useState } from 'react';
// @mui
import { Box, Card, Container, Typography, CardHeader, ToggleButton, ToggleButtonGroup } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// layouts
import Layout from '../layouts';
// routes
import { PATH_USER } from '../routes/paths';
// components
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
// guards
import RoleBasedGuard from '../guards/RoleBasedGuard';

// ----------------------------------------------------------------------

PermissionDenied.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PermissionDenied() {
  const { themeStretch } = useSettings();

  const [role, setRole] = useState('admin');

  const handleChangeRole = (event, newRole) => {
    if (newRole !== null) {
      setRole(newRole);
    }
  };

  return (
    <Page title="Permission Denied">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Permission Denied"
          links={[
            {
              name: 'Dashboard',
              href: PATH_USER.root,
            },
            { name: 'Permission Denied' },
          ]}
        />

        <ToggleButtonGroup exclusive value={role} onChange={handleChangeRole} color="primary" sx={{ mb: 5 }}>
          <ToggleButton value="admin" aria-label="admin role">
            isAdmin
          </ToggleButton>

          <ToggleButton value="user" aria-label="user role">
            isUser
          </ToggleButton>
        </ToggleButtonGroup>
      </Container>
    </Page>
  );
}
