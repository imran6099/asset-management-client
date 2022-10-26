import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

// ----------------------------------------------------------------------

ProfileAbout.propTypes = {
  profile: PropTypes.object,
};

export default function ProfileAbout({ profile }) {
  const { companyName, email, sector, companyNumber, companyAddress, apiSecret } = profile;

  return (
    <Card>
      <CardHeader title="Company Information" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h5">{companyName} </Typography>

        <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2">
            Address at &nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {companyAddress}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{email}</Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{companyNumber}</Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">Sector: {sector}</Typography>
        </Stack>
        <Stack direction="row">
          <Typography variant="body2">API KEY: {apiSecret}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
