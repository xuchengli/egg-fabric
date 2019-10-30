#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

DIR=$(cd $(dirname $0) && pwd)
COMPOSEFILE="${DIR}/docker-compose.yml"

docker-compose -f "${COMPOSEFILE}" down

docker-compose -f "${COMPOSEFILE}" up -d
docker ps -a
