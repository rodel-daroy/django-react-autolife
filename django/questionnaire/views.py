from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
from rest_framework import viewsets
from rest_framework.views import APIView

from library.al_lib import ALResponse
from questionnaire.models import Option, Question
from questionnaire.serializers import QuestionaireSerializer, OptionSerializer
from questionnaire.utilities.q_a_utils import NextQuestion


class QuestionnaireViewSet(viewsets.ModelViewSet):
	"""
	Questions for user will be provided through the API
	"""
	authentication_classes = ()
	permission_classes = ()
	queryset = Question.objects.all().order_by('-created_on')
	serializer_class = QuestionaireSerializer
	http_method_names = ['get', 'post', 'put']


class AnswerViewSet(viewsets.ModelViewSet):
	"""
	Answers of the API will be provided through this API
	"""
	authentication_classes = ()
	permission_classes = ()
	queryset = Option.objects.all().order_by('-id')
	serializer_class = OptionSerializer
	http_method_names = ['get']


class SoftRegistration(APIView):
	"""
	Questions on the basis of request
	"""
	authentication_classes = ()
	permission_classes = ()

	def post(self, request):
		next_question = NextQuestion(
			option_id=request.data.get("option_id", None),
			question_id=request.data.get("question_id", None)
		)
		if next_question:
			return ALResponse(data=next_question, status=200).success()
		else:
			return ALResponse(message="Not Found", status=404).server_error()
