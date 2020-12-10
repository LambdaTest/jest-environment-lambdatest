# jest-environment-lambdatest

![Actions Status](https://github.com/LambdaTest/jest-environment-lambdatest/workflows/Actions%20Status/badge.svg?branch=master&event=push) [![npm version](http://img.shields.io/npm/v/jest-environment-lambdatest.svg?style=flat)](https://npmjs.org/package/jest-environment-lambdatest 'View this project on npm')

Use Jest as test-runner for running your visual-tests and more using LambdaTest.

## Usage

For using this environment, run first the following command in your terminal:

```bash
npm install --save-dev jest-environment-lambdatest
```

Once it's done, configure your Jest config.

### LambdaTest

Assuming your configuration is defined in your `package.json`, add the following lines to your `globals` definition:

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "lambdatest",
    "globals": {
      "lambdatest": {
        "capabilities": {
          "build": "jest and lambdatest with tunnel",
          "name": "jest demo",
          "platform": "Windows 10",
          "browserName": "Chrome",
          "version": "latest"
        }
      }
    }
  }
}
```

### LambdaTest Tunnel

Assuming here also your configuration is defined in your `package.json`, add the following lines to your `globals` definition:

```json
{
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "lambdatest",
    "globals": {
      "lambdatest": {
        "capabilities": {
          "build": "jest and lambdatest with tunnel",
          "name": "jest demo",
          "platform": "Windows 10",
          "browserName": "Chrome",
          "version": "latest",
          "tunnel": true
        },
        "tunnelOpts": {}
      }
    }
  }
}
```

### Loading the environment using annotation

If you are running all your tests with JSDom as main environment, you can load the LambdaTest environment for a specific file by adding a Jest annotation at the beginning of your file.

Here is an example:

my-visual-test.spec.js:

```javascript
/**
 * @jest-environment-lambdatest
 */
import { By } from 'selenium-webdriver';

describe('my visual test', () => {
  let driver;

  beforeAll(async () => {
    // you can override the default configuration
    driver = await global.__driver__({
      build: 'jest and lambdatest',
      name: 'jest demo',
      platform: 'Windows 10',
      browserName: 'Chrome',
      version: '80.0',
    });
    driver.get('https://www.lambdatest.com');
  }, 20000); // this timeout is required because starting a session in LambdaTest can take ages

  afterAll(async () => {
    // can be omitted
    await driver.quit();
  });

  it('test title', async () => {
    const title = await driver.getTitle();
    expect(title).toBe('Cross Browser Testing Tools | Free Automated Website Testing | LambdaTest');
  });
});
```

### Credentials

If you aren't willing to put your credentials in your `package.json` file, you can export in your environment `LT_USERNAME` and `LT_ACCESS_KEY`. If you do so, `userName` and `accessKey` can be omitted.

## Examples

In the `examples` folder, you can find an example using `react-create-app`.

To run the test, type the following commands in your terminal:

```bash
cd examples/with-lambdatest-tunnel
yarn install
yarn test
```

The `test` script will run a basic e2e tests, a visual tests making a snapshot of the web-app and the unit-tests.

## Contribute

#### Reporting bugs

Our GitHub Issue Tracker will help you log bug reports.

Tips for submitting an issue:
Keep in mind, you don't end up submitting two issues with the same information. Make sure you add a unique input in every issue that you submit. You could also provide a "+1" value in the comments.

Always provide the steps to reproduce before you submit a bug.
Provide the environment details where you received the issue i.e. Browser Name, Browser Version, Operating System, Screen Resolution and more.
Describe the situation that led to your encounter with bug.
Describe the expected output, and the actual output precisely.

#### Pull Requests

We don't want to pull breaks in case you want to customize your LambdaTest experience. Before you proceed with implementing pull requests, keep in mind the following.
Make sure you stick to coding conventions.
Once you include tests, ensure that they all pass.
Make sure to clean up your Git history, prior your submission of a pull-request. You can do so by using the interactive rebase command for committing and squashing, simultaneously with minor changes + fixes into the corresponding commits.

## About LambdaTest

[LambdaTest](https://www.lambdatest.com/) is a cloud based selenium grid infrastructure that can help you run automated cross browser compatibility tests on 2000+ different browser and operating system environments. LambdaTest supports all programming languages and frameworks that are supported with Selenium, and have easy integrations with all popular CI/CD platforms. It's a perfect solution to bring your [selenium automation testing](https://www.lambdatest.com/selenium-automation) to cloud based infrastructure that not only helps you increase your test coverage over multiple desktop and mobile browsers, but also allows you to cut down your test execution time by running tests on parallel.
