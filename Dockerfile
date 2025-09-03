# Build stage
FROM node:20-slim as build

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies (including devDependencies for building)
# Use full install so optional platform binaries like rollup are included
RUN npm install

# Copy project files
COPY . .

# Build the app with production mode
RUN npm run build

# Production stage
FROM nginx:stable as production

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
