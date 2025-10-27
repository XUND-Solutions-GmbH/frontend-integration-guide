#!/bin/sh
set -e

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
CONTAINER_NAME=xund-demo-dotnet
IMAGE_NAME=xund/frontend-integration-dotnet:latest

docker build -t "$IMAGE_NAME" "$SCRIPT_DIR"

docker rm -f "$CONTAINER_NAME" 2>/dev/null || true

docker run --rm \
  -p 3000:8080 \
  --env-file "$SCRIPT_DIR/.env" \
  --name "$CONTAINER_NAME" \
  "$IMAGE_NAME"

