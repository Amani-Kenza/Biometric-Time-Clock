#Define nodejs version
FROM node:18
#Define work directory
WORKDIR /app
#COPY all files
COPY . .
#Install Dependencies
RUN npm install 
#Define the PORT
EXPOSE  3000
#Start the application
CMD npm start