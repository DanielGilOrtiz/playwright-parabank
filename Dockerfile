# Use Node.js
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps chromium

# Copy the rest of the project files
COPY . .

# Set environment variables
ENV CI=true

# Command to run tests with HTML reporter
CMD ["npx", "playwright", "test", "--reporter=html"]
