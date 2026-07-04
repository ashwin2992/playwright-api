FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npx playwright install --with-deps

COPY . .

CMD ["npx", "playwright", "test"]