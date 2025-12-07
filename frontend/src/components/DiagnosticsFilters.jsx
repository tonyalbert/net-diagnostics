import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  CalendarMonth as CalendarIcon,
  LocationCity as CityIcon,
  Public as StateIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function DiagnosticsFilters({ 
  onApplyFilters, 
  showGroupBy = false,
  groupBy = 'day',
  onGroupByChange 
}) {
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ 
    city: '', 
    state: '', 
    startDate: '', 
    endDate: '' 
  });

  const handleApplyFilters = () => {
    const filters = {
      city: cityFilter,
      state: stateFilter,
      startDate: startDateFilter,
      endDate: endDateFilter
    };
    setAppliedFilters(filters);
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setCityFilter('');
    setStateFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    const emptyFilters = { city: '', state: '', startDate: '', endDate: '' };
    setAppliedFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...appliedFilters };
    
    switch(filterKey) {
      case 'city':
        setCityFilter('');
        newFilters.city = '';
        break;
      case 'state':
        setStateFilter('');
        newFilters.state = '';
        break;
      case 'startDate':
        setStartDateFilter('');
        newFilters.startDate = '';
        break;
      case 'endDate':
        setEndDateFilter('');
        newFilters.endDate = '';
        break;
      default:
        break;
    }
    
    setAppliedFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const hasActiveFilters = appliedFilters.city || appliedFilters.state || 
                          appliedFilters.startDate || appliedFilters.endDate;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {showGroupBy ? 'Filtros e Agrupamento' : 'Filtros'}
      </Typography>
      
      {showGroupBy && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Agrupar por:
          </Typography>
          <ToggleButtonGroup
            value={groupBy}
            exclusive
            onChange={(event, newValue) => {
              if (newValue !== null && onGroupByChange) {
                onGroupByChange(newValue);
              }
            }}
            size="small"
          >
            <ToggleButton value="day">
              <CalendarIcon sx={{ mr: 1 }} />
              Dia
            </ToggleButton>
            <ToggleButton value="city">
              <CityIcon sx={{ mr: 1 }} />
              Cidade
            </ToggleButton>
            <ToggleButton value="state">
              <StateIcon sx={{ mr: 1 }} />
              Estado
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Cidade"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Ex: Salvador"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Estado"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            placeholder="Ex: BA"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Data Inicial"
            type="date"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Data Final"
            type="date"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleApplyFilters}
              fullWidth
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Limpar
            </Button>
          </Box>
        </Grid>
      </Grid>

      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Filtros ativos:
          </Typography>
          {appliedFilters.city && (
            <Chip
              label={`Cidade: ${appliedFilters.city}`}
              size="small"
              onDelete={() => handleRemoveFilter('city')}
            />
          )}
          {appliedFilters.state && (
            <Chip
              label={`Estado: ${appliedFilters.state}`}
              size="small"
              onDelete={() => handleRemoveFilter('state')}
            />
          )}
          {appliedFilters.startDate && (
            <Chip
              label={`Data Inicial: ${format(new Date(appliedFilters.startDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}`}
              size="small"
              onDelete={() => handleRemoveFilter('startDate')}
            />
          )}
          {appliedFilters.endDate && (
            <Chip
              label={`Data Final: ${format(new Date(appliedFilters.endDate + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR })}`}
              size="small"
              onDelete={() => handleRemoveFilter('endDate')}
            />
          )}
        </Box>
      )}
    </Paper>
  );
}

DiagnosticsFilters.propTypes = {
  onApplyFilters: PropTypes.func.isRequired,
  showGroupBy: PropTypes.bool,
  groupBy: PropTypes.string,
  onGroupByChange: PropTypes.func,
};

export default DiagnosticsFilters;

