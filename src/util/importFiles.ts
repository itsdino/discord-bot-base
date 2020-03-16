import glob from "glob";
import { promisify } from "util";

interface Folders {
  events: string;
  commands: string;
  structures: string;
}

const globPromisified = promisify(glob);

export const importFiles = async ({
  events,
  commands,
  structures,
}: Folders) => {
  const [eventFiles, commandFiles, structureFiles] = await Promise.all([
    globPromisified(events),
    globPromisified(commands),
    globPromisified(structures),
  ]);

  return Promise.all(
    [...eventFiles, ...commandFiles, ...structureFiles].map(file =>
      import(file)
    )
  );
};
