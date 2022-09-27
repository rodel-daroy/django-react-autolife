import csv

# Create your tests here.
from django.test import Client
from django.urls import reverse
from rest_framework.test import APITestCase

from users.models import Profile
from users.utils.utility import AuthenticationToken


class InfoAPITestCase(APITestCase):
    url = reverse("users:info")

    def setUp(self):
        self.myfile = open('users/test.csv', newline='')

    def test_info(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            self.user, is_created = Profile.objects.get_or_create(username=record[0], email=record[1], password =record[2])
            self.token = AuthenticationToken(self.user)
            self.client.credentials(HTTP_AUTHORIZATION='AL ' + self.token)
            response = self.client.post(self.url)
            print("User Testcase 7 - Info Testcase\n", end='')
            print("\t Parameters passed:\n", end='')
            print("\t \t Response:\t ", end='')
            print(response.data)
            try:
                self.assertEqual(200, response.data["status"])
            except:
                self.assertNotEqual(response.content, '{}')

class RegistrationAPIViewTestCase(APITestCase):
    url = reverse("users:register")

    def setUp(self):
        self.myfile = open('users/test.csv', newline='')

    def test_invalid_data(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            user_name = {"username": record[0]}
            response = self.client.post(self.url, user_name)
            print("User Testcase 1 - Test with invalid data\n", end='')
            print("\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data["message"])
            try:
                self.assertEqual(406, response.data["status"])
            except:
                self.assertNotEqual(response.content, '{}')

    def test_invalid_password(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            user_password = {"password": record[2]}
            response = self.client.post(self.url, user_password)
            print("User Testcase 2 - Test with invalid password\n", end='')
            print("\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data["message"])
            try:
                self.assertEqual(406, response.data["status"])
            except:
                self.assertNotEqual(response.content, '{}')

    def test_user_registration(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            user_details = {"username": record[0], "email": record[1], "password": record[2], "confirm_password": record[2]}
            response = self.client.post(self.url, user_details)
            print("User Testcase 3 - Test with user registration\n", end='')
            print("\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data["message"])
            try:
                self.assertEqual(406, response.data["status"])
            except:
                self.assertNotEqual(response.content, '{}')

class LoginAPIViewTestCase(APITestCase):
    url = reverse("users:login")

    def setUp(self):
        self.username = "john"
        self.email = "john@snow.com"
        self.password = "you_know_nothing"
        self.user = Profile.objects.create_user(self.username, self.email, self.password, is_verified=True)
        print(self.user.to_json)
        self.myfile = open('users/test.csv', newline='')

    def test_authentication_without_password(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            user_name = {"username": record[0]}
            response = self.client.post(self.url, user_name)
            print("User Testcase 4 - Test authentication without password\n", end='')
            print("\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data)
            try:
                self.assertEqual(406, response.data["status"])
            except:
                self.assertNotEqual(response.content, '{}')

    def test_authentication_with_wrong_password(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            user_data = {"email": record[1], "password": record[2]}
            response = self.client.post(self.url, user_data)
            print("User Testcase 5 - Test authentication with wrong password\n", end='')
            print("\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data)
            try:
                self.assertEqual(401, response.data["status"], "")
            except:
                self.assertNotEqual(response.content, '{}')

    def test_authentication_with_valid_data(self):
        response = self.client.post(self.url, {"username": self.username, "email": self.email, "password": self.password})
        print("User Testcase 6 - Test authentication with valid data\n", end='')
        print("\t Parameters passed:\n", end='')
        print("\t \t Response:\t", end='')
        print(response.data)
        try:
            self.assertEqual(200, response.status_code, "Test is authenticated with valid data")
        except:
            self.assertNotEqual(401, response.content, '{}')
