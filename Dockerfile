FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the repository files into the container
COPY . .

# Install dependencies
RUN npm install

# Compile monorepo and build bundle
RUN npm run compile && npm run build

# Expose the application's default port
EXPOSE 3000

CMD ["npm", "run", "start-docker"]
