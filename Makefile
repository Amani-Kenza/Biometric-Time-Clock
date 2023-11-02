#Build an Image with v1 TAG
build:
docker build . -t myappimage:v1
#Run the image as a container
run:
docker run -dp 8080:80 myappimage:v1
#Ping the appliction
curl:
curl localhost:3000
#Stop the cntainer following by container id
stop:
docker stop $(docker ps -q)
#Remove docker container
rm:
docker rm container-name

