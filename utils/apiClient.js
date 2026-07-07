require('dotenv').config();
const apiContext = require('./apiContext');
const logger = require('./logger');

class ApiClient {
  constructor(request, options = {}) {
    
    this.request = request;
    this.baseUrl = options.baseUrl || process.env.BASE_URL || '';
    this.timeout = Number(options.timeout || process.env.API_TIMEOUT_MS || 30000);
    this.retries = Number(options.retries || process.env.API_RETRIES || 0);
    this.logger = options.logger || logger;
    this.testInfo = options.testInfo;
    this.defaultHeaders = {
      Accept: 'application/json',
      ...(options.headers || {})
    };
  }

  async get(endpoint, options = {}) {
    return this.send('GET', endpoint, options);
  }

  async post(endpoint, payload = {}, options = {}) {
    return this.send('POST', endpoint, { ...options, data: payload });
  }

  async put(endpoint, payload = {}, options = {}) {
    return this.send('PUT', endpoint, { ...options, data: payload });
  }

  async patch(endpoint, payload = {}, options = {}) {
    return this.send('PATCH', endpoint, { ...options, data: payload });
  }

  async delete(endpoint, options = {}) {
    return this.send('DELETE', endpoint, options);
  }

  async send(method, endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const headers = { ...this.defaultHeaders, ...(options.headers || {}) };
    const requestOptions = {
      headers,
      timeout: options.timeout || this.timeout,
      params: options.params,
      data: options.data,
      failOnStatusCode: false
    };

    let lastError;
    for (let attempt = 0; attempt <= this.retries; attempt += 1) {
      const start = Date.now();
      try {
        this.logger.info(`${method} ${url} attempt=${attempt + 1}`);
        const response = await this.request[method.toLowerCase()](url, requestOptions);
        const responseBody = await this.parseBody(response);
        const executionTime = Date.now() - start;

        this.captureContext({ method, url, headers, requestBody: options.data, response, responseBody, executionTime });
        await this.attachExchange({ method, url, headers, requestBody: options.data, response, responseBody, executionTime });

        this.logger.info(`${method} ${url} status=${response.status()} timeMs=${executionTime}`);
        return response;
      } catch (error) {
        lastError = error;
        this.logger.error(`${method} ${url} failed attempt=${attempt + 1}: ${error.message}`);
        if (attempt === this.retries) {
          throw error;
        }
      }
    }

    throw lastError;
  }

  buildUrl(endpoint) {
    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }
    return `${this.baseUrl.replace(/\/$/, '')}/${String(endpoint).replace(/^\//, '')}`;
  }

  async parseBody(response) {
    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  captureContext({ method, url, headers, requestBody, response, responseBody, executionTime }) {
    apiContext.method = method;
    apiContext.url = url;
    apiContext.headers = headers;
    apiContext.requestBody = requestBody || null;
    apiContext.responseBody = responseBody;
    apiContext.status = response.status();
    apiContext.executionTime = executionTime;
  }

  async attachExchange({ method, url, headers, requestBody, response, responseBody, executionTime }) {
    if (!this.testInfo) {
      return;
    }

    const payload = {
      request: { method, url, headers, body: requestBody || null },
      response: { status: response.status(), body: responseBody, executionTimeMs: executionTime }
    };

    await this.testInfo.attach(`api-${method.toLowerCase()}-${response.status()}`, {
      body: JSON.stringify(payload, null, 2),
      contentType: 'application/json'
    });
  }
}

module.exports = ApiClient;
