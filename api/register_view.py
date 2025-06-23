from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile

class RegisterView(APIView):
    def post(self, request):
        # Double sécurité : refuse si le numéro existe déjà
        phone = request.data.get('phone')
        if phone and UserProfile.objects.filter(phone=phone).exists():
            return Response({'phone': ['Ce numéro de téléphone est déjà utilisé.']}, status=status.HTTP_400_BAD_REQUEST)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Inscription réussie.',
                'user': {
                    'id': user.id,
                    'username': user.username
                },
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
