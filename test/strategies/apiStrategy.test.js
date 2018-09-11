const { strategies } = require('./../../lib');
const apiStrategy = strategies.apiStrategy;

describe('when using the api strategy', () => {
  let err;

  beforeEach(() => {
    err = new Error('test');
    err.statusCode = 200;
  });

  it('then it should return true by default', () => {
    const actual = apiStrategy.onError(99, err);

    expect(actual).toBe(true);
  });

  it('then it should return false if status code is 400', () => {
    err.statusCode = 400;

    const actual = apiStrategy.onError(1, err);

    expect(actual).toBe(false);
  });

  it('then it should return true if status code is 401 and attempt is 1', () => {
    err.statusCode = 401;

    const actual = apiStrategy.onError(1, err);

    expect(actual).toBe(true);
  });

  it('then it should return true if status code is 401 and attempt more than is 1', () => {
    err.statusCode = 401;

    const actual = apiStrategy.onError(2, err);

    expect(actual).toBe(false);
  });

  it('then it should return true if status code is 403 and attempt is 1', () => {
    err.statusCode = 403;

    const actual = apiStrategy.onError(1, err);

    expect(actual).toBe(true);
  });

  it('then it should return true if status code is 403 and attempt more than is 1', () => {
    err.statusCode = 403;

    const actual = apiStrategy.onError(2, err);

    expect(actual).toBe(false);
  });
});
