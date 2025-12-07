from typing import Tuple, Optional


class ValidationError(Exception):
    """Exceção customizada para erros de validação"""
    pass


class RequestValidator:
    """Validador de parâmetros de requisição"""
    
    @staticmethod
    def validate_pagination_params(page: int, limit: int) -> Tuple[int, int]:
        """
        Valida parâmetros de paginação
        
        Args:
            page: Número da página
            limit: Quantidade de itens por página
        """
        # Validar page
        if page < 1:
            raise ValidationError("O parâmetro 'page' deve ser maior ou igual a 1")
        
        if page > 10000:
            raise ValidationError("O parâmetro 'page' não pode ser maior que 10000")
        
        # Validar limit
        if limit < 1:
            raise ValidationError("O parâmetro 'limit' deve ser maior ou igual a 1")
        
        if limit > 100:
            raise ValidationError("O parâmetro 'limit' não pode ser maior que 100")
        
        return page, limit
    
    @staticmethod
    def validate_filter_params(city: Optional[str] = None, state: Optional[str] = None) -> Tuple[Optional[str], Optional[str]]:
        """
        Valida parâmetros de filtro
        
        Args:
            city: Filtro de cidade
            state: Filtro de estado
        """
        # Validar city
        if city is not None:
            city = city.strip()
            if len(city) > 100:
                raise ValidationError("O parâmetro 'city' não pode ter mais de 100 caracteres")
            if len(city) == 0:
                city = None
        
        # Validar state
        if state is not None:
            state = state.strip()
            if len(state) > 50:
                raise ValidationError("O parâmetro 'state' não pode ter mais de 50 caracteres")
            if len(state) == 0:
                state = None
        
        return city, state
    
    @staticmethod
    def validate_group_by(group_by: str) -> str:
        """
        Valida parâmetro de agrupamento
        
        Args:
            group_by: Critério de agrupamento
        """
        valid_options = ['day', 'city', 'state']
        
        if group_by not in valid_options:
            raise ValidationError(
                f"O parâmetro 'group_by' deve ser um dos seguintes: {', '.join(valid_options)}"
            )
        
        return group_by

