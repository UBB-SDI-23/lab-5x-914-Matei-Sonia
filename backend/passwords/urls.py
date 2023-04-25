from django.urls import path
from passwords import views
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    path('gt/<int:id>', views.greater_than),
    path('statistics-vault', views.OrderVaultsByPasswords.as_view(), name='statistics-vault'),
    path('statistics-password', views.OrderPasswordsByTags.as_view(), name='statistics-password'),

    path('vault', views.VaultList.as_view()),
    path('vault/<int:pk>', views.VaultDetails.as_view()),
    path('vault/<int:pk>/tags', views.MultipleTagsToVault.as_view()),

    path('tag', views.TagList.as_view()),
    path('tag/<int:pk>', views.TagDetails.as_view()),

    path('account', views.PasswordAccountList.as_view()),
    path('account/<int:pk>', views.PasswordAccountDetails.as_view()),

    path('classic', views.PasswordClassicList.as_view()),
    path('classic/<int:pk>', views.PasswordClassicDetails.as_view()),

    path('account/<int:pk>/tag', views.TagAccountPasswordList.as_view()),
    path('account/<int:pwd_id>/tag/<int:tag_id>', views.TagAccountPasswordDetails.as_view()),

    path('tag/<int:pk>/account', views.AccountPasswordTagList.as_view()),
    path('tag/<int:tag_id>/account/<int:pwd_id>', views.TagAccountPasswordDetails.as_view()),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path("vault/autocomplete/", views.VaultViewForAutocomplete.as_view()),
    path("tag/<int:pk>/autocomplete/", views.TagViewForAutocomplete.as_view()),
]
