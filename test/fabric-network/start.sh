#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

docker-compose -f docker-compose.yml down

docker-compose -f docker-compose.yml up -d
docker ps -a
