# -*- coding: utf-8 -*-

# TODO: move into base dir

""" Models for the relational database """

from __future__ import absolute_import

# import datetime
from ..services.alchemy import db

# from ..logs import get_logger
# log = get_logger(__name__)


####################################
# Define multi-multi relation
roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)


####################################
# Define models
class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return "[db model: %s] %s" % (self.__class__.__name__, self.name)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True)
    name = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    email = db.Column(db.String(100), unique=True)
    authmethod = db.Column(db.String(20))
    password = db.Column(db.String(255))
    roles = db.relationship('Role', secondary=roles_users,
                            backref=db.backref('users', lazy='dynamic'))

    def __str__(self):
        return "[db model: %s] %s (%s)" % (
            self.__class__.__name__, self.email, self.roles)


class Token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True)
    token = db.Column(db.String(360), unique=True)
    creation = db.Column(db.DateTime)
    expiration = db.Column(db.DateTime)
    last_access = db.Column(db.DateTime)
    IP = db.Column(db.String(46))
    hostname = db.Column(db.String(256))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    emitted_for = db.relationship(
        'User', backref=db.backref('tokens', lazy='dynamic'))

    def __str__(self):
        return "[db model: %s] %s" % (self.__class__.__name__, self.token)


class ExternalAccounts(db.Model):
    username = db.Column(db.String(60), primary_key=True)
    token = db.Column(db.Text())
    token_expiration = db.Column(db.DateTime)
    email = db.Column(db.String(255))
    certificate_cn = db.Column(db.String(255))
    certificate_dn = db.Column(db.Text())
    proxyfile = db.Column(db.Text())
    description = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
# Note: for pre-production release
# we allow only one external account per local user
    main_user = db.relationship(
        'User', backref=db.backref('authorization', lazy='dynamic'))

    def __str__(self):
        return "[db model: %s] %s(%s):%s" % (
            self.__class__.__name__, self.username, self.email, self.user_id)
