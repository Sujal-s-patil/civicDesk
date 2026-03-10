# Docker Setup for Criminal Record Management System

## Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose installed

### Running the Application

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

4. **Stop and remove volumes (clears database):**
   ```bash
   docker-compose down -v
   ```

## Service URLs

- **Police Frontend**: http://localhost:3000
- **Public Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5555
- **MySQL Database**: localhost:3306

## Database Credentials

- **Host**: localhost (or `database` from within containers)
- **Port**: 3306
- **Database**: sem_5_project
- **User**: crms_user
- **Password**: crms_password
- **Root Password**: root_password

## Services Overview

### 1. Database (MySQL 8.0)
- Automatically initializes with `all.sql` schema
- Data persists in Docker volume `mysql_data`
- Health check ensures database is ready before starting backend

### 2. Backend (Node.js/Express)
- Port: 5555
- Hot reload enabled (changes reflect automatically)
- Uploads stored in Docker volume `backend_uploads`

### 3. Frontend-Police (React)
- Port: 3000
- Hot reload enabled
- Connects to backend at http://localhost:5555

### 4. Frontend-Public (React)
- Port: 3001
- Hot reload enabled
- Connects to backend at http://localhost:5555

## Development Commands

### Rebuild specific service:
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend-police
docker-compose up -d --build frontend-public
```

### Access container shell:
```bash
docker exec -it crms_backend sh
docker exec -it crms_frontend_police sh
docker exec -it crms_frontend_public sh
docker exec -it crms_database bash
```

### View logs for specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend-police
docker-compose logs -f frontend-public
docker-compose logs -f database
```

### Install new npm packages:
```bash
# Backend
docker-compose exec backend npm install <package-name>

# Police Frontend
docker-compose exec frontend-police npm install <package-name>

# Public Frontend
docker-compose exec frontend-public npm install <package-name>
```

## Database Access

### Using MySQL client from host:
```bash
mysql -h localhost -P 3306 -u crms_user -p
# Password: crms_password
```

### From within database container:
```bash
docker exec -it crms_database mysql -u crms_user -p sem_5_project
```

## Troubleshooting

### Port already in use:
If ports 3000, 3001, 3306, or 5555 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "NEW_HOST_PORT:CONTAINER_PORT"
```

### Database connection errors:
- Ensure database service is healthy: `docker-compose ps`
- Check logs: `docker-compose logs database`
- Wait for initialization to complete (first run takes longer)

### Frontend not updating:
- Ensure volumes are mounted correctly
- Try rebuilding: `docker-compose up -d --build frontend-police`

### Clear everything and start fresh:
```bash
docker-compose down -v
docker-compose up -d --build
```

## Production Deployment

For production, modify the Dockerfiles to:
1. Build React apps (`npm run build`)
2. Serve with nginx or similar
3. Use environment-specific variables
4. Remove development volumes
5. Use proper secrets management
