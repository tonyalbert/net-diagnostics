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

function DiagnosticsCountChart({ data, groupBy }) {
  const getTitle = () => {
    switch(groupBy) {
      case 'day':
        return 'Quantidade de Diagnósticos por Dia';
      case 'city':
        return 'Quantidade de Diagnósticos por Cidade';
      case 'state':
        return 'Quantidade de Diagnósticos por Estado';
      default:
        return 'Quantidade de Diagnósticos';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {getTitle()}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#ffc658" name="Total de Diagnósticos" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

DiagnosticsCountChart.propTypes = {
  data: PropTypes.array.isRequired,
  groupBy: PropTypes.string.isRequired,
};

export default DiagnosticsCountChart;

