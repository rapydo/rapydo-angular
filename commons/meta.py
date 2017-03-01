# -*- coding: utf-8 -*-

"""
Meta thinking: python objects & introspection

usefull documentation:
http://python-3-patterns-idioms-test.readthedocs.org/en/latest/Metaprogramming.html
"""

from importlib import import_module
import pkgutil
import inspect
from .logs import get_logger

log = get_logger(__name__)


################################
# Utilities
class Meta(object):
    """Utilities with meta in mind"""

    _latest_list = {}
    _submodules = []

    def get_latest_classes(self):
        return self._latest_list

    def set_latest_classes(self, classes):
        self._latest_list = classes

    def get_submodules_from_package(self, package):
        self._submodules = []
        for importer, modname, ispkg \
                in pkgutil.iter_modules(package.__path__):
            if not ispkg:
                self._submodules.append(modname)
                log.debug("Found %s submodule inside %s" %
                             (modname, package.__name__))
        return self._submodules

    def get_classes_from_module(self, module):
        """
        Find classes inside a python module file.

        Note: this method returns a dict.
        """

        classes = {}
        try:
            classes = dict([(name, cls)
                           for name, cls in module.__dict__.items()
                           if isinstance(cls, type)])
        except AttributeError:
            log.warning("Could not find any class inside your module")

        self.set_latest_classes(classes)
        return self.get_latest_classes()

    def get_new_classes_from_module(self, module):
        """
        Skip classes not originated inside the module.

        Note: this method returns a list.
        """

        classes = {}
        for key, value in self.get_classes_from_module(module).items():
            if module.__name__ in value.__module__:
                classes[key] = value
        self.set_latest_classes(classes)
        return self.get_latest_classes()

    def get_module_from_string(self, modulestring):
        """
        Getting a module import
        when your module is stored as a string in a variable
        """

        module = None
        try:
            # Meta language for dinamically import
            module = import_module(modulestring)
        except ImportError as e:
            log.critical("Failed to load resource: " + str(e))
        return module

    def import_submodules_from_package(self, package_name):

        submodules = []
        package = self.get_module_from_string(package_name)

        for module_name in self.get_submodules_from_package(package):
            module_path = package_name + '.' + module_name
            log.debug("Loading module '%s'" % module_path)
            submodules.append(
                self.get_module_from_string(module_path))
        return submodules

    @staticmethod
    def get_methods_inside_instance(instance, private_methods=False):
        methods = {}
        all_methods = inspect.getmembers(instance, predicate=inspect.ismethod)
        for name, method in all_methods:
            if not private_methods and name[0] == '_':
                continue
            methods[name] = method
        return methods

    @staticmethod
    def get_class_from_string(classname, module):
        """ Get a specific class from a module using a string variable """

        myclass = None
        try:
            # Meta language for dinamically import
            myclass = getattr(module, classname)
        except AttributeError as e:
            log.critical("Failed to load resource: " + str(e))

        return myclass

    @staticmethod
    def metaclassing(your_class, label=None, attributes={}):
        """
        Creating a class using metas.
        Very usefull for automatic algorithms.
        """

        methods = dict(your_class.__dict__)
        for key, value in attributes.items():
            methods.update({key: value})
        return type(label, (your_class,), methods)

    @staticmethod
    def get_self_reference_from_args(*args):

        """
        Useful in decorators:
        being able to call the internal method by getting
        the 'self' reference from the decorated method
        (when it's there)
        """

        import inspect
        if len(args) > 0:
            candidate_as_self = args[0]
            cls_attribute = getattr(candidate_as_self, '__class__', None)
            if cls_attribute is not None and inspect.isclass(cls_attribute):
                return args[0]
        return None


######################################################
# ## INTERESTING EXAMPLE OF CREATING META CLASSES ## #

# # Name for the class. Remove path and extension (json)
# label = os.path.splitext(
#     os.path.basename(fileschema))[0].lower()
# # Dynamic attributes
# new_attributes = {
#     "schema": reference_schema,
#     "template": mytemplate,
#     "table": label,
# }
# # Generating the new class
# resource_class = RethinkResource
# if secured:
#     resource_class = RethinkSecuredResource
# newclass = Meta.metaclassing(resource_class, label, new_attributes)
# # Using the same structure i previously used in resources:
# # resources[name] = (new_class, data_model.table)
# json_autoresources[label] = (newclass, label)

######################################################
