import { Context } from "telegraf";

export interface ISession {
  courseLike: boolean;
}

export interface IBotContext extends Context {
  session: ISession;
}
