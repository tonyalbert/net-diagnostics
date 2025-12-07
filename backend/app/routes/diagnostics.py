from flask import Blueprint, request, current_app, url_for
from app.services.diagnostics_service import DiagnosticsService
from app.utils.validators import RequestValidator, ValidationError
import jwt

diagnostics_bp = Blueprint('diagnostics', __name__)


def verify_token():
    """Helper para verificar token JWT"""
    token = request.headers.get('Authorization')
    if not token:
        return None
    
    if token.startswith('Bearer '):
        token = token[7:]

    try:
        jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return True
    except:
        return None


@diagnostics_bp.route('/diagnostics', methods=['GET'])
def get_diagnostics():
    """
    Endpoint de paginação
    
    Retorna diagnósticos paginados com suporte a filtros
    
    Query Params:
        - page (int): Número da página (default: 1)
        - limit (int): Itens por página (default: 10, max: 100)
        - city (str): Filtro por cidade (opcional)
        - state (str): Filtro por estado (opcional)
        - start_date (str): Filtro por data inicial (formato: YYYY-MM-DD)
        - end_date (str): Filtro por data final (formato: YYYY-MM-DD)
    
    """
    if not verify_token():
        return {'message': 'Unauthorized'}, 401
    
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        city = request.args.get('city')
        state = request.args.get('state')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        page, limit = RequestValidator.validate_pagination_params(page, limit)
        city, state = RequestValidator.validate_filter_params(city, state)
        
        data, total = DiagnosticsService.get_diagnostics_paginated(
            page=page,
            limit=limit,
            city=city,
            state=state,
            start_date=start_date,
            end_date=end_date
        )
        
        total_pages = (total + limit - 1) // limit if total > 0 else 0
        
        qs = request.args.to_dict()
        next_url = None
        prev_url = None
        
        if page < total_pages:
            qs['page'] = page + 1
            next_url = url_for('diagnostics.get_diagnostics', _external=True, **qs)
        
        if page > 1:
            qs['page'] = page - 1
            prev_url = url_for('diagnostics.get_diagnostics', _external=True, **qs)
        
        return {
            'data': data,
            'pagination': {
                'total': total,
                'page': page,
                'limit': limit,
                'total_pages': total_pages,
                'has_next': page < total_pages,
                'has_prev': page > 1,
                'next_url': next_url,
                'prev_url': prev_url
            }
        }, 200
    
    except ValidationError as e:
        return {'error': str(e)}, 400
    
    except Exception as e:
        current_app.logger.error(f'Erro ao buscar diagnósticos: {str(e)}')
        return {'error': 'Erro interno do servidor'}, 500


@diagnostics_bp.route('diagnostics/<int:id>', methods=['GET'])
def get_diagnostic(id):
    """
    Buscar diagnóstico por ID
    
    Args:
        id (int): ID do diagnóstico
    
    """
    if not verify_token():
        return {'message': 'Unauthorized'}, 401
    
    try:
        data = DiagnosticsService.get_diagnostic_by_id(id)
        
        if not data:
            return {'error': 'Diagnóstico não encontrado'}, 404
        
        return {'data': data}, 200
        
    except Exception as e:
        current_app.logger.error(f'Erro ao buscar diagnóstico {id}: {str(e)}')
        return {'error': 'Erro interno do servidor'}, 500


@diagnostics_bp.route('diagnostics/aggregate', methods=['GET'])
def get_aggregated():
    """
    Endpoint de agregação
    
    Retorna dados agregados por critério (dia, cidade ou estado)
    
    Query Params:
        - group_by (str): Critério de agrupamento - 'day', 'city' ou 'state' (default: 'day')
        - city (str): Filtro por cidade (opcional)
        - state (str): Filtro por estado (opcional)
        - start_date (str): Filtro por data inicial (formato: YYYY-MM-DD)
        - end_date (str): Filtro por data final (formato: YYYY-MM-DD)
    """
    if not verify_token():
        return {'message': 'Unauthorized'}, 401

    try:
        group_by = request.args.get('group_by', 'day')
        city = request.args.get('city')
        state = request.args.get('state')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        group_by = RequestValidator.validate_group_by(group_by)
        city, state = RequestValidator.validate_filter_params(city, state)
        
        data = DiagnosticsService.get_aggregated_by_day(
            city=city,
            state=state,
            group_by=group_by,
            start_date=start_date,
            end_date=end_date
        )
        
        return {
            'data': data,
            'group_by': group_by,
            'filters': {
                'city': city,
                'state': state
            }
        }, 200
    
    except ValidationError as e:
        return {'error': str(e)}, 400

    except Exception as e:
        current_app.logger.error(f'Erro ao buscar dados agregados: {str(e)}')
        return {'error': 'Erro interno do servidor'}, 500


@diagnostics_bp.route('diagnostics/statistics', methods=['GET'])
def get_statistics():
    """
    Endpoint de estatísticas gerais
    
    Retorna estatísticas agregadas dos diagnósticos
    
    Query Params:
        - city (str): Filtro por cidade (opcional)
        - state (str): Filtro por estado (opcional)
        - start_date (str): Filtro por data inicial (formato: YYYY-MM-DD)
        - end_date (str): Filtro por data final (formato: YYYY-MM-DD)
    
    """
    if not verify_token():
        return {'message': 'Unauthorized'}, 401

    try:
        city = request.args.get('city')
        state = request.args.get('state')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        city, state = RequestValidator.validate_filter_params(city, state)
        
        stats = DiagnosticsService.get_statistics(
            city=city,
            state=state,
            start_date=start_date,
            end_date=end_date
        )
        
        return {
            'data': stats,
            'filters': {
                'city': city,
                'state': state
            }
        }, 200
    
    except ValidationError as e:
        return {'error': str(e)}, 400

    except Exception as e:
        current_app.logger.error(f'Erro ao buscar estatísticas: {str(e)}')
        return {'error': 'Erro interno do servidor'}, 500
