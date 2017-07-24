# -*- coding: utf-8 -*-

"""
to write
"""

# from __future__ import absolute_import

# import traceback
from functools import wraps
# from commons.meta import Meta
from commons.logs import get_logger
# from flask_restful import reqparse

log = get_logger(__name__)


#################################
# TODO: make this terrible decorator disappear!
# (when completing the swagger integration)

def class_method_decorator_with_optional_parameters(f):
    """
    a decorator decorator, allowing the decorator to be used as:
    @decorator(with, arguments, and=kwargs)
    or
    @decorator
    BUT only for decorator of class methods

    Slight modifications to http://stackoverflow.com/a/14412901/2114395
    """
    @wraps(f)
    def new_dec(*args, **kwargs):
        """
        NOTE: in any case, args[0] is always the 'self' reference!
        """
        # print("DEBUG", args, kwargs)
        # log.debug("Wrapping a method decorator for double options")

        if len(args) == 2 and len(kwargs) == 0 and callable(args[1]):
            # actual decorated function
            # args[0] is self, args[1] is the function
            return f(args[0], args[1])
        elif 'from_swagger' in kwargs:
            # NOTE: the 'else' condition does not work
            # if applying the method programmatically in meta python
            return f(*args, **kwargs)
        else:
            # decorator with arguments
            # self, f, arguments
            return lambda realf: f(args[0], realf, **kwargs)

    return new_dec
