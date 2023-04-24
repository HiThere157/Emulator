type StateFile = {
  rom_id: number;
  slot: number;
  uploaded_by: number;
  size: number;
};

type State = {
  remote?: StateFile[];
  local?: StateFile[];
};
