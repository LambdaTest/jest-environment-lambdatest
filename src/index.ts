import NodeEnvironment from 'jest-environment-node';
import { Config } from '@jest/types';
import { Options, Tunnel } from '@lambdatest/node-tunnel';
import { Builder, WebDriver } from 'selenium-webdriver';
import { randomBytes } from 'crypto';
import { Script } from 'vm';

import { LambdaTestCapabilities } from './types';

export default class LambdaTestEnvironment extends NodeEnvironment {
  private readonly selHubUrl: string;

  private readonly lambdaCapabilities: LambdaTestCapabilities;

  private tunnelOpts: Options;

  private readonly drivers: WebDriver[];

  constructor(config: Config.ProjectConfig) {
    super(config);

    let {
      lambdatest: { capabilities, seleniumHubUrl = null, tunnelOpts = null },
    } = config.globals;

    this.lambdaCapabilities = capabilities;
    if (!this.lambdaCapabilities.accessKey || !this.lambdaCapabilities.userName) {
      const { LT_USERNAME: userName = '', LT_ACCESS_KEY: accessKey = '' } = process.env;

      if (!userName || !accessKey) {
        throw new Error('valid credentials for LambdaTest are required');
      }
      this.lambdaCapabilities.userName = userName;
      this.lambdaCapabilities.accessKey = accessKey;
    }

    if (this.lambdaCapabilities.tunnel) {
      if (!this.lambdaCapabilities.tunnelName) {
        this.lambdaCapabilities.tunnelName = Buffer.from(randomBytes(28)).toString('hex');
      } else {
        this.lambdaCapabilities.tunnelName = this.lambdaCapabilities.tunnelName;
      }
      this.tunnelOpts = tunnelOpts;
    }
    const GRID_HOST = process.env.LT_GRID_HOST || 'hub.lambdatest.com/wd/hub';
    if (!seleniumHubUrl) {
      seleniumHubUrl = 'https://' + this.lambdaCapabilities.userName + ':' + this.lambdaCapabilities.accessKey + '@' + GRID_HOST;
    }

    this.selHubUrl = seleniumHubUrl;
    this.drivers = new Array<WebDriver>();
  }

  async setup(): Promise<void> {
    await super.setup();

    if (this.tunnelOpts) {
      await this.createLTTunnel();
    }

    this.global.__driver__ = this.createWDDriver.bind(this);
  }

  async teardown(): Promise<void> {
    await super.teardown();

    await Promise.all(
      this.drivers.map(async driver => {
        try {
          await driver.quit();
        } catch (_) {
          return Promise.resolve();
        }
      }),
    );
    await this.closeLTTunnel();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runScript(script: Script): any {
    return super.runScript(script);
  }

  private async createWDDriver(capabilities?: LambdaTestCapabilities): Promise<WebDriver> {
    // checks if we have new capabilities
    if (capabilities) {
      // define username + accessKey + tunnelIdentifier if any
      capabilities.userName = this.lambdaCapabilities.userName;
      capabilities.accessKey = this.lambdaCapabilities.accessKey;

      if (this.lambdaCapabilities.tunnelName) {
        capabilities.tunnelName = this.lambdaCapabilities.tunnelName;
      }
    }

    const driverFactory = new Builder().usingServer(this.selHubUrl).withCapabilities(capabilities || this.lambdaCapabilities);

    const driver = await driverFactory.build();

    this.drivers.push(driver);

    return driver;
  }

  private createLTTunnel(): Promise<void | Error> {
    if (this.lambdaCapabilities.tunnelName) {
      this.tunnelOpts.tunnelName = this.lambdaCapabilities.tunnelName;
    }
    this.tunnelOpts.user = this.lambdaCapabilities.userName;
    this.tunnelOpts.key = this.lambdaCapabilities.accessKey;

    this.global.__local__ = new Tunnel();

    return new Promise((resolve, reject): void => {
      this.global.__local__.start(this.tunnelOpts, (err?: Error) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
  }

  private closeLTTunnel(): Promise<void | Error> {
    if (!this.global.__local__) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject): void => {
      this.global.__local__.stop((err?: Error) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }
}
