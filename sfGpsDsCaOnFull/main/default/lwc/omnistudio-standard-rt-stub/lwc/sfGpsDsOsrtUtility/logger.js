class logger {
  constructor() {
    if (!logger.instance) {
      logger.instance = this;
    }
    return logger.instance;
  }

  // eslint-disable-next-line @lwc/lwc/no-rest-parameter
  log(...args) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  // eslint-disable-next-line @lwc/lwc/no-rest-parameter
  warn(...args) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }

  // eslint-disable-next-line @lwc/lwc/no-rest-parameter
  error(...args) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
}

// ensure Singleton
const Logger = new logger();
Object.freeze(Logger);

export default Logger;
