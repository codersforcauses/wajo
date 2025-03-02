FROM node:20-slim as client-prod

# SET WORKING DIRECTORY
WORKDIR /app

# Copy runtime script & make it executable
COPY /docker/client/entrypoint.sh /entrypoint.sh

# Make the script executable
RUN chmod +x /entrypoint.sh

# Copy Application code into a directory called `app`
COPY ./client ./

# Install dependencies without dev dependencies
RUN npm install --production

RUN npm run build

EXPOSE 3000