from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import BMIRecord
from .serializers import BMIRecordSerializer

def calculate_bmi(weight, height_cm):
    height_m = height_cm / 100
    bmi = weight / (height_m ** 2)
    if bmi < 18.5:
        category = 'underweight'
    elif bmi < 25:
        category = 'normal'
    elif bmi < 30:
        category = 'overweight'
    else:
        category = 'obese'
    return round(bmi, 2), category

class BMICalculateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        weight = request.data.get('weight')
        height = request.data.get('height')
        if not weight or not height:
            return Response({'error': 'Weight and height are required'}, status=400)
        bmi_value, category = calculate_bmi(float(weight), float(height))
        record = BMIRecord.objects.create(
            user=request.user,
            weight=weight,
            height=height,
            bmi_value=bmi_value,
            category=category
        )
        return Response(BMIRecordSerializer(record).data)

class BMIHistoryView(generics.ListAPIView):
    serializer_class = BMIRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BMIRecord.objects.filter(
            user=self.request.user).order_by('-date')