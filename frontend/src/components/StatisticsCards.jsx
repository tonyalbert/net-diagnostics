import PropTypes from 'prop-types';
import {
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

function StatisticsCards({ stats }) {
  if (!stats) return null;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total de Diagnósticos
            </Typography>
            <Typography variant="h4">
              {stats.total_diagnostics}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Latência Média
            </Typography>
            <Typography variant="h4">
              {stats.avg_latency_ms.toFixed(1)} ms
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Perda Média
            </Typography>
            <Typography variant="h4">
              {stats.avg_packet_loss.toFixed(2)}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              QoS Média
            </Typography>
            <Typography variant="h4">
              {stats.avg_quality_of_service.toFixed(1)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

StatisticsCards.propTypes = {
  stats: PropTypes.shape({
    total_diagnostics: PropTypes.number,
    avg_latency_ms: PropTypes.number,
    avg_packet_loss: PropTypes.number,
    avg_quality_of_service: PropTypes.number,
  }),
};

export default StatisticsCards;

