const fetchApiRaw = require('./fetchApiRaw');
const apiStrategy = require('./strategies/apiStrategy');

async function fetchApi(resource, options) {
  options = options ?? {};

  options.retry = options.retry ?? apiStrategy;
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['content-type'] = 'application/json';
  if (options.body) {
    options.body = JSON.stringify(options.body);
  }
  const raw = await fetchApiRaw(resource, options);
  if (!!raw) {
    try {
      return JSON.parse(raw);
    }
    catch {
      return raw;
    }
  }
}

module.exports = fetchApi;
