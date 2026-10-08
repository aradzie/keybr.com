# syntax=docker/dockerfile:1
FROM node:26

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the repository files into the container
COPY . .

# Install dependencies
RUN npm ci

# Create Git metadata required by Lage during compilation
RUN git init && \
    git add -A && \
    git -c user.name="Docker Build" -c user.email="docker@localhost" commit -m "Docker build"

# Compile monorepo and build bundle
RUN npm run compile && npm run build

# Expose the application's default port
EXPOSE 3000

CMD ["npm", "run", "start-docker"]
