import { WebDriver } from 'selenium-webdriver';

describe('Github', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__();
    await driver.get('https://github.com/LambdaTest/jest-environment-lambdatest');
  }, 50000);

  afterAll(async () => {
    await driver.quit();
  });

  it('get title from GitHub', async () => {
    const title = await driver.getTitle();
    expect(title).toBe('GitHub - LambdaTest/jest-environment-lambdatest');
  });
});
