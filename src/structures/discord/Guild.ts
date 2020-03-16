import { Client, Structures } from "discord.js";
import { Guild as GuildEntity } from "../../entity/Guild";

type GuildOptions = Pick<GuildEntity, "isCached" | "prefix">;

declare module "discord.js" {
  interface Guild {
    get<K extends keyof GuildOptions>(key: K): GuildOptions[K];
    set<K extends keyof GuildOptions, V = GuildOptions[K]>(
      key: K,
      value: V
    ): Promise<void>;
  }
}

const defaultOptions: GuildOptions = {
  isCached: false,
  prefix: process.env.PREFIX!,
};

export = Structures.extend(
  "Guild",
  Guild =>
    class extends Guild {
      private options: GuildOptions;

      constructor(client: Client, data: object) {
        super(client, data);

        this.init();
      }

      private async init() {
        this.options = (await GuildEntity.findOne(this.id)) ?? {
          ...defaultOptions,
        };
      }

      get<K extends keyof GuildOptions>(key: K) {
        return this.options[key];
      }

      async set<K extends keyof GuildOptions, V = GuildOptions[K]>(
        key: K,
        value: V
      ) {
        if (this.options.isCached) {
          await GuildEntity.update(this.id, { [key]: value });
        } else {
          await GuildEntity.insert({
            ...this.options,
            id: this.id,
            isCached: true,
            [key]: value,
          });
        }

        this.options = {
          ...this.options,
          isCached: true,
          [key]: value,
        };
      }
    }
);
