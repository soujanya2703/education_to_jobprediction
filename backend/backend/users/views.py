from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile, PredictionHistory
from .serializers import (
    RegisterSerializer, UserSerializer, ProfileSerializer, 
    RegisterSerializer, UserSerializer, ProfileSerializer, 
    PredictionHistorySerializer
)
from .ml import CareerPredictor
from core.encryption import decrypt_data
import datetime

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        # Create profile if not exists
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

class DashboardView(generics.ListAPIView):
    serializer_class = PredictionHistorySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return PredictionHistory.objects.filter(user=self.request.user).order_by('-timestamp')

class GoogleLoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'No token provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Simulating finding/creating user from email
        email = request.data.get('email') 
        if not email:
            return Response({'error': 'Email required for placeholder auth'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user with this email already exists
        user = User.objects.filter(email=email).first()
        if user:
            # User exists, just log them in
            pass
        else:
            # User doesn't exist, create new one
            # Use email as username, but handle potential username collision if needed
            user = User.objects.create_user(username=email, email=email)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })

class PredictView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # 1. Get User Profile Data
        try:
            profile = request.user.profile
            academic_info = profile.academic_info
            
            # Decrypt if necessary
            if isinstance(academic_info, dict) and 'ciphertext' in academic_info:
                academic_info = decrypt_data(academic_info['ciphertext'])
                
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # 2. Extract features from request or profile
        # Allow overriding profile data with request data
        data = request.data.copy()
        
        # We need: Degree, Specialization, College_Name, CGPA, Certificates, Graduation_Year
        # Try to pull from academic_info first
        edu_list = academic_info.get('education', [])
        latest_edu = edu_list[0] if edu_list else {}
        
        degree = data.get('degree') or latest_edu.get('degree')
        specialization = data.get('specialization') or latest_edu.get('specialization')
        college_name = data.get('institution') or latest_edu.get('institution')
        cgpa = data.get('cgpa') or latest_edu.get('cgpa') or data.get('gpa') or academic_info.get('gpa')
        year = data.get('year') or latest_edu.get('year')
        
        # Certificates count
        certs_list = academic_info.get('certificates', [])
        certificates_count = len(certs_list)

        if not degree or not specialization:
             # Just a warning or fallback?
             pass

        # Prepare for ML model
        user_features = {
            'Degree': degree,
            'Specialization': specialization,
            'College_Name': college_name,
            'CGPA': cgpa,
            'Certificates': certificates_count,
            'Graduation_Year': year
        }

        # 3. Predict
        predictor = CareerPredictor()
        prediction = predictor.predict(user_features)

        # 4. Save to History
        history_entry = PredictionHistory.objects.create(
            user=request.user,
            prediction_data={
                'input': user_features,
                'result': prediction
            }
        )

        return Response({
            "prediction": prediction,
            "history_id": history_entry.id
        })
