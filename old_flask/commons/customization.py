# -*- coding: utf-8 -*-

"""
Customization based on configuration 'blueprint' files
"""

from __future__ import absolute_import

import os
# from collections import OrderedDict
from . import PROJECT_CONF_FILE, CONFIG_PATH

# TO FIX: should be imported after reading logger level from conf
from .meta import Meta
from .formats.yaml import load_yaml_file

from .logs import get_logger
log = get_logger(__name__)


########################
# Customization on the table
########################

class Customizer(object):
    """
    Customize your BACKEND:
    Read all of available configurations and definitions.

    """

    def __init__(self, package, testing=False, production=False):

        # Input
        self._current_package = package
        self._testing = testing
        self._production = production

        # Some initialization
        self._endpoints = []
        self._definitions = {}
        self._configurations = {}
        self._query_params = {}
        self._schemas_map = {}
        self._meta = Meta()

        # Do things
        self.do_config()

        file = os.path.join("config", "frameworks.yaml")
        self._frameworks = load_yaml_file(file)

    def do_config(self):
        ##################
        # Reading configuration
        custom_config = load_yaml_file(PROJECT_CONF_FILE, path="/temporaryfix")

        # Read default configuration
        defaults = load_yaml_file("defaults", path=CONFIG_PATH)
        if len(defaults) < 0:
            raise ValueError("Missing defaults for server configuration!")

        # Mix default and custom configuration
        # We go deep into two levels down of dictionaries
        for key, elements in defaults.items():
            if key not in custom_config:
                custom_config[key] = {}
            for label, element in elements.items():
                if label not in custom_config[key]:
                    custom_config[key][label] = element

        # Save in memory all of the current configuration
        self._configurations = custom_config
