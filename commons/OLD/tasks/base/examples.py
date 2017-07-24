# -*- coding: utf-8 -*-

from __future__ import absolute_import

from flask import current_app
from ...services.celery import celery_app
from commons.logs import get_logger

log = get_logger(__name__)


####################
# Define your celery tasks

@celery_app.task
def foo():
    log.debug("Test debug")
    log.info("Test info")


@celery_app.task
def foo_in_context(arg):
    with current_app.app_context():
        log.debug("Test debug '%s'" % arg)
        log.info("Test info '%s'" % arg)
