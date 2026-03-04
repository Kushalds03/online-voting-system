# Use official Node image
FROM node:18

# Create app directory inside container
WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]