@echo off
set PORT=3000
set IMAGE_NAME="integra-cefet-app"
set CONTAINER_NAME="integra-cefet-container"

echo building Docker image...
docker build -t %IMAGE_NAME% .

REM check if the container exists and remove it
FOR /f %%i IN ('docker ps -aq -f name=%CONTAINER_NAME%') DO (
    echo removing old container...
    docker rm -f %CONTAINER_NAME%
)

echo starting container...
docker run -d --name %CONTAINER_NAME% -p %PORT%:3000 %IMAGE_NAME%

echo application is running at: http://localhost:%PORT%
pause
