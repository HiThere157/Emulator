type RomFile = {
  core: string;
  fileName: string;
};

type UploadedFile = {
  friendlyName: string;
  core: string;
  file: File;
};

type StateFile = {
  game: string;
  fileName: string;
};

type State = {
  game: string;
  slot: number;
  data: Blob;
};
