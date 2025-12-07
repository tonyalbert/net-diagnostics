import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function LatencyPacketLossChart({ data, groupBy }) {
  const getTitle = () => {
    switch(groupBy) {
      case 'day':
        return 'Latência e Perda de Pacotes por Dia';
      case 'city':
        return 'Latência e Perda de Pacotes por Cidade';
      case 'state':
        return 'Latência e Perda de Pacotes por Estado';
      default:
        return 'Latência e Perda de Pacotes';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getTitle()}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis 
            yAxisId="left" 
            label={{ value: 'Latência (ms)', angle: -90, position: 'insideLeft' }} 
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            label={{ value: 'Perda (%)', angle: 90, position: 'insideRight' }} 
          />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="Latência Média (ms)" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="Perda de Pacotes (%)" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

LatencyPacketLossChart.propTypes = {
  data: PropTypes.array.isRequired,
  groupBy: PropTypes.string.isRequired,
};

export default LatencyPacketLossChart;

