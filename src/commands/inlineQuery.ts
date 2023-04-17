import { Telegraf, Markup } from "telegraf";
import { Command } from ".";
import { IBotContext } from "../context";
import { IDiscogsDatabase } from "../discogs";

type IResultItem = {
  id: number;
  title: string;
  uri: string;
  thumb: string;
  year: string;
  style: string;
  label: string;
};

export class InlineQuery extends Command {
  constructor(bot: Telegraf<IBotContext>, db: IDiscogsDatabase) {
    super(bot, db);
  }

  handle(): void {
    this.bot.on("inline_query", (context) => {
      const params_map = ["title", "release_title", "style"];
      const query = context.update.inline_query.query;
      const params = query.split(";").reduce((acc, item, index) => {
        if (!params_map[index]) return { ...acc };
        return {
          ...acc,
          [params_map[index]]: item.trim(),
        };
      }, {});

      this.db.search?.(params, async (err, data) => {
        const results = data.results.map(
          ({
            title,
            uri,
            id,
            thumb,
            year,
            style,
            label,
            ...rest
          }: IResultItem) => {
            return {
              type: "article",
              id: id,
              title: title,
              description: `${year}, ${style}, ${label?.toString()}`,
              thumb_url: thumb,
              input_message_content: {
                message_text: title,
              },
              ...Markup.inlineKeyboard([
                Markup.button.url(
                  "Go to record",
                  `https://www.discogs.com${uri}`
                ),
              ]),
            };
          }
        );
        await context.answerInlineQuery(results).catch((err) => {
          console.log(err);
        });
      });
    });
  }
}
