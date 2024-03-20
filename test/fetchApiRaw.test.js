jest.mock('../lib/asyncRetry', () => {
  return jest.fn().mockImplementation(fn => fn());
});

const FetchApiStatusError = require('../lib/FetchApiStatusError');
const asyncRetry = require('../lib/asyncRetry');
const fetchApiRaw = require('../lib/fetchApiRaw');

describe('fetchApiRaw(resource, options)', () => {
  const mockedFetch = jest.fn().mockResolvedValue({
    text: async () => 'Test response',
  });

  beforeAll(() => {
    global.fetch = mockedFetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls `fetch` with given resource', async () => {
    await fetchApiRaw('https://localhost/test');

    const calledWithParams = mockedFetch.mock.calls[0];
    expect(calledWithParams[0]).toBe('https://localhost/test');
  });

  it('calls `fetch` with given options', async () => {
    await fetchApiRaw('https://localhost/test', {
      method: 'GET',
      headers: {
        'x-test-header': '123',
      },
    });

    const calledWithParams = mockedFetch.mock.calls[0];
    expect(calledWithParams[1]).toHaveProperty('method', 'GET');
    expect(calledWithParams[1]).toHaveProperty('headers', {
      'x-test-header': '123',
    });
  });

  it('does not pass the `retry` option to `fetch`', async () => {
    await fetchApiRaw('https://localhost/test', {
      retry: {
        retries: 3,
      },
    });

    const calledWithParams = mockedFetch.mock.calls[0];
    expect(calledWithParams[1]).not.toHaveProperty('retry');
  });

  it('resolves with the expected response', async () => {
    const response = await fetchApiRaw('https://localhost/test', {
      method: 'GET',
      headers: {
        'x-test-header': '123',
      },
    });

    expect(response).toBe('Test response');
  });

  it('provides custom retry options to `asyncRetry`', async () => {
    await fetchApiRaw('https://localhost/test', {
      retry: {
        retries: 3,
      },
    });

    const calledWithParams = asyncRetry.mock.calls[0];
    expect(calledWithParams[1]).toEqual({
      retries: 3,
    });
  });

  it.each([ 199, 100, 300, 404, 500 ])('throws error with status code %d', async (statusCode) => {
    mockedFetch.mockResolvedValue({
      status: statusCode,
    });

    const act = async () => {
      await fetchApiRaw('https://localhost/test');
    };

    await expect(act).rejects.toThrow(`Request failed with status code ${statusCode}`);
  });
});
