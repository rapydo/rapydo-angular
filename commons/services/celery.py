# -*- coding: utf-8 -*-

"""
Celery tasks
"""


import os
from commons.logs import get_logger
from celery import Celery

# TO FIX: since we are in commons and detect in restapi we cannot import here
# Please butta-al-secchio the frontend repository, remove the commos stuff and
# enable this import
# from ..services.detect import CELERY_AVAILABLE
# Porcat waiting for the fix above:
CELERY_AVAILABLE = 'QUEUE_NAME' in os.environ

log = get_logger(__name__)

if CELERY_AVAILABLE:
    HOST = os.environ.get('QUEUE_NAME').split('/')[::-1][0]
    PORT = int(os.environ.get('QUEUE_PORT').split(':')[::-1][0])

    if os.environ.get('RABBIT_1_NAME', None) is not None:

        # BROKER_URL = 'amqp://guest:guest@%s:%s/0' % (HOST, PORT)
        BROKER_URL = 'amqp://%s:%s' % (HOST, PORT)
        BROKER_URL = 'amqp://%s' % (HOST)
        BACKEND_URL = 'rpc://%s:%s/0' % (HOST, PORT)
        log.info("Found RabbitMQ as Celery broker %s" % BROKER_URL)
    else:
        BROKER_URL = 'redis://%s:%s/0' % (HOST, PORT)
        BACKEND_URL = 'redis://%s:%s/0' % (HOST, PORT)
        log.info("Found Redis as Celery broker %s" % BROKER_URL)

    celery_app = Celery(
        'RestApiQueue',
        backend=BACKEND_URL,
        broker=BROKER_URL,
    )

    # Skip initial warnings, avoiding pickle format (deprecated)
    celery_app.conf.CELERY_ACCEPT_CONTENT = ['json']
    celery_app.conf.CELERY_TASK_SERIALIZER = 'json'
    celery_app.conf.CELERY_RESULT_SERIALIZER = 'json'
