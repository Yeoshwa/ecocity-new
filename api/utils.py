from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        # Personnalise le message d'erreur
        detail = response.data.get('detail', None)
        if not detail and isinstance(response.data, dict):
            # Concatène tous les messages d'erreur
            detail = ' | '.join([f"{k}: {v}" for k, v in response.data.items()])
        custom_response = {
            'error': True,
            'status_code': response.status_code,
            'detail': detail or str(response.data)
        }
        return Response(custom_response, status=response.status_code)
    # Erreur non gérée par DRF
    return Response({'error': True, 'status_code': 500, 'detail': str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
