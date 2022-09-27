"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from rest_framework import routers

from questionnaire import views

router = routers.DefaultRouter()
router.register(r'question', views.QuestionnaireViewSet)
router.register(r'options', views.AnswerViewSet)