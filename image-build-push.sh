#!/usr/bin/env bash
# Build and Publish
pbf src/proto/getInvestmentsResponse.proto  >src/proto/getInvestmentsResponse.js
pbf src/proto/getInvestmentsRorMetricsResponse.proto  >src/proto/getInvestmentsRorMetricsResponse.js
pbf src/proto/getRawInvestmentsResponse.proto  >src/proto/getRawInvestmentsResponse.js

VERSION=1.4.0
docker build -t alokkusingh/home-dashboard:latest -t alokkusingh/home-dashboard:${VERSION} .
docker push alokkusingh/home-dashboard:latest
docker push alokkusingh/home-dashboard:${VERSION}