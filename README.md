# express-test-utils

- Package for random express utility testing functions that I use regularly
- Documentation can be found [here](https://hugophibbs.github.io/express-test-utils/)

## Installation
```shell
npm install express-test-utils
````

## Usage
```typescript
const testUtils = require("express-test-utils")

testUtils.testValidationChain(args)

// Or whatever else you wish to do
```

## Functions
- See documentation linked above for full details

- `testRequiredBodyValues(paths, body, chain)` tests whether given body values are required by a validation chain
- `checkForValidationErrors(req, chain, shouldBeNoErrors)` checks for any validation errors against whether a request should pass a chain or not
- `checkRequestAuthentication(req, auth)` checks if a request passes authentication with given function or not
- `checkValidationErrors(req, res, chain)` checks for any express-validator validation errors for running the given request through the given chain, returns a Result from express-validator.