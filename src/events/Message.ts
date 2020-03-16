import { stripIndents } from "common-tags";
import {
  DMChannel,
  GuildMember,
  Message,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import { event } from "../decorators/event";
import { Event } from "../structures/Event";
import { MyBot } from "../structures/MyBot";
import { logger } from "../util/logger";

@event("message")
export class MessageEvent extends Event {
  run = async (message: Message) => {
    if (message.author.bot || !message.guild) {
      return;
    }

    const prefix = message.guild.get("prefix");

    if (
      message.mentions.has(message.client.user!) &&
      message.content.includes("help")
    ) {
      return message.reply(stripIndents`
        the current prefix is ${prefix}

        \`You can say ${prefix}help to get a list of all available commands\`
      `);
    }

    const [commandName, ...args] = message.content
      .slice(prefix.length)
      .split(/ +/);

    const command = MyBot.commands.find(
      ({ name, config }) =>
        name === commandName || config.aliases?.includes(commandName)
    );

    if (!command) {
      return;
    }

    const [client, member] = await Promise.all([
      message.guild.members.fetch(message.client.user!),
      message.guild.members.fetch(message.author),
    ]);

    const [clientPermissions, userPermissions] = [
      this.resolveMissingPermissions(
        message.channel,
        client,
        command.config.clientPermissions
      ),
      this.resolveMissingPermissions(
        message.channel,
        member,
        command.config.userPermissions
      ),
    ];

    if (clientPermissions.length || userPermissions.length) {
      return message.reply(stripIndents`
        ${
          clientPermissions.length
            ? "I am missing the following permission(s):"
            : ""
        }
        ${clientPermissions.length ? `\`${clientPermissions.join(", ")}\`` : ""}

        ${
          userPermissions.length
            ? "You are missing the following permission(s):"
            : ""
        }
        ${userPermissions.length ? `\`${userPermissions.join(", ")}\`` : ""}
      `);
    }

    if (command.config.args && !args.length) {
      return message.reply(stripIndents`
        no arguments were provided for this command. 
        
        \`The correct usage of this command is ${prefix}${command.name} ${command.config.usage}
        You can say ${prefix}help ${command.name} for more information about this command\`
      `);
    }

    try {
      // @ts-ignore
      if (typeof command.execute.then === "function") {
        await command.execute({ message, args });
      } else {
        command.execute({ message, args });
      }
    } catch (err) {
      logger.error(`Error executing ${command.name}: ${err}`);
    }
  };

  private resolveMissingPermissions(
    channel: TextChannel | DMChannel,
    member: GuildMember,
    requiredPermissions: PermissionResolvable[] = []
  ) {
    if (!(channel instanceof TextChannel)) {
      return [];
    }

    const permissions = channel.permissionsFor(member);

    if (!permissions) {
      return [];
    }

    return permissions.missing(requiredPermissions);
  }
}
