const cores: { [key: string]: string } = {
  nes: "NES",
  n64: "Nintendo 64",
  nds: "Nintendo DS",
};

const sortTypes: { [key: string]: string } = {
  platform: "Platform",
  "name-asc": "Name (A → Z)",
  "name-desc": "Name (Z → A)",
  recent: "Recently Added",
};

const resolutions: string[] = ["200x275", "300x200", "260x230"];

export { cores, sortTypes, resolutions };
