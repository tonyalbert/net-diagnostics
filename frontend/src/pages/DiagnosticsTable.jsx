import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import diagnosticsService from '../services/diagnosticsService';
import DiagnosticsFilters from '../components/DiagnosticsFilters';
import DiagnosticsDataTable from '../components/DiagnosticsDataTable';

function DiagnosticsTable() {
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const [appliedFilters, setAppliedFilters] = useState({ 
    city: '', 
    state: '', 
    startDate: '', 
    endDate: '' 
  });

  const fetchDiagnostics = async () => {
    setLoading(true);
    setError('');

    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(appliedFilters.city && { city: appliedFilters.city }),
      ...(appliedFilters.state && { state: appliedFilters.state }),
      ...(appliedFilters.startDate && { start_date: appliedFilters.startDate }),
      ...(appliedFilters.endDate && { end_date: appliedFilters.endDate }),
    };

    const result = await diagnosticsService.getDiagnostics(params);

    if (result.success) {
      setDiagnostics(result.data);
      setTotalRecords(result.pagination?.total || 0);
    } else {
      setError(result.message);
      setDiagnostics([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDiagnostics();
  }, [page, rowsPerPage, appliedFilters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setPage(0);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Diagnósticos de Rede
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Visualize os diagnósticos de rede
      </Typography>

      <DiagnosticsFilters onApplyFilters={handleApplyFilters} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DiagnosticsDataTable
        diagnostics={diagnostics}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Chip
          label={`Total de registros: ${totalRecords}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Página ${page + 1} de ${Math.ceil(totalRecords / rowsPerPage) || 1}`}
          variant="outlined"
        />
      </Box>
    </Box>
  );
}

export default DiagnosticsTable;
