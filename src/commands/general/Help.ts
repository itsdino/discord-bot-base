import { Message, MessageEmbed } from "discord.js";
import { command } from "../../decorators/command";
import {
  Category,
  Command,
  CommandExecuteArgs,
} from "../../structures/Command";
import { MyBot } from "../../structures/MyBot";

interface CommandReducer {
  category: Category;
  commands: Command[];
}

@command("help")
export class HelpCommand extends Command {
  constructor() {
    super({
      description:
        "Get a list of all commands or info about a specific command",
      category: "General",
      usage: "<optional: command name>",
      examples: ["prefix", "say"],
    });
  }

  execute({ message, args: [commandName] }: CommandExecuteArgs) {
    if (commandName) {
      return this.getCommand(message, commandName);
    }

    this.getCommands(message);
  }

  private getCommand(message: Message, commandName: string) {
    const command = MyBot.commands.find(
      ({ name, config }) =>
        name === commandName || config.aliases?.includes(commandName)
    );

    if (!command) {
      return message.reply(`${commandName} is not a valid command`);
    }

    const embed = new MessageEmbed().setColor("BLUE").setTitle(command.name);
    const prefix = message.guild!.get("prefix");

    this.entries(command.config).forEach(([key, val]) => {
      if (key === "args") {
        return;
      }

      if (key === "usage") {
        return embed.addField(key, `${prefix}${command.name} ${val}`, true);
      }

      embed.addField(key, Array.isArray(val) ? val.join(", ") : val, true);
    });

    message.channel.send(embed);
  }

  private getCommands(message: Message) {
    const prefix = message.guild!.get("prefix");
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("Commands listed by category")
      .setFooter(
        `You can say ${prefix}help <command name> for more information about that specific command`
      );

    const commands = MyBot.commands.reduce<CommandReducer[]>((acc, val) => {
      const idx = acc.findIndex(cmd => cmd.category === val.config.category);

      idx > -1
        ? acc[idx].commands.push(val)
        : acc.push({ category: val.config.category, commands: [val] });

      return acc;
    }, []);

    commands.forEach(entry => {
      embed.addField(
        `${entry.category} (${entry.commands.length})`,
        entry.commands.map(cmd => `\`${cmd.name}\``).join(", ")
      );
    });

    message.channel.send(embed);
  }

  private entries<T, K extends keyof T, V extends T[K]>(obj: T) {
    return Object.entries(obj) as [K, V][];
  }
}
