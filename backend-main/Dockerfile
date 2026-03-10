# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5555

# Start the application with nodemon for hot reload
CMD ["npm", "run", "dev"]
