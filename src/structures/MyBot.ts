import { Client, ClientOptions } from "discord.js";
import { Command } from "./Command";
import { Event } from "./Event";

export class MyBot extends Client {
  static commands: Command[] = [];
  static events: Event[] = [];

  constructor(options?: ClientOptions) {
    super(options);

    MyBot.events.forEach(({ event, once, run }) => {
      super[once ? "once" : "on"](event, (...args) => run(...args, this));
    });
  }
}
