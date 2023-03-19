function format(message: string, level: string) {
  const date = new Date();
  return `${date.toISOString()} | ${level.toUpperCase()}: ${message}`;
}

function info(message: string) {
  console.info(format(message, "info"));
}

function warn(message: string) {
  console.warn(format(message, "warn"));
}

function error(message: string) {
  console.error(format(message, "error"));
}

export { info, warn, error };
