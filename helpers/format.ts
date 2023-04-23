function formatBytes(bytes: number) {
  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let i = 0;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toLocaleString(undefined, { maximumFractionDigits: 2, useGrouping: false })} ${
    units[i]
  }`;
}

export { formatBytes };
