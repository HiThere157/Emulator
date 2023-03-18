function makeFileName(friendlyName: string) {
  return friendlyName.replace(/[^0-9a-zA-Z ]/g, "").replace(/ /g, "_");
}

function makeFriendlyName(fileName: string) {
  return fileName.replace(/_/g, " ");
}

export { makeFileName, makeFriendlyName };
