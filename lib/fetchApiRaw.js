const FetchApiStatusError = require('./FetchApiStatusError');
const asyncRetry = require('./asyncRetry');

async function parseErrorBody(response) {
  try {
    return await response.json();
  }
  catch {
    return undefined;
  }
}

async function fetchApiRaw(resource, options) {
  const retryStrategy = options?.retry;

  const fetchOptions = { ...options }
  delete fetchOptions.retry;

  const fetcher = async () => {
    const response = await fetch(resource, fetchOptions);

    // The following has been implemented to match how `request-promise`
    // in terms of how errors are thrown with non-2xx status codes.    
    if (response.status < 200 || response.status > 299) {
      const errorBody = await parseErrorBody(response);
      throw new FetchApiStatusError(response.status, errorBody);
    }

    return response;
  }

  const response = await asyncRetry(fetcher, retryStrategy);
  return await response.text();
}

module.exports = fetchApiRaw;
