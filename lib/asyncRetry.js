const retry = require('retry');

const asyncRetry = async (fn, opts) => {
  const options = Object.assign({
    retries: 10,
    factor: 2,
    minTimeout: 1000,
    maxTimeout: Infinity,
    randomize: false,
  }, opts);
  return new Promise((resolve, reject) => {
    const op = retry.operation(options);

    const onError = options.onError || (() => true);

    op.attempt((currentAttempt) => {
      fn(currentAttempt).then((result) => {
        resolve(result);
      }).catch((e) => {
        let bail = e.bail;
        if (bail === undefined) {
          const errorResult = onError(currentAttempt, e);
          bail = errorResult === undefined ? false : !errorResult;
        }
        if (bail) {
          op.stop();
          reject(e);
        }
        if (!op.retry(e)) {
          reject(e);
        }
      });
    });
  });
};

module.exports = asyncRetry;
