export const PLATFORM_NAME_MAP: Record<string, string> = {
  "PC (Microsoft Windows)": "PC",
  "PlayStation 4": "PS4",
  "PlayStation 5": "PS5",
  "Xbox One": "XB1",
  "Xbox Series X|S": "XSX",
  "Nintendo GameCube": "GameCube",
};

export const formatPlatformName = (name: string) =>
  PLATFORM_NAME_MAP[name] ?? name;
