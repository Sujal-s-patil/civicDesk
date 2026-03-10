# Public Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose frontend port
EXPOSE 3001

# Set environment to development for hot reload
ENV REACT_APP_API_URL=http://localhost:5555

# Start the React development server
CMD ["npm", "start"]
