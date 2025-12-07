import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function QualityOfServiceChart({ data, groupBy }) {
  const getTitle = () => {
    switch(groupBy) {
      case 'day':
        return 'Qualidade de Serviço por Dia';
      case 'city':
        return 'Qualidade de Serviço por Cidade';
      case 'state':
        return 'Qualidade de Serviço por Estado';
      default:
        return 'Qualidade de Serviço';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getTitle()}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis 
            domain={[85, 100]} 
            label={{ value: 'QoS', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Qualidade de Serviço" 
            stroke="#ff7300" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

QualityOfServiceChart.propTypes = {
  data: PropTypes.array.isRequired,
  groupBy: PropTypes.string.isRequired,
};

export default QualityOfServiceChart;

