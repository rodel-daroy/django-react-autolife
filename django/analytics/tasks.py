from __future__ import absolute_import

from time import sleep

from celery import shared_task, task
from autolife.celery import app


@shared_task
def test(param):

    return 'The test task executed with argument "%s" ' % param


@app.task(name="run taskts")
def user_likes(param):
    sleep(10)
    return 'User Liked Something'
