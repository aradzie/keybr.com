# KeyBr.com Docker Deployment Guide

This document provides instructions on how to deploy and manage the KeyBr.com application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Git repository cloned: `git clone https://github.com/aradzie/keybr.com.git`

## Configuration

1. Create a data directory to persist application data:
   ```bash
   mkdir -p /path/to/data_dir
   ```

2. Create an environment file in your data directory:
   ```bash
   touch /path/to/data_dir/.env
   ```

3. Edit the environment file with required configuration variables:
   ```
   # Database configuration
   DATABASE_URL=sqlite:/root/.local/state/keybr/keybr.db
   
   # Application settings
   NODE_ENV=production
   PORT=3000
   HOST=0.0.0.0
   APP_URL=http://localhost:3008/
   
   # Logging
   DEBUG=*
   
   # Admin access token for initial login
   ACCESS_TOKEN=initial_access_token
   ```

   **IMPORTANT:** The `APP_URL` setting is crucial for proper URL redirection. Make sure it matches the external URL you'll use to access the application.

4. Edit the `docker-compose.yaml` file and update the volume paths:
   ```yaml
   services:
     keybr:
       build:
         dockerfile: ./Dockerfile
       volumes:
         - /path/to/data_dir:/root/.local/state/keybr
         - /path/to/data_dir/.env:/etc/keybr/env
       ports:
         - 3008:3000
       restart: unless-stopped
       environment:
         - HOST=0.0.0.0
         - PORT=3000
         - NODE_ENV=production
         - APP_URL=http://localhost:3008/
   ```

   **IMPORTANT:** Make sure to:
   - Replace `/path/to/data_dir` with your actual data directory path
   - Ensure the `.env` file is a regular file and not a directory
   - The second volume mount must point to a file, not a directory
   - The `APP_URL` environment variable must match the external URL

## Building and Deployment

1. Build and start the application:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at http://localhost:3008

## Maintenance

### Viewing Logs

```bash
# View logs for the KeyBr container
docker logs -f keybr_keybr_1

# View logs with timestamps
docker logs -f --timestamps keybr_keybr_1

# View last 100 lines of logs
docker logs -f --tail=100 keybr_keybr_1
```

### Restarting the Service

```bash
# Restart the service
docker-compose restart keybr

# Stop the service
docker-compose stop keybr

# Start the service
docker-compose start keybr
```

### Updating the Application

```bash
# Pull the latest code
git pull

# Rebuild and restart the container
docker-compose up -d --build keybr
```

## Troubleshooting

If you encounter issues:

1. Check the container logs as shown above
2. Verify your environment configuration in the `.env` file
3. Ensure the data directory has proper permissions
4. Check that the ports specified in `docker-compose.yaml` are available on your system

### Common Errors

**Error: EISDIR: illegal operation on a directory, read**

This error occurs when the volume mount for the environment file points to a directory instead of a file:
```
ERROR: Cannot load dotenv file '/etc/keybr/env'
Error: EISDIR: illegal operation on a directory, read
```

**Fix:**
- Make sure `/path/to/data_dir/.env` is a regular file and not a directory
- The volume mount should be: `/path/to/data_dir/.env:/etc/keybr/env`

## Database Initialization

The application automatically initializes the database on startup using the script defined in the `start-docker` command.

## Additional Notes

- Default port mapping is 3008:3000 (host:container)
- Application data is persisted in the mounted volume
- Configuration is loaded from the mounted .env file

## Access the Application

The application is configured to redirect from port 3008 to 3000. However, Docker is correctly mapping port 3000 in the container to port 3008 on your host machine.

### Login with Example Account

The application creates an initial access token during startup. You can find this token in the logs:

```bash
docker logs keybrcom-keybr-1 | grep "Access token"
```

Example output:
```
INFO: Access token 'xyz' was created.
INFO: Visit http://localhost:3000/login/xyz to login with an example account.
```

To access the application with this token, use:
```
http://localhost:3008/login/xyz
```

Replace `xyz` with the actual token from your logs.