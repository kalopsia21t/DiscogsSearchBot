const { Telegraf, Markup } = require("telegraf");
const Discogs = require("disconnect").Client;

require("dotenv").config();

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

  console.log(params);

  db.search(params, (err, data) => {
    const chosen = data.results.find((item) => {
      return (
        item.title.includes(params.title) &&
        item.title.includes(params.release_title)
      );
    });
    console.log(chosen);

    const results = data.results.map(({ title, uri, id, thumb }) => {
      console.log(`${process.env.DISCOGS_BASE_URI}${uri}`);
      return {
        type: "article",
        id: id,
        title: title,
        description: title,
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
    });

    return context.answerInlineQuery(results).catch((err) => {
      console.log(err);
    });
  });
});

bot.launch();
