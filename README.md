# login.dfe.async-retry
[![Build Status](https://travis-ci.org/DFE-Digital/login.dfe.async-retry.svg?branch=master)](https://travis-ci.org/DFE-Digital/login.dfe.async-retry)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest) [![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

Async retry library for NodeJS built on top of [retry](https://github.com/tim-kos/node-retry)

## Basic Usage

The example below will call the getData function up to 3 times (The initial call and up to another 2 retries).
It uses an exponential backoff between attempts


```
const asyncRetry = require('login.dfe.async-retry');

const getData = async () => {
    // Do your work here
};

return asyncRetry(getData, {
    retries: 2,
});
```

## Available options

The second parameter of asyncRetry is the options object. This parameter is optional, but
if specified supports the following options:

| Option     | Default    | Description                                                         |
| ---------- | ---------- | ------------------------------------------------------------------- |
| retries    | 10         | The number of times to retry the function                           |
| factor     | 2          | The exponential factor to use                                       |
| minTimeout | 1000       | The number of milliseconds before starting the first retry          |
| maxTimeout | Infinity   | The maximum number of milliseconds between two retries              |
| randomize  | false      | Randomizes the timeouts by multiplying with a factor between 1 to 2 |
| onError    | () => true | A function (see below) called then function errors

All options but `onError` are from [retry](https://github.com/tim-kos/node-retry)

## Error handling

The options of asyncRetry takes an `onError` function, which takes the number of the current attempt and the error that occured.
This function is expected to return a boolean result to signify whether to continue retrying.

The following example shows how to abort processing if a 401 error has occured more than once:

```
asyncRetry(callApi, {
    onError: (attempt, err) => {
        if(err.statusCode === 401 && attempt === 2) {
            return false; // give up trying, the error is unrecoverable
        }
        return true; // keep retrying until success or retries limit reached
    },
});
```

It is also possible to abort retrying within the function itself by setting `bail = true;` on the error being thrown.