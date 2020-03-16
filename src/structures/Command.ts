import { Message, PermissionResolvable } from "discord.js";

export type Category = "General" | "Moderation" | "Fun";

export interface CommandExecuteArgs {
  message: Message;
  args: string[];
}

interface CommandConfig {
  aliases?: string[];
  description: string;
  category: Category;
  args?: boolean;
  usage?: string;
  examples?: string[];
  clientPermissions?: PermissionResolvable[];
  userPermissions?: PermissionResolvable[];
}

interface CommandOptions {
  name: string;
  config: CommandConfig;
  execute({ ...args }: CommandExecuteArgs): unknown | Promise<unknown>;
}

export abstract class Command implements CommandOptions {
  name: string;

  constructor(public config: CommandConfig) {}

  abstract execute({ ...args }: CommandExecuteArgs): unknown | Promise<unknown>;
}
