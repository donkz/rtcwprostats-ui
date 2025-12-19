import { AxiosInstance } from "axios";
import { pickData } from "../util";
import { IMapsAllItem, IPlayerMapRate } from "../types";

export const createMapsApi = (agent: AxiosInstance) => {
  return {
    GetAllMapStats: async (region: string, gametype: string) => {
      return agent.get<IMapsAllItem[]>(`/mapstats/region/${region}/type/${gametype}/all`).then(pickData);
    },
    GetPlayerMapRates: async (playerId: string, region: string, gametype: string) => {
      return agent.get<IPlayerMapRate[]>(`/mapstats/region/${region}/type/${gametype}/player/${playerId}`).then(pickData);
      // return [
      // {
      //   "map": "te_frostbite",
      //   "wins": 101,
      //   "draws": 7,
      //   "losses": 109,
      //   "total_duration": 135967,
      //   "games": 217
      // },
      // {
      //   "map": "mp_beach",
      //   "wins": 68,
      //   "draws": 12,
      //   "losses": 46,
      //   "total_duration": 135967,
      //   "games": 126
      // },
      // {
      //   "map": "mp_peach",
      //   "wins": 0,
      //   "draws": 0,
      //   "losses": 0,
      //   "total_duration": 135967,
      //   "games": 0
      // }];
    }
  };
};
