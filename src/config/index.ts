import { config, DotenvParseOutput } from "dotenv";

export interface IConfigService {
  get(key: string): string;
}

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;
  constructor() {
    const { error, parsed } = config();
    if (error) {
      throw new Error(".env file is missing");
    }
    if (!parsed) {
      throw new Error(".env file is empty");
    }

    this.config = parsed;
  }
  get(key: string): string {
    const value = this.config[key];

    if (!value) {
      throw new Error(`Cannot find ${value} variable`);
    }

    return value;
  }
}
