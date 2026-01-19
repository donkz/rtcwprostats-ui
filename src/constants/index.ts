import naSrc from "../assets/usa-flag.svg";
import euSrc from "../assets/eu-flag.svg";
import saSrc from "../assets/sa-flag.svg";
import unkSrc from "../assets/unk-flag.svg";

import frostbiteSrc from "../assets/maps/te_frostbite.png";
import beachSrc from "../assets/maps/mp_beach.png";
import iceSrc from "../assets/maps/mp_ice.png";
import ufoSrc from "../assets/maps/te_ufo.png";
import subSrc from "../assets/maps/mp_sub.png";
import escapeSrc from "../assets/maps/te_escape2.avif";
import cipherSrc from "../assets/maps/te_cipher_b5.avif";
import villageSrc from "../assets/maps/mp_village.avif";
import adlernestSrc from "../assets/maps/te_adlernest_b1.avif";
import baseSrc from "../assets/maps/mp_base.avif";
import tram2Src from "../assets/maps/tram2_b5.avif";

import discordSrc from "../assets/Discord-Symbol-Blurple.svg";
import facebookSrc from "../assets/Facebook_Logo_Primary.png";
import internetSrc from "../assets/network-internet-web-svgrepo-com.svg";

import { AiOutlineTrophy } from "react-icons/ai";
import { GiRocket, GiMedicalPack, GiCrosshair, GiRank3, GiMineExplosion, GiCondorEmblem, GiSkullWithSyringe, GiGearHammer, GiStarSkull } from "react-icons/gi";
import { GoFileBinary, GoPulse } from "react-icons/go";
import { FaBinoculars, FaMountain, FaBell } from "react-icons/fa";
import { BsQuestion, BsBullseye  } from "react-icons/bs";
import {
  IoLogoGameControllerB,
  IoIosInformationCircleOutline,
} from "react-icons/io";
import { MdViewList } from "react-icons/md";
import { VscAccount, VscServer } from "react-icons/vsc";
import { MdMap, MdPlayArrow } from "react-icons/md";

export const COLORS = {
  background: "#12161D",
};

export const LAST_RECENT_PLAYERS_NUM = 50;

export const COUNTRY_IMAGE_SOURCES = {
  na: naSrc,
  eu: euSrc,
  unk: unkSrc,
  sa: saSrc,
};

export const MAP_SOURCES = {
  mp_beach: beachSrc,
  te_frostbite: frostbiteSrc,
  mp_ice: iceSrc,
  mp_sub: subSrc,
  te_ufo: ufoSrc,
  te_escape2: escapeSrc,
  te_cipher_b5: cipherSrc,
  mp_village: villageSrc,
  te_adlernest_b1: adlernestSrc,
  mp_base: baseSrc,
  tram2_b5: tram2Src
};

export const BRAND_ICONS = {
  discord_logo: discordSrc,
  facebook_logo: facebookSrc,
  internet_logo: internetSrc
};

interface MapInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: "objective" | "destroy";
  players: string;
  pace: "slow" | "medium" | "fast";
}

export const MAPS_DATA: MapInfo[] = [
  {
    id: "mp_beach",
    name: "mp_beach",
    displayName: "Beach",
    description: "A coastal assault map featuring a beach landing with bunkers and coastal defenses. Players must navigate the shoreline while avoiding enemy fire from fortified positions.",
    type: "objective",
    players: "6v6",
    pace: "medium"
  },
  {
    id: "mp_ice",
    name: "mp_ice",
    displayName: "Ice",
    description: "A frozen landscape with ice caves and snow-covered terrain. The map features tight corridors and open areas with limited visibility due to snow conditions.",
    type: "objective",
    players: "6v6",
    pace: "slow"
  },
  {
    id: "mp_sub",
    name: "mp_sub",
    displayName: "Submarine",
    description: "A submarine base map with tight corridors and multiple levels. Players navigate through the submarine's interior with limited space and strategic chokepoints.",
    type: "destroy",
    players: "6v6",
    pace: "fast"
  },
  {
    id: "te_frostbite",
    name: "te_frostbite",
    displayName: "Frostbite",
    description: "A team elimination map set in an arctic environment. Features open areas and cover points for tactical team-based combat.",
    type: "objective",
    players: "3v3",
    pace: "fast"
  },
  {
    id: "te_ufo",
    name: "te_ufo",
    displayName: "UFO",
    description: "A unique team elimination map with alien architecture and technology. Features multiple levels and strategic positions for team combat.",
    type: "objective",
    players: "6v6",
    pace: "slow"
  }
];

export const REGIONS = [
  { id: "na", name: "NA", longName: "North America" },
  { id: "eu", name: "EU", longName: "Europe" },
  { id: "sa", name: "SA", longName: "South America" },
];

export const GAME_TYPES = [
  { id: "3", name: "3v3" },
  { id: "6", name: "6v6" },
];

export const CATEGORIES = [
  { id: "elo", name: "ELO" },
  { id: "kdr", name: "KDR" },
  { id: "acc", name: "ACC" },
  { id: "Killpeak", name: "KILLPEAK" },
  { id: "Longest Kill", name: "LONGEST KILL" },
  { id: "MegaKill", name: "MEGAKILL" },
  { id: "Kills Per Game", name: "KILLS/GAME" },
  { id: "Combat Medic", name: "COMBAT MEDIC" },
  { id: "Combat Engineer", name: "COMBAT ENGINEER" },
  { id: "Lieutenant Colonel", name: "LIEUTENANT COLONEL" },
  { id: "Sharpshooter", name: "SHARPSHOOTER" },
  { id: "Caps per Game", name: "Caps per Game" },
  { id: "Caps per Taken", name: "Caps per Taken" },
  { id: "HS Ratio", name: "HS Ratio" },
];

export const NAV_LINKS = [
  { id: "frontpage", name: "Front Page", component: BsBullseye },
  { id: "leaders", name: "Leaders", component: AiOutlineTrophy },
  { id: "players", name: "Players", component: VscAccount },
  { id: "matches", name: "Matches", component: IoLogoGameControllerB },
  { id: "groups", name: "Groups", component: MdViewList },
  { id: "servers", name: "Servers", component: VscServer },
  { id: "maps", name: "Maps", component: MdMap },
  { id: "health", name: "Activity", component: GoPulse },
  { id: "events", name: "Events", component: FaBell },
  { id: "info", name: "Info", component: IoIosInformationCircleOutline },
  { id: "clientstats", name: "Client Stats", component: GoFileBinary },
  { id: "serverondemand", name: "On Demand", component: MdPlayArrow },
];

export const CLASS_ICONS: Record<string, any> = {
   "Sniper": GiCrosshair,
   "LT": GiRank3,
   "Medic": GiMedicalPack,
   "Panzer": GiRocket,
   "Mixed": BsQuestion,
   "Unknown": BsQuestion
};

export const ACHIEVEMENT_DESCRIPTIONS: Record<string, any> = {
  "Killpeak": { description: "Kills achieved during one life.", icon: FaMountain, degrees: [8,10,12] },
  "Longest Kill": { description: "Farthest kill by distance between a killer and a victim.", icon: FaBinoculars, degrees: [3000,4000,5000] },
  "MegaKill": { description: "Number of kills in a 6s period.", icon: GiMineExplosion, degrees: [4,5,6] },
  "Kills Per Game": { description: "Number of kills in a AB match.", icon: GiCondorEmblem, degrees: [20,26,32] },
  "Combat Medic": { description: "Outstanding achievement in kills+gibs+revives.", icon: GiSkullWithSyringe, degrees: [5,6,7] },
  "Combat Engineer": { description: "Outstanding achievement in plants+kills+objectives.", icon: GiGearHammer, degrees: [5,6,7] },
  "Lieutenant Colonel": { description: "Outstanding achievement in kills+airsupport+ammo given.", icon: GiStarSkull, degrees: [5,6,7] },
};

export const STAT_KEYS: Record<string, string> = {
  kills: "Kills",
  killpeak: "Kill Peak",
  gibs: "Gibs",
  obj_returned: "Objective Returned",
  accuracy: "Accuracy",
  obj_captured: "Objective Captured",
  damageteam: "Team Damage",
  knifekills: "Knife Kills",
  score: "Score",
  headshots: "Headshots",
  healthgiven: "Health Given",
  dyn_planted: "Dynamite Planted",
  games: "Games Played",
  damagegiven: "Damage Given",
  dyn_defused: "Dynamite Defused",
  deaths: "Total Deaths",
  obj_taken: "Objective Taken",
  efficiency: "Efficiency",
  poisoned: "Poisoned",
  revives: "Revives",
  hits: "Shots hit",
  teamkills: "Team kills",
  ammogiven: "Ammo Given",
  suicides: "Suicides",
  damagereceived: "Damage Received",
  shots: "Shots Fired",
  obj_destroyed: "Objective Destroyed",
  time_played: "Time Played",
};

export const AWARD_DESCRIPTIONS: Record<string, string> = {
  "Best Engineer": "Most plants + defuses",
  "Best Medic": "Most revives + packs/4",
  "Confirmed Kill": "Most gibs",
  "Frag Stealer": "Least DMG per frag",
  "Frontliner": "First kill(2pt)/death(1pt) in a round",
  "Internal Enemy": "Most TKs",
  "Killer": "Most kills",
  "Longest Kill": "Longest kill by distance",
  "Sharpshooter": "Highest headshot/hits ratio",
  "Man of Steel": "Most DMR per death",
  "MegaKill": "Most kills in 6 seconds",
  "Slow Bleeder": "Most DMG per frag",
  "Terminator": "Highest KDR",
  "Chicken": "Dying while not looking at the enemy (avg degrees)",
  "Backstabber": "Killing while enemy is looking the other way (avg degrees)",
  "Melon Farmer": "Most headshots",
  "On a Mission": "Objective taken + destroyed + captured*2",
  "Standard bearer": "Flag captures and returns",
  "Bounty Hunter": "Objective returns",
  "Weary Traveler": "Most distance covered",
  "Pisa incarnate": "Most time spent leaning",
  "Slav squat": "Most time spent crouching",
  "Gollum": "Most time holding objective",
  "Press W": "Least distance travelled in invincibility"
};

export const SET_REGION = "SET_REGION";
export const SET_GAMETYPE = "SET_GAMETYPE";

export const API_BASE_URL = "https://rtcwproapi.donkanator.com";
