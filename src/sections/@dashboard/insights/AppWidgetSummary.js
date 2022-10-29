import PropTypes from 'prop-types';
// @mui
import { Box, Card, Typography, Stack, Grid } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  chartColor: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(PropTypes.number).isRequired,
  percent: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({ title, prefix, total, sx, ...other }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Grid container>
          <Grid item xs={8}>
            <Typography variant="h3">
              {fNumber(total)} <Typography variant="body2">{prefix}</Typography>{' '}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}
