/**
 * @jest-environment-lambdatest
 */
describe('visual testing VisualTest', () => {
  let driver;

  beforeAll(async () => {
    driver = await global.__driver__();

    await driver.get('http://localhost:8080');
  }, 40000);

  afterAll(async () => {
    await driver.quit();
  });

  it('check the app', async () => {
    const title = await driver.getTitle();

    expect(title).toBe('React App');
  });
});
