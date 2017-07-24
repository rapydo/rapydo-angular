# -*- coding: utf-8 -*-

"""

This class should help creating Farm of any database/service instance
to be used inside a Flask server.

The idea is to have the connection check when the Farm class is instanciated.
Then the object would remain available inside the server global namespace
to let the user access a new connection.

"""

from __future__ import absolute_import
import abc
import time
from ..meta import Meta

from ..logs import get_logger

log = get_logger(__name__)

BASE_MODELS_PATH = 'commons.models.'


def get_instance_from_services(services, service_name='relational', **kwargs):
    """
    Recover an instance among many services factory
    """
    obj = services.get(service_name, None)
    if obj is None:
        raise AttributeError(
            "Global API services: '%s' not found!" % service_name)

    ####################
    # Build the object & get the Instance

    # TO FIX: this decision should be made with a parameter for this function

    # # OPTION 1: If we want to use a new instance every time
    # return obj().get_instance(**kwargs)

    # OPTION 2: If we want a global connection pool for database instances
    return obj.get_instance(**kwargs)


class ServiceObject(object):
    """
    Basic object for a service
    """

    def inject_models(self, models=None):
        """ Load models mapping entities """

        if models is None:
            models = self._models

        for model in models:
            # Save attribute inside class with the same name
            log.verbose("Injecting model '%s'" % model.__name__)
            setattr(self, model.__name__, model)


class ServiceFarm(metaclass=abc.ABCMeta):

    """
    basic farm for any service in our framework
    """

    _meta = Meta()
    _service_name = None
    _models = {}
    _models_module = None

    def __init__(self, check_connection=False, app=None):

        self._service_name = self.define_service_name()

        if not check_connection:
            return

        name = self.__class__.__name__
        testdb = True
        counter = 0
        sleep_time = 1

        while testdb:
            try:
                obj = self.init_connection(app)
                del obj
                testdb = False
                log.info("Instance of '%s' was connected" % name)
            except AttributeError as e:
                # Give the developer a way to stop this cycle if critical
                log.critical("An attribute error:\n%s" % e)
                raise e
            except Exception as e:
                counter += 1
                if counter % 5 == 0:
                    sleep_time += sleep_time * 2
                log.warning("%s: Not reachable yet. Sleeping %s."
                            % (name, sleep_time))
                log.critical("Error was %s" % str(e))
                time.sleep(sleep_time)

    @classmethod
    def load_generic_models(cls, module_path):
        module = cls._meta.get_module_from_string(module_path)
        models = cls._meta.get_new_classes_from_module(module)
        # Keep tracking from where we loaded models
        # This may help with some service (e.g. sqlalchemy)
        cls._models_module = module_path
        return models

    @classmethod
    def load_base_models(cls):
        module_path = BASE_MODELS_PATH + cls.define_service_name()
        log.debug("Loading base models")
        return cls.load_generic_models(module_path)

    @classmethod
    def load_custom_models(cls):
        module_path = BASE_MODELS_PATH + 'custom.' + cls.define_service_name()
        log.debug("Loading custom models")
        return cls.load_generic_models(module_path)

    @classmethod
    def load_models(cls):
        """
        Algorithm to define basic models for authorization/authentication
        and optionally let users add custom models or override existing ones.

        Important:
        This is not going to be used by the abstract class.
        The user MUST define where to load it!
        """

        # Load base models
        base_models = cls.load_base_models()
        # Load custom models, if the file exists
        custom_models = cls.load_custom_models()

        # Join models as described by issue #16
        cls._models = base_models
        for key, model in custom_models.items():
            # Verify if overriding
            if key in base_models.keys():
                original_model = base_models[key]
                # Override
                if issubclass(model, original_model):
                    log.debug("Overriding model %s" % key)
                    cls._models[key] = model
                    continue
            # Otherwise just append
            cls._models[key] = model

        log.debug("Loaded service models")
        return cls._models

    @staticmethod
    @abc.abstractmethod
    def define_service_name():
        """
        Please define a name for the current implementation
        """
        return

    @abc.abstractmethod
    def init_connection(self, app):
        return

    @classmethod
    @abc.abstractmethod
    def get_instance(cls, *args):
        return
