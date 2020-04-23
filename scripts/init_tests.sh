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

BRANCH=$([  -z "$TRAVIS_PULL_REQUEST_BRANCH" ] && echo "$TRAVIS_BRANCH" || echo "$TRAVIS_PULL_REQUEST_BRANCH")

git clone -b ${BRANCH} --depth=1 https://github.com/rapydo/tests.git $CORE_DIR

cd $CORE_DIR

# Pull requests
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then

    echo "pulling $TRAVIS_BRANCH"
    git pull origin $TRAVIS_BRANCH

fi
