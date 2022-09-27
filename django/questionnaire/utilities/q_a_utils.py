"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.core.exceptions import ObjectDoesNotExist

from questionnaire.models import Question


class QuestionTree(object):
	"""
	The Question and Answer Tree
	"""
	def __init__(self):
		pass

	def add(self):
		pass

	def remove(self):
		pass

	def tags(self):
		pass


class NextQuestion(object):
	"""
	Next Question according to object
	"""
	def __new__(cls, option_id=None, question_id=None, *args, **kwargs):
		try:
			# Find the first question
			if not(option_id or question_id):
				question = Question.objects.get(is_first_question=True)     # If request has none
			elif option_id and question_id:
				question = None             # In case request came up with invalid case where option and question both exists
			elif option_id:     # If request contains parent_option Id
				question = Question.objects.filter(parent_option=option_id)
			elif question_id:   # If request contains next_question Id
				question = Question.objects.get(id=int(question_id))
			else:
				question = None  # If any case doesn't work (Rare Case)
			return question if not question else question.to_json
		except ObjectDoesNotExist as e:
			return False



