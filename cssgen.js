let fs = require("fs").promises;
let path = require("path");
let sass = require("sass");
const fileRegEx = /!/;

function genFile(filename) {
  return sass.compile(filename, {
    style: "compressed",
    loadPaths: ["./"]
  });
}

async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile() && d.name === ".cssgen.json") yield entry;
  }
}

async function main() {
  for await (const p of walk(".")) {
    console.log(`handling ${p}`);

    fs.readFile(p)
      .then((data) => {
        let dot = path.dirname(p);
        let config = JSON.parse(data);

        console.log(`dot ${dot}`);

        for (const directory in config) {
          console.log(`Looking at directory ${directory}`);
          let hasStar = directory.endsWith("*");
          let file = hasStar ? directory.slice(0, -1) : directory; // scss and css file will be name just like their containing folder
          let fileInDirectory = directory.indexOf("/") >= 0;

          let content = genFile(
            fileInDirectory
              ? `${dot}/${file}.scss`
              : `${dot}/${directory}/${file}.scss`
          ).css;

          for (const replacement of config[directory]) {
            let regexFrom = new RegExp(replacement.from, "gm");
            content = content.replaceAll(regexFrom, replacement.to);
          }

          fs.writeFile(
            fileInDirectory
              ? `${dot}/${file}${hasStar ? "" : ".gen"}.css`
              : `${dot}/${directory}/${file}${hasStar ? "" : ".gen"}.css`,
            content,
            (err) => {
              if (err) throw err;
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  }
}

main();
