from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.units import cm
from io import BytesIO
from datetime import date
from activities.models import ActivityLog
from nutrition.models import NutritionLog
from bmi.models import BMIRecord
from goals.models import Goal

class DownloadReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
            rightMargin=2*cm, leftMargin=2*cm,
            topMargin=2*cm, bottomMargin=2*cm)

        styles = getSampleStyleSheet()
        green = colors.HexColor('#2d6a4f')
        light_green = colors.HexColor('#d8f3dc')

        title_style = ParagraphStyle('title',
            parent=styles['Title'],
            textColor=green, fontSize=22, spaceAfter=6)

        heading_style = ParagraphStyle('heading',
            parent=styles['Heading2'],
            textColor=green, fontSize=14, spaceAfter=4)

        body_style = ParagraphStyle('body',
            parent=styles['Normal'],
            fontSize=10, spaceAfter=4)

        elements = []

        # ── HEADER ──────────────────────────────────
        elements.append(Paragraph("FitTrack AI", title_style))
        elements.append(Paragraph("Personal Health & Fitness Progress Report", styles['Heading2']))
        elements.append(Paragraph(f"Generated for: <b>{user.username}</b>", body_style))
        elements.append(Paragraph(f"Date: <b>{date.today().strftime('%B %d, %Y')}</b>", body_style))
        elements.append(Spacer(1, 0.5*cm))

        # ── USER PROFILE ─────────────────────────────
        elements.append(Paragraph("User Profile", heading_style))
        profile_data = [
            ['Field', 'Value'],
            ['Username', user.username],
            ['Email', user.email or 'N/A'],
            ['Age', str(user.age or 'N/A')],
            ['Gender', str(user.gender or 'N/A').capitalize()],
            ['Weight', f"{user.weight} kg" if user.weight else 'N/A'],
            ['Height', f"{user.height} cm" if user.height else 'N/A'],
            ['Fitness Goal', str(user.fitness_goal or 'N/A').replace('_', ' ').title()],
        ]
        profile_table = Table(profile_data, colWidths=[6*cm, 10*cm])
        profile_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), green),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('BACKGROUND', (0,1), (-1,-1), light_green),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_green]),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#74c69d')),
            ('PADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(profile_table)
        elements.append(Spacer(1, 0.5*cm))

        # ── BMI HISTORY ──────────────────────────────
        elements.append(Paragraph("BMI History", heading_style))
        bmi_records = BMIRecord.objects.filter(user=user).order_by('-date')[:5]
        if bmi_records:
            bmi_data = [['Date', 'Weight (kg)', 'Height (cm)', 'BMI', 'Category']]
            for b in bmi_records:
                bmi_data.append([
                    str(b.date), str(b.weight), str(b.height),
                    str(b.bmi_value), b.category.capitalize()
                ])
            bmi_table = Table(bmi_data, colWidths=[3.5*cm, 3.5*cm, 3.5*cm, 3*cm, 3.5*cm])
            bmi_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), green),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,-1), 9),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_green]),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#74c69d')),
                ('PADDING', (0,0), (-1,-1), 7),
            ]))
            elements.append(bmi_table)
        else:
            elements.append(Paragraph("No BMI records found.", body_style))
        elements.append(Spacer(1, 0.5*cm))

        # ── ACTIVITY SUMMARY ─────────────────────────
        elements.append(Paragraph("Recent Activity Log", heading_style))
        activities = ActivityLog.objects.filter(user=user).order_by('-date')[:10]
        if activities:
            act_data = [['Date', 'Exercise', 'Duration (min)', 'Intensity', 'Calories Burned']]
            total_calories = 0
            for a in activities:
                act_data.append([
                    str(a.date), a.exercise_type.capitalize(),
                    str(a.duration), a.intensity.capitalize(),
                    f"{round(a.calories_burned or 0)} kcal"
                ])
                total_calories += a.calories_burned or 0
            act_data.append(['', '', '', 'TOTAL BURNED', f"{round(total_calories)} kcal"])
            act_table = Table(act_data, colWidths=[3*cm, 4*cm, 3.5*cm, 3*cm, 3.5*cm])
            act_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), green),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
                ('BACKGROUND', (0,-1), (-1,-1), colors.HexColor('#b7e4c7')),
                ('FONTSIZE', (0,0), (-1,-1), 9),
                ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, light_green]),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#74c69d')),
                ('PADDING', (0,0), (-1,-1), 7),
            ]))
            elements.append(act_table)
        else:
            elements.append(Paragraph("No activity records found.", body_style))
        elements.append(Spacer(1, 0.5*cm))

        # ── NUTRITION SUMMARY ────────────────────────
        elements.append(Paragraph("Recent Nutrition Log", heading_style))
        nutrition = NutritionLog.objects.filter(user=user).order_by('-date')[:8]
        if nutrition:
            nut_data = [['Date', 'Food Item', 'Meal', 'Calories', 'Protein (g)', 'Carbs (g)']]
            for n in nutrition:
                nut_data.append([
                    str(n.date), n.food_item[:20],
                    n.meal_type.capitalize(),
                    f"{round(n.calories)} kcal",
                    str(round(n.protein)),
                    str(round(n.carbohydrates))
                ])
            nut_table = Table(nut_data, colWidths=[3*cm, 4.5*cm, 2.5*cm, 2.5*cm, 2.5*cm, 2.5*cm])
            nut_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), green),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,-1), 9),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_green]),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#74c69d')),
                ('PADDING', (0,0), (-1,-1), 7),
            ]))
            elements.append(nut_table)
        else:
            elements.append(Paragraph("No nutrition records found.", body_style))
        elements.append(Spacer(1, 0.5*cm))

        # ── GOALS ────────────────────────────────────
        elements.append(Paragraph("My Goals", heading_style))
        goals = Goal.objects.filter(user=user)
        if goals:
            goal_data = [['Goal Type', 'Target Value', 'Deadline', 'Status']]
            for g in goals:
                goal_data.append([
                    g.goal_type.replace('_', ' ').title(),
                    str(g.target_value),
                    str(g.deadline) if g.deadline else 'No deadline',
                    '✓ Achieved' if g.achieved else 'In Progress'
                ])
            goal_table = Table(goal_data, colWidths=[4.5*cm, 3.5*cm, 4*cm, 5*cm])
            goal_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), green),
                ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
                ('FONTSIZE', (0,0), (-1,-1), 9),
                ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_green]),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#74c69d')),
                ('PADDING', (0,0), (-1,-1), 7),
            ]))
            elements.append(goal_table)
        else:
            elements.append(Paragraph("No goals set yet.", body_style))

        elements.append(Spacer(1, 1*cm))
        elements.append(Paragraph(
            "This report was generated by FitTrack AI — AI-Based Health and Fitness Tracking System",
            ParagraphStyle('footer', parent=styles['Normal'],
                fontSize=8, textColor=colors.grey, alignment=1)
        ))

        doc.build(elements)
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="FitTrack_Report_{user.username}_{date.today()}.pdf"'
        return response