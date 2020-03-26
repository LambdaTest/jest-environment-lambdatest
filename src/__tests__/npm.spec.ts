import { WebDriver } from 'selenium-webdriver';

describe('NPM', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__();
    await driver.get('https://www.npmjs.com/package/jest-environment-lambdatest');
  }, 50000);

  afterAll(async () => {
    await driver.quit();
  });

  it('get title from NPM', async () => {
    const title = await driver.getTitle();
    expect(title).toBe('jest-environment-lambdatest - npm');
  });
});
