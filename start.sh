#!/bin/bash

PORT=3000
IMAGE_NAME="integra-cefet-app"
CONTAINER_NAME="integra-cefet-container"

echo "building Docker image..."
docker build -t $IMAGE_NAME .

if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "🧹 Removing old container..."
  docker rm -f $CONTAINER_NAME
fi

echo "starting container..."
docker run -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME

echo "application is running at: http://localhost:$PORT"
