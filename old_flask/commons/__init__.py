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

# DEBUG = os.environ.get('API_DEBUG', default_debug)
DEBUG = os.environ.get('API_DEBUG', None)

PRODUCTION = False
if os.environ.get('APP_MODE', '') == 'production':
    PRODUCTION = True
