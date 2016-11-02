# -*- coding: utf-8 -*-

""" Configurations """

import os
import commentjson as json
from collections import OrderedDict
from commons.logs import get_logger

logger = get_logger(__name__)

#######################
# Warning: this decides about final configuration
DEBUG = True
PATH = 'specs'   # Main directory where all conf files are found
# Warning: this decides about final configuration
#######################

CONFIG_PATH = 'config'
JSON_EXT = 'json'
# FRAMEWORKS = ['materialize', 'bootstrap', 'foundation']
# CURRENT_FRAMEWORK = FRAMEWORKS.pop(0)
CURRENT_FRAMEWORK = 'bootstrap'


########################################
# Read user config
def get_json_conf(config_root, path, file):

# print error?
    filename = os.path.join(config_root, path, file + "." + JSON_EXT)
    logger.debug("Reading file %s" % filename)

    with open(filename) as f:
        return json.load(f, object_pairs_hook=OrderedDict)

    return None

##################
# # DEFAULT
# Add a value for all possibilities
defaults = get_json_conf('commons', 'confs', file='defaults')

##################
# # CUSTOM
tmp = get_json_conf(CONFIG_PATH, PATH, "blueprint")
blueprint = tmp['blueprint']

user_config = get_json_conf(CONFIG_PATH, PATH, blueprint)

user_config['blueprint'] = blueprint
user_config['frameworks'] = get_json_conf(CONFIG_PATH, "", "frameworks")

auth = user_config['variables']['containers']['authentication']


########################################
BACKEND_NAME = None
try:
    BACKEND_NAME = os.environ.get('MYAPI_NAME').split('/').pop()
except:
    logger.warning("Not linked to backend container")
    # raise BaseException("Fatal error: could not find a backend container.")

########################################
# BACKEND_PUBLIC_PORT = 80
# BACKEND_PRIVATE_PORT = 80

backend_linked = 'BACKEND_1_PORT' in os.environ

# TO BE USED FROM FRONTEND TO CALL APIs
# BACKEND_PUBLIC_PORT = \
    # os.environ.get('BACKEND_1_PORT', "80").split(':').pop()

if backend_linked:
    # DIRECT ACCESS TO BACKEND
    BACKEND_PUBLIC_PORT = 8081
else:
    # ACCESS VIA PROXY
    BACKEND_PUBLIC_PORT = 80

# TO BE USED TO REDIRECT AUTHENTICATION FROM FRONTEND TO BACKEND
BACKEND_PRIVATE_PORT = \
    os.environ.get('BACKEND_1_PORT', "8080").split(':').pop()

URL = 'http://%s:%s' % (BACKEND_NAME, BACKEND_PRIVATE_PORT)
API_URL = URL + '/api/'
AUTH_URL = URL + '/auth/'


########################################
class BaseConfig(object):

    DEBUG = os.environ.get('APP_DEBUG', DEBUG)
    # LOG_DEBUG = True
    LOG_DEBUG = False
    TESTING = False
    MYCONFIG_PATH = os.path.join(CONFIG_PATH, PATH)
    BASE_DB_DIR = '/dbs'
    SQLLITE_DBFILE = 'frontend.db'
    dbfile = os.path.join(BASE_DB_DIR, SQLLITE_DBFILE)
    SECRET_KEY = 'simplesecret'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + dbfile
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = '/uploads'

    HOST = 'localhost'
    PORT = int(os.environ.get('PORT', 5000))

    BASIC_USER = {
        'username': auth.get('username', 'prototype'),
        'password': auth.get('password', 'test'),
        'email': auth.get('email', 'idonotexist@test.com')
    }
