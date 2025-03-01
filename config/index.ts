import config from 'config';

interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    env: string;
    startDate: string;
  };
  server: {
    port: number;
  };
  datasetsDir: string;
  jwt: {
    secret: {
      access: string;
      refresh: string;
    },
    expiresIn: {
      access: number;
      refresh: number;
    };
  }
}

const appConfig: AppConfig = config as unknown as AppConfig;

export default appConfig;
