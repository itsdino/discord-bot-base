import { command } from "../../decorators/command";
import { Command, CommandExecuteArgs } from "../../structures/Command";

@command("say")
export class SayCommand extends Command {
  constructor() {
    super({
      aliases: ["repeat"],
      description: "Makes the bot repeat your message",
      category: "Moderation",
      args: true,
      usage: "<your message here>",
      examples: ["Hello world"],
      userPermissions: ["MANAGE_MESSAGES"],
    });
  }

  async execute({ message, args }: CommandExecuteArgs) {
    if (message.deletable) {
      await message.delete();
    }

    message.channel.send(args.join(" "));
  }
}
