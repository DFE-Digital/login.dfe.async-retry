const FetchApiStatusError = require('../lib/FetchApiStatusError');

describe('class FetchApiStatusError', () => {
  it('has the expected error name', () => {
    const error = new FetchApiStatusError(500);

    expect(error.name).toBe('FetchApiStatusError');
  });

  it.each([ 404, 500 ])('has the provided status code "%d"', (statusCode) => {
    const error = new FetchApiStatusError(statusCode);

    expect(error.statusCode).toBe(statusCode);
  });

  it.each([
    [ 404, 'Request failed with status code 404' ],
    [ 500, 'Request failed with status code 500' ],
  ])('for status code %d has the expected error message "%s"', (statusCode, expectedMessage) => {
    const error = new FetchApiStatusError(statusCode);

    expect(error.message).toBe(expectedMessage);
  });
});
