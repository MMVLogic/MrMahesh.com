# Use a lightweight official Node.js Alpine base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Install build dependencies for sqlite3 native compilation on alpine and git/ssh for publishing
RUN apk add --no-cache python3 make g++ git openssh-client

# Copy package descriptors first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set default environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    DATABASE_PATH=/app/data/cms.db \
    CONTENT_DIR=/content

# Create data and content mount points
RUN mkdir -p /app/data /content /root/.ssh

# Expose web server port
EXPOSE 3000

# Run the CMS server
CMD ["node", "server.js"]
