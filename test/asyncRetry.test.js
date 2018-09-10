const asyncRetry = require('./../lib');

const fn = jest.fn();

describe('when executing a function with retries', () => {
  beforeEach(() => {
    fn.mockReset();
  });

  it('then it should return result of function', async () => {
    fn.mockReturnValue(Promise.resolve('test'));

    const actual = await asyncRetry(fn);

    expect(actual).toBe('test');
  });

  it('then it should execute the function the specified number of times if it errors', async () => {
    fn.mockReturnValue(Promise.reject(new Error('test')));

    try {
      await asyncRetry(fn, { retries: 3, minTimeout: 1, maxTimeout: 10 });
    } catch (e) {
      // Ignore, error is expected
    }

    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('then it should throw last error', async () => {
    fn.mockImplementation((attempt) => {
      return Promise.reject(new Error(`Failed on ${attempt}`));
    });

    try {
      await asyncRetry(fn, { retries: 3, minTimeout: 1, maxTimeout: 10 });
      throw new Error('No error thrown')
    } catch (e) {
      expect(e.message).toBe('Failed on 4');
    }
  });

  it('then it should stop retrying if throw error has bail=true', async () => {
    fn.mockImplementation((attempt) => {
      const err = new Error(`Failed on ${attempt}`);
      if (attempt === 2) {
        err.bail = true;
      }
      return Promise.reject(err);
    });

    try {
      await asyncRetry(fn, { retries: 3, minTimeout: 1, maxTimeout: 10 });
      throw new Error('No error thrown')
    } catch (e) {
      expect(e.message).toBe('Failed on 2');
      expect(fn).toHaveBeenCalledTimes(2);
    }
  });

  it('then it should stop retrying if onError returns false', async () => {
    fn.mockImplementation((attempt) => {
      return Promise.reject(new Error(`Failed on ${attempt}`));
    });

    try {
      await asyncRetry(fn, {
        retries: 3,
        minTimeout: 1,
        maxTimeout: 10,
        onError: (attempt) => {
          return attempt !== 2;
        },
      });
      throw new Error('No error thrown')
    } catch (e) {
      expect(e.message).toBe('Failed on 2');
      expect(fn).toHaveBeenCalledTimes(2);
    }
  });

  it('then it should treat undefined response from onError as true', async () => {
    fn.mockImplementation((attempt) => {
      return Promise.reject(new Error(`Failed on ${attempt}`));
    });

    try {
      await asyncRetry(fn, {
        retries: 3,
        minTimeout: 1,
        maxTimeout: 10,
        onError: () => {
          return undefined;
        },
      });
      throw new Error('No error thrown')
    } catch (e) {
      expect(e.message).toBe('Failed on 4');
      expect(fn).toHaveBeenCalledTimes(4);
    }
  });
});
