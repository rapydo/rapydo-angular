# -*- coding: utf-8 -*-

""" Configurations """

import os
from commons.logs import get_logger
from commons.customization import Customizer
from commons import PRODUCTION

logger = get_logger(__name__)

###################################
DEBUG = True
PATH = 'specs'   # Main directory where all conf files are found

CONFIG_PATH = 'config'
# FRAMEWORKS = ['materialize', 'bootstrap', 'foundation']
CURRENT_FRAMEWORK = 'bootstrap'

# Initialize reading of all files
customizer = Customizer(__package__, False, PRODUCTION)
user_config = customizer._configurations
user_config['frameworks'] = customizer._frameworks

BACKEND_PUBLIC_PORT = os.environ.get('BACKEND_PORT', 80)


########################################
class BaseConfig(object):

    DEBUG = os.environ.get('APP_DEBUG', DEBUG)
    if DEBUG == 'false':
        DEBUG = False
    # LOG_DEBUG = True
    LOG_DEBUG = False
    TESTING = False
    MYCONFIG_PATH = os.path.join(CONFIG_PATH, PATH)
    BASE_DB_DIR = '/dbs'
    SQLLITE_DBFILE = 'frontend.db'
    dbfile = os.path.join(BASE_DB_DIR, SQLLITE_DBFILE)
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + dbfile
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = '/uploads'

    HOST = 'localhost'
    PORT = int(os.environ.get('PORT', 5000))
