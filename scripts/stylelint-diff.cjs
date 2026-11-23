const runDiff = require("./run-diff.cjs");

runDiff(
  "npm run diff:stylelint -- styles/style.css",
  async (source, filepath) => {
    const { default: stylelint } = await import("stylelint");
    const { code, report } = await stylelint.lint({
      code: source,
      codeFilename: filepath,
      fix: "strict",
      formatter: "string"
    });

    if (report?.trim()) {
      console.error(report.trim());
    }

    return code ?? source;
  }
);
