import { Client } from "discord.js";
import { event } from "../decorators/event";
import { Event } from "../structures/Event";
import { logger } from "../util/logger";

@event("ready", true)
export class ReadyEvent extends Event {
  run(client: InstanceType<typeof Client>) {
    client.user?.setActivity(`Say @${client.user.username} help`, {
      type: "PLAYING",
    });

    logger.info(`${client.user?.username} is ready!`);
  }
}
