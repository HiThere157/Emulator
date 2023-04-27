type RomFileCR = {
  name: string;
  core: string;
  image: string;
  image_resolution: string;
};

type RomFile = RomFileCR & {
  id: number;
  uploaded_by: number;
  size: number;
};
