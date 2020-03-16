import { Event, EventName } from "../structures/Event";
import { MyBot } from "../structures/MyBot";
import { logger } from "../util/logger";

export const event = (event: EventName, once?: boolean) => (
  Target: new () => Event
) => {
  const target = new Target();
  target.event = event;
  target.once = once;
  MyBot.events.push(target);
  logger.info(`Successfully loaded event: ${event}`);
};
