import { WebDriver, By } from 'selenium-webdriver';

describe('Switch specs', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__({
      build: 'jest and lambdatest',
      name: 'jest demo',
      platform: 'Windows 10',
      browserName: 'Chrome',
      version: '80.0',
    });
    await driver.get('https://github.com/LambdaTest/jest-environment-lambdatest');
  }, 20000);

  afterAll(async () => {
    await driver.quit();
  });

  it('has an author', async () => {
    const authorSpan = await driver.findElement(By.css('.Details .Header-link:first-of-type'));
    const author = await authorSpan.getText();
    expect(author).toBe('LambdaTest');
  });

  it('has a repository name', async () => {
    const repoSpan = await driver.findElement(By.css('.Details .Header-link:last-of-type'));
    const repo = await repoSpan.getText();
    expect(repo).toBe('jest-environment-lambdatest');
  });
});
