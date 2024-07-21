#!/bin/bash
 python manage.py collectstatic --noinput
 gunicorn app.wsgi:application --bind 0.0.0.0:8000 --workers $GUNICORN_WORKERS --log-level $GUNICORN_LOOGIN_LEVEL --worker-class gevent