import api from './api';

class DiagnosticsService {
  async getDiagnostics(params = {}) {
    try {
      const response = await api.get('/diagnostics', { params });
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar diagnósticos',
        data: [],
        pagination: null,
      };
    }
  }


  async getDiagnosticById(id) {
    try {
      const response = await api.get(`/diagnostics/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar diagnóstico',
      };
    }
  }


  async getAggregatedData(params = {}) {
    try {
      const response = await api.get('/diagnostics/aggregate', { params });
      return {
        success: true,
        data: response.data.data,
        groupBy: response.data.group_by,
        filters: response.data.filters,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar dados agregados',
        data: [],
      };
    }
  }


  async getStatistics(params = {}) {
    try {
      const response = await api.get('/diagnostics/statistics', { params });
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Erro ao buscar estatísticas',
      };
    }
  }
}

export default new DiagnosticsService();

