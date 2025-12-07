from app.extensions import db
from typing import Dict, List, Optional, Tuple


class DiagnosticsService:
    """Serviço responsável por operações de diagnóstico"""
    
    @staticmethod
    def get_diagnostics_paginated(page: int, limit: int, city: Optional[str] = None, state: Optional[str] = None, start_date: Optional[str] = None, end_date: Optional[str] = None) -> Tuple[List[Dict], int]:
        """
        Retorna diagnósticos paginados com filtros opcionais
        
        Args:
            page: Número da página (começa em 1)
            limit: Quantidade de registros por página
            city: Filtro opcional por cidade
            state: Filtro opcional por estado
            start_date: Filtro opcional data inicial (formato: YYYY-MM-DD)
            end_date: Filtro opcional data final (formato: YYYY-MM-DD)
        """
        sql = "SELECT * FROM diagnostics WHERE 1=1"
        params = {}
        
        if city:
            sql += " AND city LIKE :city COLLATE NOCASE"
            params['city'] = f'%{city}%'
        
        if state:
            sql += " AND state LIKE :state COLLATE NOCASE"
            params['state'] = f'%{state}%'
        
        if start_date:
            sql += " AND DATE(date) >= DATE(:start_date)"
            params['start_date'] = start_date
        
        if end_date:
            sql += " AND DATE(date) <= DATE(:end_date)"
            params['end_date'] = end_date
        
        sql += " ORDER BY date DESC"
        
        count_sql = sql.replace("SELECT *", "SELECT COUNT(*) as total")
        total_result = db.session.execute(db.text(count_sql), params).fetchone()
        total = total_result.total if total_result else 0
        
        offset = (page - 1) * limit
        sql += " LIMIT :limit OFFSET :offset"
        params['limit'] = limit
        params['offset'] = offset
        
        result = db.session.execute(db.text(sql), params)
        
        data = []
        for row in result:
            data.append({
                'id': row.id,
                'device_id': row.device_id,
                'city': row.city,
                'state': row.state,
                'latency_ms': round(float(row.latency_ms), 2),
                'packet_loss': round(float(row.packet_loss), 2),
                'quality_of_service': round(float(row.quality_of_service), 2),
                'date': row.date
            })
        
        return data, total
    
    @staticmethod
    def get_diagnostic_by_id(diagnostic_id: int) -> Optional[Dict]:
        """
        Busca um diagnóstico específico por ID
        
        Args:
            diagnostic_id: ID do diagnóstico
        """
        sql = "SELECT * FROM diagnostics WHERE id = :id"
        result = db.session.execute(db.text(sql), {'id': diagnostic_id}).fetchone()
        
        if not result:
            return None
        
        return {
            'id': result.id,
            'device_id': result.device_id,
            'city': result.city,
            'state': result.state,
            'latency_ms': round(float(result.latency_ms), 2),
            'packet_loss': round(float(result.packet_loss), 2),
            'quality_of_service': round(float(result.quality_of_service), 2),
            'date': result.date
        }
    
    @staticmethod
    def get_aggregated_by_day(city: Optional[str] = None, state: Optional[str] = None, group_by: str = 'day', start_date: Optional[str] = None, end_date: Optional[str] = None) -> List[Dict]:
        """
        Retorna dados agregados por dia com médias de métricas
        
        Args:
            city: Filtro opcional por cidade
            state: Filtro opcional por estado
            group_by: Critério de agrupamento ('day', 'city', 'state')
            start_date: Filtro opcional data inicial (formato: YYYY-MM-DD)
            end_date: Filtro opcional data final (formato: YYYY-MM-DD)
        """
        params = {}
        
        if group_by == 'day':
            sql = """
                SELECT 
                    DATE(date) as day,
                    COUNT(*) as total,
                    ROUND(AVG(latency_ms), 2) as avg_latency,
                    ROUND(AVG(packet_loss), 2) as avg_packet_loss,
                    ROUND(AVG(quality_of_service), 2) as avg_quality,
                    ROUND(MIN(latency_ms), 2) as min_latency,
                    ROUND(MAX(latency_ms), 2) as max_latency
                FROM diagnostics
                WHERE 1=1
            """
            
            if city:
                sql += " AND city LIKE :city COLLATE NOCASE"
                params['city'] = f'%{city}%'
            
            if state:
                sql += " AND state LIKE :state COLLATE NOCASE"
                params['state'] = f'%{state}%'
            
            if start_date:
                sql += " AND DATE(date) >= DATE(:start_date)"
                params['start_date'] = start_date
            
            if end_date:
                sql += " AND DATE(date) <= DATE(:end_date)"
                params['end_date'] = end_date
            
            sql += " GROUP BY DATE(date) ORDER BY DATE(date) DESC"
            
        elif group_by == 'city':
            sql = """
                SELECT 
                    city,
                    state,
                    COUNT(*) as total,
                    ROUND(AVG(latency_ms), 2) as avg_latency,
                    ROUND(AVG(packet_loss), 2) as avg_packet_loss,
                    ROUND(AVG(quality_of_service), 2) as avg_quality
                FROM diagnostics
                WHERE 1=1
            """
            
            if state:
                sql += " AND state LIKE :state COLLATE NOCASE"
                params['state'] = f'%{state}%'
            
            if start_date:
                sql += " AND DATE(date) >= DATE(:start_date)"
                params['start_date'] = start_date
            
            if end_date:
                sql += " AND DATE(date) <= DATE(:end_date)"
                params['end_date'] = end_date
            
            sql += " GROUP BY city, state ORDER BY total DESC"
            
        elif group_by == 'state':
            sql = """
                SELECT 
                    state,
                    COUNT(*) as total,
                    ROUND(AVG(latency_ms), 2) as avg_latency,
                    ROUND(AVG(packet_loss), 2) as avg_packet_loss,
                    ROUND(AVG(quality_of_service), 2) as avg_quality
                FROM diagnostics
                WHERE 1=1
            """
            
            if start_date:
                sql += " AND DATE(date) >= DATE(:start_date)"
                params['start_date'] = start_date
            
            if end_date:
                sql += " AND DATE(date) <= DATE(:end_date)"
                params['end_date'] = end_date
            
            sql += " GROUP BY state ORDER BY total DESC"
        else:
            raise ValueError(f"Critério de agrupamento inválido: {group_by}")
        
        result = db.session.execute(db.text(sql), params)
        
        data = []
        for row in result:
            row_dict = {
                'total': row.total,
                'avg_latency_ms': float(row.avg_latency or 0),
                'avg_packet_loss': float(row.avg_packet_loss or 0),
                'avg_quality_of_service': float(row.avg_quality or 0)
            }
            
            if group_by == 'day':
                row_dict['day'] = row.day
                row_dict['min_latency_ms'] = float(row.min_latency or 0)
                row_dict['max_latency_ms'] = float(row.max_latency or 0)
            elif group_by == 'city':
                row_dict['city'] = row.city
                row_dict['state'] = row.state
            elif group_by == 'state':
                row_dict['state'] = row.state
            
            data.append(row_dict)
        
        return data
    
    @staticmethod
    def get_statistics(city: Optional[str] = None, state: Optional[str] = None, start_date: Optional[str] = None, end_date: Optional[str] = None) -> Dict:
        """
        Retorna estatísticas gerais dos diagnósticos
        
        Args:
            city: Filtro opcional por cidade
            state: Filtro opcional por estado
            start_date: Filtro opcional data inicial (formato: YYYY-MM-DD)
            end_date: Filtro opcional data final (formato: YYYY-MM-DD)
        """
        sql = """
            SELECT 
                COUNT(*) as total_diagnostics,
                COUNT(DISTINCT device_id) as total_devices,
                COUNT(DISTINCT city) as total_cities,
                COUNT(DISTINCT state) as total_states,
                ROUND(AVG(latency_ms), 2) as avg_latency,
                ROUND(AVG(packet_loss), 2) as avg_packet_loss,
                ROUND(AVG(quality_of_service), 2) as avg_quality,
                MIN(date) as first_diagnostic,
                MAX(date) as last_diagnostic
            FROM diagnostics
            WHERE 1=1
        """
        
        params = {}
        
        if city:
            sql += " AND city LIKE :city COLLATE NOCASE"
            params['city'] = f'%{city}%'
        
        if state:
            sql += " AND state LIKE :state COLLATE NOCASE"
            params['state'] = f'%{state}%'
        
        if start_date:
            sql += " AND DATE(date) >= DATE(:start_date)"
            params['start_date'] = start_date
        
        if end_date:
            sql += " AND DATE(date) <= DATE(:end_date)"
            params['end_date'] = end_date
        
        result = db.session.execute(db.text(sql), params).fetchone()
        
        if not result:
            return {}
        
        return {
            'total_diagnostics': result.total_diagnostics,
            'total_devices': result.total_devices,
            'total_cities': result.total_cities,
            'total_states': result.total_states,
            'avg_latency_ms': float(result.avg_latency or 0),
            'avg_packet_loss': float(result.avg_packet_loss or 0),
            'avg_quality_of_service': float(result.avg_quality or 0),
            'first_diagnostic': result.first_diagnostic,
            'last_diagnostic': result.last_diagnostic
        }

