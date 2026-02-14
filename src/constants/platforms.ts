/**
 * IGDB Platform ID to Icon mapping
 * Reference: https://api-docs.igdb.com/#platform
 */

export type PlatformIconName =
  // PC
  | "windows"
  | "linux"
  | "mac"
  // PlayStation
  | "playstation"
  | "playstation2"
  | "playstation3"
  | "playstation4"
  | "playstation5"
  | "psp"
  | "psvita"
  // Xbox
  | "xbox"
  | "xbox360"
  | "xboxone"
  | "xboxseriesx"
  // Nintendo Consoles
  | "nintendo"
  | "nes"
  | "snes"
  | "n64"
  | "gamecube"
  | "wii"
  | "wiiu"
  | "switch"
  // Nintendo Handhelds
  | "gameboy"
  | "gameboycolor"
  | "gameboyadvance"
  | "ds"
  | "3ds"
  // Sega
  | "sega"
  | "genesis"
  | "dreamcast"
  | "saturn"
  | "gamegear"
  // Atari
  | "atari"
  | "atari2600"
  | "atari7800"
  | "atarijaguar"
  | "atarilynx"
  // Mobile
  | "android"
  | "ios"
  // Other
  | "stadia"
  | "meta"
  | "ouya"
  | "gamepad";

export const PLATFORM_ICONS: Record<number, PlatformIconName> = {
  // PC/Mac
  3: "linux",
  6: "windows",
  14: "mac",
  13: "windows", // DOS

  // PlayStation
  7: "playstation", // PlayStation
  8: "playstation2", // PlayStation 2
  9: "playstation3", // PlayStation 3
  48: "playstation4", // PlayStation 4
  167: "playstation5", // PlayStation 5
  38: "psp", // PlayStation Portable
  46: "psvita", // PlayStation Vita
  165: "playstation4", // PlayStation VR (on PS4)
  390: "playstation5", // PlayStation VR2 (on PS5)

  // Xbox
  11: "xbox", // Xbox
  12: "xbox360", // Xbox 360
  49: "xboxone", // Xbox One
  169: "xboxseriesx", // Xbox Series X|S

  // Nintendo Consoles
  18: "nes", // NES
  19: "snes", // SNES
  4: "n64", // Nintendo 64
  21: "gamecube", // GameCube
  5: "wii", // Wii
  41: "wiiu", // Wii U
  130: "switch", // Nintendo Switch

  // Nintendo Handhelds
  33: "gameboyadvance", // Game Boy Advance
  22: "gameboy", // Game Boy
  24: "gameboycolor", // Game Boy Color
  20: "ds", // Nintendo DS
  159: "ds", // Nintendo DSi
  37: "3ds", // Nintendo 3DS
  137: "3ds", // New Nintendo 3DS

  // Sega
  29: "genesis", // Sega Genesis/Mega Drive
  30: "genesis", // Sega 32X
  32: "saturn", // Sega Saturn
  23: "dreamcast", // Dreamcast
  64: "sega", // Sega Master System
  78: "genesis", // Sega CD
  84: "gamegear", // Sega Game Gear

  // Atari
  59: "atari2600", // Atari 2600
  60: "atari7800", // Atari 7800
  62: "atarijaguar", // Atari Jaguar
  61: "atarilynx", // Atari Lynx
  65: "atari", // Atari ST/STE

  // Mobile
  34: "android", // Android
  39: "ios", // iOS

  // Other
  163: "stadia", // Google Stadia
  471: "meta", // Meta Quest 2
  162: "ouya", // Ouya
};

export const getPlatformIcon = (platformId: number): PlatformIconName => {
  return PLATFORM_ICONS[platformId] || "gamepad";
};

interface Platform {
  id: number;
  name?: string;
}

export const getUniquePlatformIcons = (
  platforms: Platform[] | undefined,
): PlatformIconName[] => {
  if (!platforms || platforms.length === 0) return [];

  const icons = platforms
    .map((p) => getPlatformIcon(p.id))
    .filter((icon, index, self) => self.indexOf(icon) === index);

  return icons;
};
