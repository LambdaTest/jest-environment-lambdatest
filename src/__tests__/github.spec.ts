import { WebDriver, By } from 'selenium-webdriver';

describe('Github', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    // eslint-disable-next-line
    // @ts-ignore
    driver = await global.__driver__();
    await driver.get('https://github.com/LambdaTest/jest-environment-lambdatest');
  }, 20000);

  afterAll(async () => {
    await driver.quit();
  });

  it('has an author', async () => {
    const authorSpan = await driver.findElement(By.css('.author'));
    const author = await authorSpan.getText();
    expect(author).toBe('LambdaTest');
  });

  it('has a repository name', async () => {
    const repoSpan = await driver.findElement(By.css('h1.public strong'));
    const repo = await repoSpan.getText();
    expect(repo).toBe('jest-environment-lambdatest');
  });
});
