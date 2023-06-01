const fs = require("fs");
const { parse } = require("node-html-parser");

const args = JSON.parse(
  fs.readFileSync("./script-transpiler/args.json").toString()
);
let sefContents = "";

Object.keys(args).forEach((sefField) => {
  switch (sefField) {
    case "insert_external":
      let bridgePage = "";

      if (args[sefField] != null) {
        const htmlDoc = parse(fs.readFileSync(args[sefField]).toString());

        bridgePage = htmlDoc
          .querySelector("body")
          .innerHTML.toString()
          .replaceAll("  ", "");
      }

      sefContents += `[${sefField}]\n${bridgePage}\n`;

      break;
    case "insert_command":
    case "insert_hook":
    case "insert_script":
    case "insert_over":
      let fileContents = "";

      if (args[sefField] != null)
        fileContents = fs.readFileSync(args[sefField]).toString();

      sefContents += `[${sefField}]\n${fileContents}\n`;
      break;
    default: {
      sefContents += `[${sefField}]\n${
        args[sefField] != null ? args[sefField] : ""
      }\n`;
      break;
    }
  }
});

fs.writeFileSync("./script-transpiler/Voicemod.sef", sefContents);
