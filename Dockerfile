# --- STAGE 1: Build the Vite App ---
# Use the official Node.js 20 image based on Alpine for a smaller size
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the necessary files for dependency installation (package.json and lock file)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# IMPORTANT: Inject the API key into a .env.local file
# We are using 'echo' to create the file before the build step.
# The APIKEY value will be passed during the Cloud Build process.
ARG TaskFlow_Pro_APIKEY
RUN echo "VITE_TaskFlow_Pro_APIKEY=${TaskFlow_Pro_APIKEY}" > .env.local

# Build the app for production (Vite's default build output is 'dist')
RUN npm run build

# --- STAGE 2: Serve the Built App with Nginx ---
# Use the lightweight Nginx image based on Alpine
FROM nginx:alpine AS runner

# Expose the port that Nginx will listen on (Google Cloud Run requires 8080)
EXPOSE 8080

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the 'builder' stage into the Nginx content directory
COPY --from=builder /app/dist /usr/share/nginx/html

# The default command for the nginx:alpine image runs Nginx in the foreground,
# which is required by Google Cloud Run. We don't need a custom CMD here.
