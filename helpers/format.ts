function makeRomFileName(friendlyName: string) {
  return friendlyName.replace(/[^0-9a-zA-Z ]/g, "").replace(/ /g, "_");
}

function makeRomFriendlyName(fileName: string) {
  return fileName.replace(/_/g, " ");
}

function makeStateFileName(date: Date) {
  return date.toISOString().replace("T", "_").replace(/:/g, "-").split(".")[0];
}

function makeStateFriendlyName(fileName: string) {
  const [date, time] = fileName.split("_");
  return new Date(`${date}T${time.replace(/-/g, ":")}`);
}

function formatFileSize(bytes: number) {
  const units = ["bytes", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let i = 0;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${units[i]}`;
}

export {
  makeRomFileName,
  makeRomFriendlyName,
  makeStateFileName,
  makeStateFriendlyName,
  formatFileSize,
};
