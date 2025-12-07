import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import diagnosticsService from '../services/diagnosticsService';
import DiagnosticsFilters from '../components/DiagnosticsFilters';
import StatisticsCards from '../components/StatisticsCards';
import LatencyPacketLossChart from '../components/charts/LatencyPacketLossChart';
import QualityOfServiceChart from '../components/charts/QualityOfServiceChart';
import DiagnosticsCountChart from '../components/charts/DiagnosticsCountChart';

function DiagnosticsCharts() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [appliedFilters, setAppliedFilters] = useState({ 
    city: '', 
    state: '', 
    startDate: '', 
    endDate: '' 
  });
  const [groupBy, setGroupBy] = useState('day');

  const fetchAggregatedData = async () => {
    setLoading(true);
    setError('');

    const params = {
      group_by: groupBy,
      ...(appliedFilters.city && { city: appliedFilters.city }),
      ...(appliedFilters.state && { state: appliedFilters.state }),
      ...(appliedFilters.startDate && { start_date: appliedFilters.startDate }),
      ...(appliedFilters.endDate && { end_date: appliedFilters.endDate }),
    };

    const result = await diagnosticsService.getAggregatedData(params);

    if (result.success) {
      setData(result.data);
    } else {
      setError(result.message);
      setData([]);
    }

    setLoading(false);
  };

  const fetchStatistics = async () => {
    const params = {
      ...(appliedFilters.city && { city: appliedFilters.city }),
      ...(appliedFilters.state && { state: appliedFilters.state }),
      ...(appliedFilters.startDate && { start_date: appliedFilters.startDate }),
      ...(appliedFilters.endDate && { end_date: appliedFilters.endDate }),
    };

    const result = await diagnosticsService.getStatistics(params);
    
    if (result.success) {
      setStats(result.data);
    }
  };

  useEffect(() => {
    fetchAggregatedData();
    fetchStatistics();
  }, [appliedFilters, groupBy]);

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
  };

  const handleGroupByChange = (newGroupBy) => {
    setGroupBy(newGroupBy);
  };

  const chartData = data.map((item) => {
    let label = '';
    
    if (groupBy === 'day') {
      label = item.day;
    } else if (groupBy === 'city') {
      label = `${item.city} - ${item.state}`;
    } else if (groupBy === 'state') {
      label = item.state;
    }

    return {
      name: label,
      'Latência Média (ms)': item.avg_latency_ms,
      'Perda de Pacotes (%)': item.avg_packet_loss,
      'Qualidade de Serviço': item.avg_quality_of_service,
      total: item.total,
    };
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gráficos e Estatísticas
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Visualize dados agregados de diagnósticos de rede
      </Typography>

      <DiagnosticsFilters 
        onApplyFilters={handleApplyFilters}
        showGroupBy={true}
        groupBy={groupBy}
        onGroupByChange={handleGroupByChange}
      />

      <StatisticsCards stats={stats} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Carregando dados...</Typography>
        </Paper>
      ) : data.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Nenhum dado encontrado para exibir
          </Typography>
        </Paper>
      ) : (
        <>
          <LatencyPacketLossChart data={chartData} groupBy={groupBy} />

          <QualityOfServiceChart data={chartData} groupBy={groupBy} />

          <DiagnosticsCountChart data={chartData} groupBy={groupBy} />
        </>
      )}
    </Box>
  );
}

export default DiagnosticsCharts;
