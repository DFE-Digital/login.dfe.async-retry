module.exports = {
  retries: 2,
  randomize: true,
  minTimeout: 250,
  maxTimeout: 10000,
  onError: (attempt, err) => {
    if (err.statusCode === 400 || err.statusCode === 404) {
      return false;
    }
    if (err.statusCode === 401 || err.statusCode === 403) {
      return attempt === 1;
    }
    return true;
  }
};
