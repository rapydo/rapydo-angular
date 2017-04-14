# -*- coding: utf-8 -*-

from __future__ import division

import os
import json
import pkg_resources

#######################
try:
    __version__ = pkg_resources.get_distribution(__name__).version
except BaseException:
    __version__ = 'unknown'

#######################
# Look for the best chance for json lib

# import json as original_json
# try:
#     import simplejson as json
#     # import commentjson as json
# except:
#     import json
# JSON_EXT = 'json'

#######################
# Make a json and yaml test
json.dumps({})

#######################
# authors and license
myself = "Paolo D'Onorio De Meo <p.donoriodemeo@gmail.com>"
lic = "MIT"

#######################
PROJECT_DIR = __package__
CONFIG_DIR = 'confs'
LOGGING_CONFIG_FILE = 'logging_config.ini'
LOG_CONFIG = os.path.join(PROJECT_DIR, CONFIG_DIR, LOGGING_CONFIG_FILE)

AVOID_COLORS_ENV_LABEL = 'TESTING_FLASK'

#################################
# ENDPOINTS bases
BACKEND_PACKAGE = 'rapydo'
API_URL = '/api'
AUTH_URL = '/auth'
STATIC_URL = '/static'
BASE_URLS = [API_URL, AUTH_URL]

#################################
# Directories for core code or user custom code
CORE_DIR = 'base'
USER_CUSTOM_DIR = 'custom'

PATH = ""
CONFIG_PATH = ""
PROJECT_CONF_FILE = 'project_configuration'
# BLUEPRINT_KEY = 'blueprint'

# Main directory where all conf files are found
CONFIG_PATH = 'config'
PATH = 'specs'

# NOTE: this decides about final configuration
DEBUG = True

########################################

# backend_linked = 'BACKEND_1_PORT' in os.environ

# if backend_linked:
#     # DIRECT ACCESS TO BACKEND
#     BACKEND_PUBLIC_PORT = 8081
# else:
#     # ACCESS VIA PROXY
#     # NOTE: IF SSL is ENABLED this port will be changed to 443 in pages.py
#     BACKEND_PUBLIC_PORT = 80

# # TO BE USED TO REDIRECT AUTHENTICATION FROM FRONTEND TO BACKEND
# BACKEND_PRIVATE_PORT = \
#     os.environ.get('BACKEND_1_PORT', "8080").split(':').pop()

#################################
# THE APP

# DEBUG = os.environ.get('API_DEBUG', default_debug)
DEBUG = os.environ.get('API_DEBUG', None)

PRODUCTION = False
if os.environ.get('APP_MODE', '') == 'production':
    PRODUCTION = True


########################################
# def get_api_url():
#     """ Get api URL and PORT

#     Usefull to handle https and similar
#     unfiltering what is changed from nginx and container network configuration

#     Warning: it works only if called inside a Flask endpoint
#     """

#     import re
#     from flask import request
#     from urllib.parse import urlparse

#     backend_port = BACKEND_PUBLIC_PORT
#     api_url = request.url_root

#     if PRODUCTION:
#         parsed = urlparse(api_url)
#         if parsed.port is not None and parsed.port == 443:
#             backend_port = parsed.port
#             removed_port = re.sub(r':[\d]+$', '', parsed.netloc)
#             api_url = parsed._replace(
#                 scheme="https", netloc=removed_port
#             ).geturl()

#     return api_url, backend_port
