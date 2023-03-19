type RomFile = {
  core: string;
  fileName: string;
  size: number;
};

type UploadedFile = {
  friendlyName: string;
  core: string;
  file: File;
};

type StateFile = {
  game: string;
  fileName: string;
  size: number;
};

type State = {
  game: string;
  slot: string;
  data: Uint8Array;
};
