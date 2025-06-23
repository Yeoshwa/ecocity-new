from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile, Report, Comment, Event, Gallery

class UserProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.profile = UserProfile.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_own_profile(self):
        url = reverse('userprofile-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['user'], self.user.id)

    def test_update_own_profile(self):
        url = reverse('userprofile-detail', args=[self.profile.id])
        response = self.client.patch(url, {'points': 50})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['points'], 50)

class ReportTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='reporter', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_report(self):
        url = reverse('report-list')
        data = {
            'latitude': 1.23,
            'longitude': 2.34,
            'description': 'Test report',
            'categorie': 'poubelle',
            'statut': 'signale',
            'gravite': 1
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['description'], 'Test report')

    def test_list_own_reports(self):
        Report.objects.create(user=self.user, latitude=1, longitude=2, description='R1', categorie='poubelle', statut='signale', gravite=1)
        url = reverse('report-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class CommentTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='commenter', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.report = Report.objects.create(user=self.user, latitude=1, longitude=2, description='R1', categorie='poubelle', statut='signale', gravite=1)

    def test_create_comment(self):
        url = reverse('comment-list')
        data = {'report': self.report.id, 'content': 'Test comment'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'Test comment')

    def test_list_own_comments(self):
        Comment.objects.create(user=self.user, report=self.report, content='C1')
        url = reverse('comment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class GalleryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='galleryuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.report = Report.objects.create(user=self.user, latitude=1, longitude=2, description='R1', categorie='poubelle', statut='signale', gravite=1)

    def test_create_gallery(self):
        url = reverse('gallery-list')
        with open('test_before.jpg', 'wb') as f:
            f.write(b'\x00')
        with open('test_after.jpg', 'wb') as f:
            f.write(b'\x00')
        with open('test_before.jpg', 'rb') as before, open('test_after.jpg', 'rb') as after:
            data = {'report': self.report.id, 'before_image': before, 'after_image': after}
            response = self.client.post(url, data, format='multipart')
            self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])

    def tearDown(self):
        import os
        if os.path.exists('test_before.jpg'):
            os.remove('test_before.jpg')
        if os.path.exists('test_after.jpg'):
            os.remove('test_after.jpg')

class AuthTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_fail_existing_username(self):
        url = reverse('register')
        User.objects.create_user(username='dupuser', password='testpass')
        data = {'username': 'dupuser', 'phone': '0600000000', 'password': 'testpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('username', response.data)

    def test_register_fail_existing_phone(self):
        url = reverse('register')
        user = User.objects.create_user(username='user2', password='testpass')
        UserProfile.objects.create(user=user, phone='0600000001')
        data = {'username': 'user3', 'phone': '0600000001', 'password': 'testpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('phone', response.data)

    def test_login_fail_wrong_password(self):
        url = reverse('token_obtain_pair')
        user = User.objects.create_user(username='user4', password='goodpass')
        UserProfile.objects.create(user=user, phone='0600000002')
        data = {'phone': '0600000002', 'password': 'badpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('non_field_errors', response.data)

    def test_login_fail_inactive_user(self):
        url = reverse('token_obtain_pair')
        user = User.objects.create_user(username='user5', password='goodpass', is_active=False)
        UserProfile.objects.create(user=user, phone='0600000003')
        data = {'phone': '0600000003', 'password': 'goodpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 400)
        self.assertIn('non_field_errors', response.data)
