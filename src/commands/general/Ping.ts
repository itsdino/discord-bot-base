import { command } from "../../decorators/command";
import { Command, CommandExecuteArgs } from "../../structures/Command";

@command("ping")
export class PingCommand extends Command {
  constructor() {
    super({
      description: "Checks if I am still online",
      category: "General",
    });
  }

  execute({ message }: CommandExecuteArgs) {
    message.channel.send("🏓️ Pong!");
  }
}
