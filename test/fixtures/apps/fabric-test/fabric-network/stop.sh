#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# Shut down the Docker containers that might be currently running.
DIR=$(cd $(dirname $0) && pwd)
COMPOSEFILE="${DIR}/docker-compose.yml"

docker-compose -f "${COMPOSEFILE}" down
