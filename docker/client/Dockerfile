FROM node:20-slim

# SET WORKING DIRECTORY
WORKDIR /app

# Copy runtime script & make it executable
COPY /docker/client/entrypoint.sh /entrypoint.sh

# Make the script executable
RUN chmod +x /entrypoint.sh

# Copy package.json and package-lock.json
COPY ./client/package.json ./client/package-lock.json ./

RUN npm install
# Copy Application code into a directory called `app`
COPY ./client ./

RUN npm run build

EXPOSE 3000