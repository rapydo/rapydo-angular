# -*- coding: utf-8 -*-

""" Main routes """

from __future__ import absolute_import
import os
import re
from urllib.parse import urlparse
from pathlib import Path
from flask import Blueprint, render_template, request
from config import user_config, CURRENT_FRAMEWORK, BACKEND_PUBLIC_PORT
from commons.logs import get_logger

logger = get_logger(__name__)
CURRENT_BLUEPRINT = 'blueprint_example'

#######################################
# Blueprint for base pages, if any
cms = Blueprint('pages', __name__)

#######################################
# DEFAULTs and CUSTOMs from FRAMEWORK CONFIGURATION

# Framework system configuration
fconfig = user_config['frameworks']

# Static directories
staticdir = fconfig['staticdir'] + '/'
bowerdir = staticdir + fconfig['bowerdir'] + '/'

# Custom configurations
bwlibs = user_config.get('bower_components', {})
customcss = user_config.get('css', {})
if 'js' in user_config:
    customjs = user_config['js']
else:
    customjs = []

css = []
js = []
jfiles = []
skip_files = []

# Bower libs
for lib, files in fconfig['bower_components'].items():
    for file in files:
        filepath = os.path.join(bowerdir, lib, file)
        if file.endswith('css'):
            css.append(filepath)
        else:
            js.append(filepath)

# Custom bower libs
for lib, files in bwlibs.items():
    for file in files:
        filepath = os.path.join(bowerdir, lib, file)
        if file.endswith('css'):
            css.append(filepath)
        else:
            js.append(filepath)
for sjs in customjs:
    if 'http' not in sjs:
        sjs = os.path.join(staticdir, 'js', sjs)
    js.append(sjs)

# CSS files
for scss in fconfig['css']:
    css.append(staticdir + scss)
for scss in customcss:
    if 'http' not in scss:
        scss = os.path.join(staticdir, 'css', scss)
    css.append(scss)

    #######################################
# ## JS BLUEPRINTS

# Load only a specified angular blueprint
if 'blueprint' not in user_config:
    logger.critical("No blueprint found in user config!")
else:
    CURRENT_BLUEPRINT = user_config['blueprint']

logger.info("Adding JS blueprint '%s'" % CURRENT_BLUEPRINT)


prefix = __package__
# JS BLUEPRINT config
jfiles.append(Path(prefix + '/js/blueprint.js'))
# JS files in the root directory
app_path = os.path.join(prefix, staticdir, 'app')
custom_path = os.path.join(app_path, 'custom', CURRENT_BLUEPRINT)

# Save the right order:
# Main app angular js is right after bower libs
main_app = os.path.join(prefix, staticdir, 'app', 'commons', 'app.js')
custom_app = os.path.join(custom_path, 'app.js')

if os.path.isfile(custom_app):
    jfiles.append(custom_app)
    skip_files.append(main_app)
elif os.path.isfile(main_app):
    jfiles.append(main_app)

# jfiles.extend(Path(app_path).glob('*.js'))
# JS common files
common_path = os.path.join(app_path, 'commons')
jfiles.extend(Path(common_path).glob('*.js'))
# JS files only inside the blueprint subpath
jfiles.extend(Path(custom_path).glob('**/*.js'))

# Use all files found
for pathfile in jfiles:
    strfile = str(pathfile)
    if strfile in skip_files:
        continue
    jfile = strfile[len(prefix) + 1:]
    if jfile not in js:
        js.append(jfile)

#######################################
user_config['content'] = {
    'project': user_config['project']['title']
}
user_config['content']['stylesheets'] = css
user_config['content']['jsfiles'] = js


#######################################
def templating(page, framework=CURRENT_FRAMEWORK, **whatever):
    template_path = 'frameworks' + '/' + framework
    tmp = whatever.copy()
    tmp.update(user_config['content'])
    templ = template_path + '/' + page
    return render_template(templ, **tmp)


def jstemplate(title='App', mydomain='/'):
    """ If you decide a different domain, use slash as end path,
        e.g. /app/ """

    topbar_file = "topbar.html"
    template_dir = os.path.join(app_path, "templates")
    base_template_dir = os.path.join(
        template_dir, 'common')
    custom_template_dir = os.path.join(
        template_dir, 'custom', CURRENT_BLUEPRINT)

    if os.path.isfile(os.path.join(custom_template_dir, topbar_file)):
        topbar_template = "main.blueprintTemplateDir + '%s'" % topbar_file
    elif os.path.isfile(os.path.join(base_template_dir, topbar_file)):
        topbar_template = "main.templateDir + '%s'" % topbar_file
    else:
        logger.critical(
            "Unable to find any topbar defined in %s/%s"
            % (base_template_dir, topbar_file)
        )
# TO FIX: ng-include will work very wrong with empty variable
        topbar_template = ""

    return templating(
        'main.html',
        mydomain=mydomain,
        jstitle=title,
        topbar=topbar_template
    )


######################################################
# MAIN ROUTE: give angular the power

@cms.route('/', methods=["GET"])
@cms.route('/<path:mypath>', methods=["GET"])
def home(mypath=None):
    """
    The main and only real HTML route in this server.
    The only real purpose is to serve angular pages and routes.
    """
    logger.debug("Using angular route. PATH is '%s'" % mypath)
    return jstemplate()


################################################
# Create a configuration file for angular from python variables
@cms.route('/js/blueprint.js')
def jsblueprint():

    # Custom static welcome template
    js_template = 'null'
    key = 'angular_template'
    if key in user_config['content']:
        js_template = "'" + user_config['content'][key] + "'"
    backend_port = BACKEND_PUBLIC_PORT

    api_url = request.url_root
    if os.environ.get('APP_MODE', '') == 'production':
        parsed = urlparse(api_url)
        if parsed.port is not None and parsed.port == 443:
            backend_port = parsed.port
            removed_port = re.sub(r':[\d]+$', '', parsed.netloc)
            api_url = parsed._replace(
                scheme="https", netloc=removed_port
            ).geturl()

    load_timeout = \
        user_config \
        .get('variables', {}) \
        .get('js', {}) \
        .get('load_timeout', 500)

    variables = {
        'name': CURRENT_BLUEPRINT,
        'time': load_timeout,
        'api_url': api_url,
        'api_port': backend_port,
        'js_template': js_template
    }
    return render_template("blueprint.js", **variables)
