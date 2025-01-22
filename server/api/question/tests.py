from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Question, Category


class QuestionCategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='testpass', is_staff=True)
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(
            genre='Science', info='Science related questions')
        self.question = Question.objects.create(
            name='What is the boiling point of water?',
            question_text='At what temperature does water boil?',
            answer=[1],
            answer_text='Water boils at 100 degrees Celsius.',
            is_comp=False,
            diff_level=1
        )
        self.question.categories.add(self.category)

    def test_create_category(self):
        response = self.client.post('/api/questions/categories/', {
            'genre': 'Math',
            'info': 'Math related questions'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)

    def test_multiple_categories(self):
        response = self.client.post('/api/questions/categories/', {
            'genre': 'Math',
            'info': 'Math related questions'
        })
        response = self.client.post('/api/questions/categories/', {
            'genre': 'History',
            'info': 'History related questions'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 3)

    def test_genre_name_unique(self):
        response = self.client.post('/api/questions/categories/', {
            'genre': 'Science',
            'info': 'Science related questions'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Category.objects.count(), 1)

    def test_question_integrity(self):
        response = self.client.post('/api/questions/question-bank/', {
            'name': 'What is the boiling point of water?',
            'question_text': 'At what temperature does water boil?',
            'answer': [1],
            'answer_text': 'Water boils at 100 degrees Celsius.',
            'is_comp': False,
            'diff_level': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Question.objects.count(), 1)

    def test_question_must_have_answer(self):
        response = self.client.post('/api/questions/question-bank/', {
            'name': 'What is the boiling point of water?',
            'question_text': 'At what temperature does water boil?',
            'answer_text': 'Water boils at 100 degrees Celsius.',
            'is_comp': False,
            'diff_level': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Question.objects.count(), 1)

    def test_question_must_have_diff_level(self):
        response = self.client.post('/api/questions/question-bank/', {
            'name': 'What is the boiling point of water?',
            'question_text': 'At what temperature does water boil?',
            'answer': [1],
            'answer_text': 'Water boils at 100 degrees Celsius.',
            'is_comp': False,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Question.objects.count(), 1)

    def test_question_can_only_have_one_answer(self):
        response = self.client.post('/api/questions/question-bank/', {
            'name': 'What is the boiling point of water2?',
            'question_text': 'At what temperature does water boil?',
            'answer': [1, 2],
            'answer_text': 'Water boils at 100 degrees Celsius.',
            'is_comp': False,
            'diff_level': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Question.objects.count(), 2)
