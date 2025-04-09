from django.urls import path
from review.views import review_repo

urlpatterns = [
    path("review_repo/", review_repo),
]