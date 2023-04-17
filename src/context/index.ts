import { Context } from "telegraf";

export interface ISession {
  searchCache: Set<string>;
}

export interface IBotContext extends Context {
  session: ISession;
}
