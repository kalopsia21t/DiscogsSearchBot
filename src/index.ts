import { Telegraf, Markup } from "telegraf";
import { Client as Discogs } from "disconnect";
import * as dotenv from "dotenv";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const dis = new Discogs({ userToken: process.env.DISCOGS_ACCESS_TOKEN });

const db = dis.database();

const params_map = ["title", "release_title", "style"];

bot.on("inline_query", (context) => {
  const query = context.update.inline_query.query;
  const params = query.split(";").reduce((acc, item, index) => {
    if (!params_map[index]) return { ...acc };
    return {
      ...acc,
      [params_map[index]]: item.trim(),
    };
  }, {});

  db.search(params, async (err, data) => {
    const results = data.results.map(
      ({ title, uri, id, thumb, year, style, label, ...rest }) => {
        console.log(rest);
        return {
          type: "article",
          id: id,
          title: title,
          description: `${year}, ${style}, ${label.toString()}`,
          thumb_url: thumb,
          input_message_content: {
            message_text: title,
          },
          ...Markup.inlineKeyboard([
            Markup.button.url(
              "Go to record",
              `${process.env.DISCOGS_BASE_URI}${uri}`
            ),
          ]),
        };
      }
    );

    return await context.answerInlineQuery(results).catch((err) => {
      console.log(err);
    });
  });
});

bot.launch();
