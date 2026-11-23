const prettier = require("prettier");
const runDiff = require("./run-diff.cjs");

runDiff("npm run diff:prettier -- index.html", async (source, filepath) => {
  const config = await prettier.resolveConfig(filepath, { editorconfig: true });
  return prettier.format(source, { ...config, filepath });
});
