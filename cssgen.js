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
          let file = directory; // scss and css file will be name just like their containing folder
          let fileInDirectory = directory.indexOf("/") >= 0;

          let content = genFile(
            fileInDirectory
              ? `${dot}/${file}.scss`
              : `${dot}/${directory}/${file}.scss`
          ).css;

          for (const replacement of config[directory]) {
            content = content.replaceAll(replacement.from, replacement.to);
          }

          fs.writeFile(
            fileInDirectory
              ? `${dot}/${file}.css`
              : `${dot}/${directory}/${file}.css`,
            content,
            (err) => {
              if (err) throw err;
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

main();
