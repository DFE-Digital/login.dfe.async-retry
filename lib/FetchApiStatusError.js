class FetchApiStatusError extends Error {
  constructor(statusCode, body) {
    super(`Request failed with status code ${statusCode}`);
    this.name = 'FetchApiStatusError';
    this.statusCode = statusCode;
    this.error = body;
  }
}

module.exports = FetchApiStatusError;
