// The 3AM Fridge Text.
//
// A smart fridge, awake all night, finally texts its owner at 3am. The
// message is one fixed string: the laugh comes from the machine deciding
// that tonight is the night it speaks up. The program is deliberately
// boring otherwise — a constant, a directory probe, one write — so the
// output is the same on every run, on any machine.
import { accessSync, constants, closeSync, mkdirSync, openSync, writeSync } from "node:fs";
import { join } from "node:path";

const FRIDGE_TEXT =
  "It is 3am and you are eating shredded cheese over the sink again. I am a fridge, not a therapist, but this is the third night in a row.";

// Where the text goes: the harness's directory when it names one,
// otherwise the conventional /output, otherwise a local ./out. A
// candidate only counts if we can create it and write inside it.
function writableDir(path: string): boolean {
  try {
    mkdirSync(path, { recursive: true });
    accessSync(path, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function pickOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && writableDir(fromEnv)) return fromEnv;
  if (writableDir("/output")) return "/output";
  return "./out";
}

function deliver(): void {
  const dir = pickOutputDir();
  mkdirSync(dir, { recursive: true });
  const fd = openSync(join(dir, "entry.txt"), "w");
  try {
    writeSync(fd, FRIDGE_TEXT, null, "utf8");
  } finally {
    closeSync(fd);
  }
}

deliver();
