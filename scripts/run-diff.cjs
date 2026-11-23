const { execFileSync } = require("node:child_process");
const { mkdtemp, readFile, rm, rmdir, writeFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const { basename, join, resolve } = require("node:path");

async function previewDiff(example, transform) {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    throw new Error(`Укажи один файл. Пример: ${example}`);
  }

  const filepath = resolve(args[0]);
  const source = await readFile(filepath, "utf8");
  const proposed = await transform(source, filepath);

  const tempDir = await mkdtemp(join(tmpdir(), "omnidiff-preview-"));
  const preview = join(tempDir, basename(filepath));
  try {
    await writeFile(preview, proposed, "utf8");
    execFileSync("omnidiff", ["--full", filepath, preview], {
      stdio: "inherit"
    });
  } finally {
    await rm(preview, { force: true });
    await rmdir(tempDir);
  }
}

module.exports = function runDiff(example, transform) {
  previewDiff(example, transform).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
};
