# Create your tests here.
from django.urls import reverse
from rest_framework.test import APITestCase

from questionnaire.models import Question, Option

class QuestionnaireViewSet(APITestCase):
    url = reverse("questionnaire:next_question")

    def set_up(self):
        obj_options = Option.objects.create(text="Audi", image="Audi_pic")
        obj = Question.objects.create(question_text="Howz ur experience?", question_type="Image")
        obj.options.add(obj_options)

    def test_soft_registration(self):
        response = self.client.post(self.url)
        print(response.data["status"])
        print("Testcase 1 - Test with soft registration\n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data["message"])
        self.assertEqual(200, response.status_code)



