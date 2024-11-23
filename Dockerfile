# Step 1: Build the React app using a Node.js image
FROM node:18 AS build

# Set working directory for building the React app
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . ./

# Build the React app
RUN npm run build

# Step 2: Use Nginx to serve the built React app
FROM nginx:alpine

# Copy the build directory from the build step
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default HTTP port
EXPOSE 80

# Start Nginx in the foreground (to keep the container running)
CMD ["nginx", "-g", "daemon off;"]
