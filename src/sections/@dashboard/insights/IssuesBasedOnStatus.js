// @mui
import PropTypes from 'prop-types';
import { Card, CardHeader, Typography, Stack, LinearProgress, Box } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

IssuesBasedOnStatus.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  data: PropTypes.array.isRequired,
};

export default function IssuesBasedOnStatus({ title, subheader, data, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Stack spacing={3} sx={{ px: 3, my: 5 }}>
        {data.map((progress) => (
          <LinearProgress
            variant="determinate"
            key={progress.status}
            value={progress.quantity}
            color={
              (progress.status === 'inactive' && 'warning') || (progress.status === 'damaged' && 'error') || 'success'
            }
            sx={{ height: 8, bgcolor: 'grey.50016' }}
          />
        ))}
      </Stack>
      <Stack direction="row" justifyContent="space-between" sx={{ px: 3, pb: 3 }}>
        {data.map((progress) => (
          <Stack key={progress.status} alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: 'success.main',
                  ...(progress.status === 'under review' && { bgcolor: 'warning.main' }),
                  ...(progress.status === 'rejected' && { bgcolor: 'error.main' }),
                }}
              />

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {progress.status}
              </Typography>
            </Stack>

            <Typography variant="h6">{fShortenNumber(progress.quantity)}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
