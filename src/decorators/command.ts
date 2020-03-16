import { Command } from "../structures/Command";
import { MyBot } from "../structures/MyBot";
import { logger } from "../util/logger";

export const command = (name: string) => (Target: new () => Command) => {
  const target = new Target();
  target.name = name;
  MyBot.commands.push(target);
  logger.info(`Successfully loaded command: ${name}`);
};
