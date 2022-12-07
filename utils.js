let childProcess = require("child_process");
const path = require("path");

function execShellCommand(command) {
  return new Promise((resolve) => {
    childProcess.exec(
      command,
      { encoding: "utf8", maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? stdout : stderr);
      }
    );
  });
}

function execShellCommandCWD(command, workingdirectory) {
  return new Promise((resolve) => {
    childProcess.exec(
      command,
      {
        encoding: "utf8",
        maxBuffer: 1024 * 1024,
        cwd: workingdirectory
      },
      (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? stdout : stderr);
      }
    );
  });
}

async function runSFDXCommand(command) {
  console.log(command);
  var commandOutput = await execShellCommand(command);
  //console.log(commandOutput);
  return JSON.parse(commandOutput);
}

async function runSFDXCommandCWD(command, workingdirectory) {
  console.log("runSFDXCommandCWD->COMMAND->", command);
  console.log("runSFDXCommandCWD->CWD->", workingdirectory);
  var commandOutput = await execShellCommandCWD(command, workingdirectory);
  console.log(commandOutput);

  return JSON.parse(commandOutput);
}

module.exports = {
  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  runSFDXCommand: runSFDXCommand,
  runSFDXCommandCWD: runSFDXCommandCWD,
  deploySFDXMetadata: async (username, folder) => {
    //
    return await runSFDXCommand(
      `sfdx force:mdapi:deploy -u ${username} -d ${folder} -w -1 --json`
    );
  },
  deploySFDXForceSourceDeployCWD: async (
    username,
    metadata,
    workingdirectory
  ) => {
    //
    return await runSFDXCommandCWD(
      `sfdx force:source:deploy -u ${username} -m ${metadata} --json`,
      workingdirectory
    );
  },
  retrieveSFDXMetadata: async (username, metadata, targetfolder) => {
    //
    return await runSFDXCommand(
      `sfdx force:mdapi:retrieve -u ${username}  -m "${metadata}" -r ${targetfolder} -w -1 --json`
    );
  },
  runShellCommand: async (targetShell, username) => {
    //Make sure we can execute
    await runSFDXCommand(`chmod 777 ${targetShell}`);
    return await runSFDXCommand(`./${targetShell} ${username}`);
  }
};
