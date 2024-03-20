class FetchApiStatusError extends Error {
  constructor(statusCode) {
    super(`Request failed with status code ${statusCode}`);
    this.name = 'FetchApiStatusError';
    this.statusCode = statusCode;
  }
}

module.exports = FetchApiStatusError;
