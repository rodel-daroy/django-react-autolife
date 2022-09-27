"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from rest_framework import serializers

from questionnaire.models import Question, Option


class OptionSerializer(serializers.ModelSerializer):
    """
    Answer of questions Serializers
    """

    class Meta:
        model = Option
        fields = ("id", "url", "text", )


class QuestionaireSerializer(serializers.ModelSerializer):
    """
    Questionaire serializers , model based
    """
    options = OptionSerializer(read_only=True, many=True)

    class Meta:
        model = Question
        fields = ("id", "question_text", "url", "options",)
