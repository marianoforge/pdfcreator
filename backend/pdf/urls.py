from django.urls import path
from .views import GeneratePDFView, CheckDocumentStatusView, FormTemplatesView

urlpatterns = [
    path("pdf/", GeneratePDFView.as_view(), name="generate-pdf"),
    path("pdf/status/<str:document_id>/", CheckDocumentStatusView.as_view(), name="check-document-status"),
    path("templates/", FormTemplatesView.as_view(), name="form-templates")
]