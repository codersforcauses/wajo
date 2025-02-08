from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Question, Category, Answer


class QuestionCategoryTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', password='testpass', is_staff=True)
        self.client.force_authenticate(user=self.user)
        self.category = Category.objects.create(
            genre='Science', info='Science related questions')
        self.question = Question.objects.create(
            name='sample question',
            question_text='At what temperature does water boil?',
            solution_text='Water boils at 100 degrees Celsius.',
            is_comp=False,
            diff_level=1
        )
        answer1 = Answer.objects.create(value=1, question=self.question)
        answer2 = Answer.objects.create(value=2, question=self.question)
        self.question.answers.set([answer1, answer2])
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
            'name': 'sample question',
            'question_text': 'At what temperature does water boil?',
            'answers': [1],
            'solution_text': 'Water boils at 100 degrees Celsius.',
            'is_comp': False,
            'diff_level': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Question.objects.count(), 1)

    def test_question_must_have_diff_level(self):
        response = self.client.post('/api/questions/question-bank/', {
            'name': 'What is the boiling point of water?',
            'question_text': 'At what temperature does water boil?',
            'answers': [1],
            'solution_text': 'Water boils at 100 degrees Celsius.',
            'is_comp': False,
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Question.objects.count(), 1)

    def test_question_can_have_multiple_answers(self):
        response = self.client.post('/api/questions/question-bank/', {
            'name': 'What is the boiling point of water?',
            'question_text': 'At what temperature does water boil?',
            'answers': [1, 2],
            'solution_text': 'Water boils at 100 degrees Celsius.',
            'is_comp': False,
            'diff_level': 1,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Check if the question has been created
        self.assertEqual(Question.objects.count(), 2)
