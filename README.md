# express-test-utils

-   Package for random express utility testing functions that I use regularly
-   Documentation can be found [here](https://hugophibbs.github.io/express-test-utils/)

## Installation

```shell
npm install express-test-utils
```

### Setup

-   For versions 1.1.0 and above, you may encounter issues with Jest complaining about `expect` requiring just one argument. This occurs since my package relies on [jest-expect-message](https://www.npmjs.com/package/jest-expect-message) to provide expect messages. To fix this, follow steps in **Setup** on jest-expect-message's [readme](https://www.npmjs.com/package/jest-expect-message#readme). Which pretty much replaces the `expect` definition for your project

## Usage

```typescript
const testUtils = require("express-test-utils");

testUtils.testValidationChain(args);

// Or whatever else you wish to do
```

## Functions

-   See documentation linked above for full details

-   `testRequiredBodyValues(paths, body, chain)` tests whether given body values are required by a validation chain
-   `checkForValidationErrors(req, chain, shouldBeNoErrors)` checks for any validation errors against whether a request should pass a chain or not
-   `checkRequestAuthentication(req, auth)` checks if a request passes authentication with given function or not
-   `checkValidationErrors(req, res, chain)` checks for any express-validator validation errors for running the given request through the given chain, returns a Result from express-validator.

## Contributing
- If you would like to leave feedback or suggestions, please refer to our issues [page](https://github.com/HugoPhibbs/express-test-utils/issues).
- PRs are welcome