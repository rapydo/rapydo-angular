#!/bin/bash
set -e

WORK_DIR=$(pwd)

export CURRENT_VERSION=$(grep '"version"' src/package.json | sed 's/"version": //' | tr -d '", ')

echo "Current project: $PROJECT"
echo "Current version: $CURRENT_VERSION"

pip3 install --upgrade git+https://github.com/rapydo/do.git@${CURRENT_VERSION}

#https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
	echo "Pull request from BRANCH ${TRAVIS_PULL_REQUEST_BRANCH} to ${TRAVIS_BRANCH}"
else
	echo "Current branch: $TRAVIS_BRANCH"
fi

CORE_DIR="${WORK_DIR}/rapydo_tests"

echo "WORK_DIR = ${WORK_DIR}"
echo "CORE_DIR = ${CORE_DIR}"

if [ ! -d $CORE_DIR ]; then
    git clone https://github.com/rapydo/tests.git $CORE_DIR
fi
cd $CORE_DIR
mkdir -p data

echo "project: ${PROJECT}" > .projectrc
echo "project_configuration:" >> .projectrc
echo "  variables:" >> .projectrc
echo "    env:" >> .projectrc
echo "      APP_MODE: test" >> .projectrc
# Defined in travis settings
# echo "      COVERALLS_REPO_TOKEN: ${COVERALLS_REPO_TOKEN}" >> .projectrc

# Pull requests
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
    echo "checkout $TRAVIS_PULL_REQUEST_BRANCH"
    git checkout $TRAVIS_PULL_REQUEST_BRANCH

    echo "pulling $TRAVIS_BRANCH"
    git pull origin $TRAVIS_BRANCH
# Normal commits
else

    echo "checkout $TRAVIS_BRANCH"
    git checkout $TRAVIS_BRANCH
fi

rapydo init

rapydo pull

rapydo dump

rapydo start
