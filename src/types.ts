export type LambdaTestCapabilities = {
  userName: string;
  accessKey: string;
  build: string;
  name: string;
  platform: string;
  browserName: string;
  version?: string;
  resolution?: string;
  selenium_version?: string;
  visual?: boolean;
  tunnel?: boolean;
  tunnelName?: string;
  [key: string]: string | boolean;
};
