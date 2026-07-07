class ApiContext {

    constructor() {
        this.clear();
    }

    clear() {
        this.method = "";
        this.url = "";
        this.headers = {};
        this.requestBody = null;

        this.status = 0;
        this.responseHeaders = {};
        this.responseBody = null;

        this.executionTime = 0;
    }

    setRequest(method, url, headers = {}, requestBody = null) {
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.requestBody = requestBody;
    }

    setResponse(status, responseHeaders = {}, responseBody = null, executionTime = 0) {
        this.status = status;
        this.responseHeaders = responseHeaders;
        this.responseBody = responseBody;
        this.executionTime = executionTime;
    }

    snapshot() {
        return {
            method: this.method,
            url: this.url,
            headers: { ...this.headers },
            requestBody: this.requestBody,

            status: this.status,
            responseHeaders: { ...this.responseHeaders },
            responseBody: this.responseBody,

            executionTime: this.executionTime
        };
    }

}

module.exports = new ApiContext();