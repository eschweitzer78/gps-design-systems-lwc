class OaLogger {
  debugMode = false;
  constructor(debugMode) {
    this.debugMode = debugMode === "true" || debugMode === true ? true : false;
  }

  log(msg, ...details) {
    this.emitLogMessage("log", msg, details);
  }

  info(msg, ...details) {
    this.emitLogMessage("info", msg, details);
  }

  warn(msg, ...details) {
    this.emitLogMessage("warn", msg, details);
  }

  error(msg, ...details) {
    this.emitLogMessage("error", msg, details);
  }

  emitLogMessage(type, msg, details) {
    if (this.debugMode) {
      if (details.length > 0) {
        // eslint-disable-next-line no-console
        console[type](msg, ...details);
      } else {
        // eslint-disable-next-line no-console
        console[type](msg);
      }
    }
  }

  group(label) {
    if (this.debugMode) {
      // eslint-disable-next-line no-console
      console.group(label);
    }
  }

  groupEnd() {
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  time(label) {
    if (this.debugMode) {
      // eslint-disable-next-line no-console
      console.time(label);
    }
  }

  timeEnd(label) {
    if (this.debugMode) {
      // eslint-disable-next-line no-console
      console.timeEnd(label);
    }
  }
}

export { OaLogger };
