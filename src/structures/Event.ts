import { Client, Constants } from "discord.js";

export type EventName = typeof Constants.Events[keyof typeof Constants.Events];

type EventRunArgs = Client["on"] extends (
  event: EventName,
  listener: infer P
) => any
  ? P
  : never;

interface EventOptions {
  event: EventName;
  once?: boolean;
  run(...args: Parameters<EventRunArgs>): unknown | Promise<unknown>;
}

export abstract class Event implements EventOptions {
  event: EventName;

  constructor(public once?: boolean) {}

  abstract run(...args: Parameters<EventRunArgs>): unknown | Promise<unknown>;
}
