import "dotenv/config";
import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import { MyBot } from "./structures/MyBot";
import { importFiles } from "./util/importFiles";

const main = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  await createConnection({
    ...connectionOptions,
    name: "default",
  });

  await importFiles({
    structures: `${__dirname}/structures/discord/*{.js,.ts}`,
    events: `${__dirname}/events/*{.js,.ts}`,
    commands: `${__dirname}/commands/**/*{.js,.ts}`,
  });

  new MyBot({ disableMentions: "everyone" }).login(process.env.TOKEN);
};

main();
