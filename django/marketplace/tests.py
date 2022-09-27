import csv

from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APITestCase

from marketplace.views import CbbDropdownLists


class CbbDropDownApi(TestCase):
    url = reverse("marketplace:cbbdropdown")

    def setUp(self):
        self.myfile = open('marketplace/tests.csv', newline='')

    def test_invalid_data(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            response = self.client.get(self.url)
            print("Marketplace Testcase 1 - Test with passing no parameters \n", end='')
            print( "\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data["message"])
            self.assertEqual(200, response.data["status"])

    def test_years(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            years = {"year": record[0]}
            response = self.client.get(self.url, years)
            print("Marketplace Testcase 2 - Test with passing no parameters \n", end='')
            print( "\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data["message"])
            self.assertEqual(200, response.data["status"])

    def test_year_make(self):
        reader = csv.reader(self.myfile)
        for record in reader:
            year_make = {"year":record[0], "make":record[1]}
            response = self.client.get(self.url, year_make)
            print("Marketplace Testcase 3 - Test with passing no parameters \n", end='')
            print( "\t Parameters passed:\n", end='')
            print("\t \t Response:\t", end='')
            print(response.data["message"])
            self.assertEqual(200, response.data["status"])


class SponsorsListUnitTest(APITestCase):
    """
    Unit testing for sponsors list API
    """
    url = reverse("content management:sponsors list")

    def setUp(self):
        self.myfile = open('marketplace/sponsor.csv', newline='')

    def testcase_sponsor(self):
            reader = csv.reader(self.myfile)
            for record in reader:
                response = self.client.get(self.url)
                print("Sponsor Testcase  \n", end='')
                print("\t Parameters passed:\n", end='')
                print("\t \t Response:\t", end='')
                print(response.data)
                try:
                    self.assertEqual(200, response.data["status"])
                except:
                    self.assertNotEqual(response.content, '{}')