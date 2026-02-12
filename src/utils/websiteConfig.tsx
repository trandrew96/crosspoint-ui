import type { IconType } from "react-icons";
import {
  FaGlobe,
  FaWikipediaW,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTwitch,
  FaDiscord,
  FaReddit,
  FaXbox,
} from "react-icons/fa";
import {
  SiSteam,
  SiEpicgames,
  SiGogdotcom,
  SiPlaystation,
  SiNintendoswitch,
  SiBox,
} from "react-icons/si";

export const WebsiteType = {
  OFFICIAL: 1,
  WIKIA: 2,
  WIKIPEDIA: 3,
  FACEBOOK: 4,
  TWITTER: 5,
  TWITCH: 6,
  INSTAGRAM: 8,
  YOUTUBE: 9,
  IPHONE: 10,
  IPAD: 11,
  ANDROID: 12,
  STEAM: 13,
  REDDIT: 14,
  ITCH: 15,
  EPIC_GAMES: 16,
  GOG: 17,
  DISCORD: 18,
  XBOX_MARKETPLACE: 22,
  PLAYSTATION_STORE: 23,
  NINTENDO_ESHOP: 24,
} as const;

export type WebsiteType = (typeof WebsiteType)[keyof typeof WebsiteType];

interface WebsiteConfig {
  icon: IconType;
  label: string;
  category: "social" | "store" | "info" | "other";
}

export const WEBSITE_CONFIG: Record<number, WebsiteConfig> = {
  [WebsiteType.OFFICIAL]: {
    icon: FaGlobe,
    label: "Official Website",
    category: "info",
  },
  [WebsiteType.WIKIA]: { icon: FaWikipediaW, label: "Wiki", category: "info" },
  [WebsiteType.WIKIPEDIA]: {
    icon: FaWikipediaW,
    label: "Wikipedia",
    category: "info",
  },
  [WebsiteType.FACEBOOK]: {
    icon: FaFacebook,
    label: "Facebook",
    category: "social",
  },
  [WebsiteType.TWITTER]: {
    icon: FaTwitter,
    label: "Twitter",
    category: "social",
  },
  [WebsiteType.TWITCH]: { icon: FaTwitch, label: "Twitch", category: "social" },
  [WebsiteType.INSTAGRAM]: {
    icon: FaInstagram,
    label: "Instagram",
    category: "social",
  },
  [WebsiteType.YOUTUBE]: {
    icon: FaYoutube,
    label: "YouTube",
    category: "social",
  },
  [WebsiteType.STEAM]: { icon: SiSteam, label: "Steam", category: "store" },
  [WebsiteType.REDDIT]: { icon: FaReddit, label: "Reddit", category: "social" },
  [WebsiteType.EPIC_GAMES]: {
    icon: SiEpicgames,
    label: "Epic Games",
    category: "store",
  },
  [WebsiteType.GOG]: { icon: SiGogdotcom, label: "GOG", category: "store" },
  [WebsiteType.DISCORD]: {
    icon: FaDiscord,
    label: "Discord",
    category: "social",
  },
  [WebsiteType.XBOX_MARKETPLACE]: {
    icon: FaXbox,
    label: "Xbox Store",
    category: "store",
  },
  [WebsiteType.PLAYSTATION_STORE]: {
    icon: SiPlaystation,
    label: "PlayStation Store",
    category: "store",
  },
  [WebsiteType.NINTENDO_ESHOP]: {
    icon: SiNintendoswitch,
    label: "Nintendo eShop",
    category: "store",
  },
};
