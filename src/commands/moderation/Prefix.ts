import { command } from "../../decorators/command";
import { Command, CommandExecuteArgs } from "../../structures/Command";

@command("prefix")
export class PrefixCommand extends Command {
  constructor() {
    super({
      description: "Display or change the current prefix",
      category: "Moderation",
      usage: "<optional: new prefix>",
      examples: ["$", "-"],
      userPermissions: ["MANAGE_GUILD"],
    });
  }

  async execute({ message, args: [newPrefix] }: CommandExecuteArgs) {
    const prefix = message.guild!.get("prefix");

    if (!newPrefix) {
      return message.reply(`the current prefix is ${prefix}`);
    }

    if (newPrefix === process.env.PREFIX) {
      message.guild!.set("prefix", newPrefix);
      message.reply(`the prefix has been reset to ${newPrefix}`);
    } else if (newPrefix) {
      message.guild!.set("prefix", newPrefix);
      message.reply(`the prefix has been set to ${newPrefix}`);
    }
  }
}
