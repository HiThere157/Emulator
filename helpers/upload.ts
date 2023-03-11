function makeFileName(friendlyName: string, extension: string) {
  return `${friendlyName.replace(/[^0-9a-zA-Z ]/g, "").replace(/ /g, "-")}.${extension}`;
}

function makeFriendlyName(fileName: string) {
  return fileName.replace(/-/g, " ").split(".")[0];
}

export { makeFileName, makeFriendlyName };
