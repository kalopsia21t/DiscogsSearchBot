import { Telegraf } from "telegraf";
import { IBotContext } from "../context";
import { IDiscogsDatabase } from "../discogs";

export abstract class Command {
  constructor(public bot: Telegraf<IBotContext>, public db: IDiscogsDatabase) {}

  abstract handle(): void;
}
