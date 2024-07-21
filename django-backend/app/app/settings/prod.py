from .base import *

DEBUG = 0

#TODO: replace your_domain.com with hosted url
ALLOWED_HOSTS = ['your_domain.com', 'localhost']

STATIC_ROOT = '/app/static/'
MEDIA_ROOT = '/app/media/'

# Security settings
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

#TODO: Make sure that user connects to nginx via https before hosting this
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

X_FRAME_OPTIONS = 'DENY'
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True



DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB_NAME'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
