# Production Deployment

This guide explains how to deploy KeyBr in a production environment using Docker.

### Prerequisites

- **Docker and Docker Compose must be installed**
- Git repository cloned: `git clone https://github.com/aradzie/keybr.com.git`

### Configuration

Create a data directory and environment file:

```shell
mkdir -p /path/to/data_dir
touch /path/to/data_dir/.env
```

Edit the `.env` file with required configuration:

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

<details>
  <summary>
  Important Configuration Notes
  </summary>

- The `APP_URL` setting must match the external URL you'll use to access the application
- Make sure the configured port (3008 in this example) matches what you set in docker-compose.yaml
</details>

Update the `docker-compose.yaml` file with your volume paths:

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

### Deployment

Build and start the application:

```shell
docker-compose up -d
```

The application will be available at http://localhost:3008

### Maintenance

View container logs:

```shell
# View logs for the KeyBr container
docker logs -f keybr_keybr_1
```

Restart, stop, or start the service:

```shell
# Restart the service
docker-compose restart keybr

# Stop the service
docker-compose stop keybr

# Start the service
docker-compose start keybr
```

Update the application:

```shell
# Pull the latest code
git pull

# Rebuild and restart the container
docker-compose up -d --build keybr
```

### Initial Access

The application creates an initial access token during startup:

```shell
docker logs keybr_keybr_1 | grep "Access token"
```

Example output:
```
INFO: Access token 'xyz' was created.
INFO: Visit http://localhost:3000/login/xyz to login with an example account.
```

To access the application with this token:
```
http://localhost:3008/login/xyz
```

Replace `xyz` with the actual token from your logs.
