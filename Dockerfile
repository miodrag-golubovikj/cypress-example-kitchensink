FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Install Java (required by Allure CLI)
RUN apt-get update && apt-get install -y \
    default-jdk \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade Node.js to v22.14.0 to satisfy engine requirements
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Install Allure CLI
RUN curl -o allure-2.27.0.tgz -L \
    https://github.com/allure-framework/allure2/releases/download/2.27.0/allure-2.27.0.tgz \
    && tar -zxvf allure-2.27.0.tgz -C /opt/ \
    && ln -s /opt/allure-2.27.0/bin/allure /usr/bin/allure \
    && rm allure-2.27.0.tgz

WORKDIR /app

COPY package*.json ./

# Disable the Husky prepare script — it is a git hook installer
# and has no purpose inside a Docker build context
RUN npm install --ignore-scripts

# Install serve globally so it is available as a binary
RUN npm install -g serve

COPY . .

EXPOSE 8080
EXPOSE 3000

CMD ["bash", "-c", "\
    npm start & \
    sleep 5 && \
    npx playwright test --reporter=allure-playwright || true && \
    allure generate allure-results --clean -o allure-report && \
    echo 'Allure report generated. Serving on http://localhost:3000' && \
    serve allure-report -l 3000"]
