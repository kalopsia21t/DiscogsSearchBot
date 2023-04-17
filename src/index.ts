import { Telegraf, session } from "telegraf";
import { Client as Discogs } from "disconnect";

import { ConfigService, IConfigService } from "./config";
import { IBotContext } from "./context";
import { Command } from "./commands";
import { InlineQuery } from "./commands/inlineQuery";

import { IDiscogsDatabase } from "./discogs";

interface IBot {
  initialization(): void;
}

class Bot implements IBot {
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];
  db: IDiscogsDatabase = {};
  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get("BOT_TOKEN"));
    this.bot.use(session());
    this.db = new Discogs({
      userToken: this.configService.get("DISCOGS_ACCESS_TOKEN"),
    }).database();
  }

  initialization() {
    this.commands = [new InlineQuery(this.bot, this.db)];
    for (const command of this.commands) {
      command.handle();
    }
    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());

bot.initialization();
