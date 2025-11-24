import fs from "fs/promises";
import path from "path";
const fileRegEx = /!/;

function replaceFile(filename, replacements) {
  return new Promise((resolve) => {
    let regExes = [];

    for (const [searchFor, replaceTo] of Object.entries(replacements)) {
      console.log(`    replace ${searchFor} by ${replaceTo}`);
      regExes.push({
        regEx: new RegExp(searchFor, "gm"), // global and multiline
        replaceTo: replaceTo
      });
    }

    fs.readFile(filename, "utf8")
      .then((contents) => {
        regExes.forEach((entry) => {
          contents = contents.replace(entry.regEx, entry.replaceTo);
        });

        resolve(contents);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function* walk(dir) {
  for await (const d of await fs.opendir(dir)) {
    const entry = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile() && d.name === ".osfilegen.json") yield entry;
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

        for (const [directory, instructions] of Object.entries(config)) {
          console.log("> entry", directory);

          let targetDirectory = instructions.target.replace(
            fileRegEx,
            directory
          );
          delete instructions.target;

          //console.log(`Looking at directory ${directory}`);

          fs.mkdir(dot + "/" + targetDirectory, { recursive: true })
            .then(() => {
              for (const [file, replacements] of Object.entries(instructions)) {
                let targetFile = replacements.target || file; // by default keep filename
                delete replacements.target;

                console.log(
                  `  Looking at file ${directory}/${file} --> ${targetFile}`
                );

                let nFile = file.replace(fileRegEx, directory);
                let nTargetFile = targetFile.replace(fileRegEx, directory);

                replaceFile(dot + "/" + directory + "/" + nFile, replacements)
                  .then((content) => {
                    let lastIndex = targetFile.includes("/")
                      ? nTargetFile.lastIndexOf("/")
                      : -1;
                    if (lastIndex >= 0) {
                      let ndir =
                        dot +
                        "/" +
                        targetDirectory +
                        "/" +
                        nTargetFile.slice(0, lastIndex);
                      fs.mkdir(ndir, { recursive: true }).then(() => {
                        fs.writeFile(
                          dot + "/" + targetDirectory + "/" + nTargetFile,
                          content,
                          (err) => {
                            if (err) throw err;
                          }
                        );
                      });
                    } else {
                      fs.writeFile(
                        dot + "/" + targetDirectory + "/" + nTargetFile,
                        content,
                        (err) => {
                          if (err) throw err;
                        }
                      );
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });

          console.log("< entry", directory);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

main();
