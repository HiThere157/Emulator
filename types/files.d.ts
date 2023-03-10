type FileProps = {
  core: string;
  fileName: string;
};

type RomFile = {
  friendlyName: string;
  core: string;
  fileName: string;
};

type RomFileChange = {
  core: string;
  targetCore: string;
  fileName: string;
};

type UploadedFile = {
  friendlyName: string;
  core: string;
  file: File;
};
