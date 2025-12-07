import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Typography,
  Chip,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function DiagnosticsDataTable({
  diagnostics,
  loading,
  page,
  rowsPerPage,
  totalRecords,
  onPageChange,
  onRowsPerPageChange,
}) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getQualityColor = (quality) => {
    if (quality >= 95) return 'success';
    if (quality >= 90) return 'warning';
    return 'error';
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Dispositivo</strong></TableCell>
              <TableCell><strong>Cidade</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="right"><strong>Latência (ms)</strong></TableCell>
              <TableCell align="right"><strong>Perda de Pacotes (%)</strong></TableCell>
              <TableCell align="center"><strong>Qualidade de Serviço</strong></TableCell>
              <TableCell><strong>Data e Hora</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }}>Carregando...</Typography>
                </TableCell>
              </TableRow>
            ) : diagnostics.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhum diagnóstico encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              diagnostics.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.device_id}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell align="right">{row.latency_ms.toFixed(2)}</TableCell>
                  <TableCell align="right">{row.packet_loss.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.quality_of_service.toFixed(2)}
                      color={getQualityColor(row.quality_of_service)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(row.date)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`
        }
      />
    </Paper>
  );
}

DiagnosticsDataTable.propTypes = {
  diagnostics: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  totalRecords: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};

export default DiagnosticsDataTable;

