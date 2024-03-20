jest.mock('../lib/fetchApiRaw', () => {
  return jest.fn().mockResolvedValue(`{
    "status": "OK"
  }`);
});

const fetchApi = require('../lib/fetchApi');
const fetchApiRaw = require('../lib/fetchApiRaw');

describe('fetchApi(resource, options)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

	it('calls `fetchApiRaw` with given resource', async () => {
    await fetchApi('https://localhost/test');

    const calledWithParams = fetchApiRaw.mock.calls[0];
    expect(calledWithParams[0]).toBe('https://localhost/test');
  });

	it('calls `fetchApiRaw` with given options', async () => {
    await fetchApi('https://localhost/test', {
      method: 'GET',
      headers: {
        'x-test-header': '123',
      },
    });

    const calledWithParams = fetchApiRaw.mock.calls[0];
    expect(calledWithParams[1]).toHaveProperty('method', 'GET');
    expect(calledWithParams[1]).toHaveProperty('headers', {
      'content-type': 'application/json',
      'x-test-header': '123',
    });
  });

	it('calls `fetchApiRaw` with "application/json" content type', async () => {
    await fetchApi('https://localhost/test');

    const calledWithParams = fetchApiRaw.mock.calls[0];
    expect(calledWithParams[1]).toHaveProperty('headers', {
      'content-type': 'application/json',
    });
  });

	it('stringifies the provided body into a json encoded string', async () => {
    await fetchApi('https://localhost/test', {
      body: {
        someValue: 42,
      },
    });

    const calledWithParams = fetchApiRaw.mock.calls[0];
    expect(calledWithParams[1]).toHaveProperty('body', '{"someValue":42}');
  });

	it('parses json encoded response body', async () => {
    const response = await fetchApi('https://localhost/test');

    expect(response).toEqual({
      status: 'OK',
    });
  });
});
