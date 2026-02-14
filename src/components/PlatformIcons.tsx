import { getUniquePlatformIcons } from "../constants/platforms";
import type { PlatformIconName } from "../constants/platforms";
import type { IconType } from "react-icons";
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaAndroid,
  FaGamepad,
  FaLinux,
} from "react-icons/fa";
import {
  SiNintendoswitch,
  SiNintendo3Ds,
  SiNintendogamecube,
  SiWii,
  SiSega,
  SiAtari,
} from "react-icons/si";
import { TbDeviceNintendo, TbDeviceGamepad2 } from "react-icons/tb";

const ICON_COMPONENTS: Record<PlatformIconName, IconType> = {
  // PC
  windows: FaWindows,
  linux: FaLinux,
  apple: FaApple,

  // PlayStation (all gens use same icon, but could differentiate if needed)
  playstation: FaPlaystation,
  playstation2: FaPlaystation,
  playstation3: FaPlaystation,
  playstation4: FaPlaystation,
  playstation5: FaPlaystation,
  psp: FaPlaystation,
  psvita: FaPlaystation,

  // Xbox (all gens)
  xbox: FaXbox,
  xbox360: FaXbox,
  xboxone: FaXbox,
  xboxseriesx: FaXbox,

  // Nintendo Consoles
  nintendo: TbDeviceNintendo,
  nes: TbDeviceNintendo,
  snes: TbDeviceNintendo,
  n64: TbDeviceNintendo,
  gamecube: SiNintendogamecube,
  wii: SiWii,
  wiiu: SiWii,
  switch: SiNintendoswitch,

  // Nintendo Handhelds
  gameboy: TbDeviceGamepad2,
  gameboycolor: TbDeviceGamepad2,
  gameboyadvance: TbDeviceGamepad2,
  ds: SiNintendo3Ds,
  "3ds": SiNintendo3Ds,

  // Sega
  sega: SiSega,
  genesis: SiSega,
  dreamcast: SiSega,
  saturn: SiSega,
  gamegear: SiSega,

  // Atari
  atari: SiAtari,
  atari2600: SiAtari,
  atari7800: SiAtari,
  atarijaguar: SiAtari,
  atarilynx: SiAtari,

  // Mobile
  android: FaAndroid,
  ios: FaApple,

  // Other
  stadia: FaGamepad,
  meta: FaGamepad,
  ouya: FaGamepad,

  // Default fallback
  gamepad: FaGamepad,
};

interface Platform {
  id: number;
  name?: string;
}

interface PlatformIconsProps {
  platforms: Platform[];
  size?: number;
  className?: string;
}

export function PlatformIcons({
  platforms,
  size = 16,
  className = "",
}: PlatformIconsProps) {
  const icons = getUniquePlatformIcons(platforms);

  return (
    <div className={`flex gap-2 ${className}`}>
      {icons.map((iconName, index) => {
        const Icon = ICON_COMPONENTS[iconName];
        return <Icon key={`${iconName}-${index}`} size={size} />;
      })}
    </div>
  );
}
