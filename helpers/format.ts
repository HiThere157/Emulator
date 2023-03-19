function getRomFileName(friendlyName: string) {
  return friendlyName.replace(/[^0-9a-zA-Z ]/g, "").replace(/ /g, "_");
}

function getRomFriendlyName(fileName: string) {
  return fileName.replace(/_/g, " ");
}

function getStateFileName(meta: StateFileMeta) {
  const [date, rawTime] = meta.date.toISOString().split("T");
  const parsedTime = rawTime.replace(/:/g, "-").split(".")[0];
  return `${date}_${parsedTime}_${meta.identifier}`;
}

function getStateFileMeta(fileName: string): StateFileMeta {
  const [date, time, identifier] = fileName.split("_");

  return {
    date: new Date(`${date}T${time.replace(/-/g, ":")}Z`),
    identifier,
  };
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

export { getRomFileName, getRomFriendlyName, getStateFileName, getStateFileMeta, formatFileSize };
