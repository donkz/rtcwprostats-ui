import { AxiosInstance } from "axios";
import { pickData } from "../util";
import { ILeaderItem, IServersAPIParams } from "../types";

export const createLeadersApi = (agent: AxiosInstance) => {
  return {
    GetLeaders: async (params: IServersAPIParams) => {
      let category = params["queryKey"][1];
      let region = params["queryKey"][2];
      let match_type = params["queryKey"][3];
      let item_limit = params["queryKey"][4];
      let season = params["queryKey"][5];
      let item_limit_string = "";

      // TODO - Not sure what this is suppose to do atm
      category == null ? (category = "elo") : (category = category);
      season == null ? (season = "current") : (season = season);
      region == null ? (region = "na") : (region = region);
      match_type == null ? (match_type = "6") : (match_type = match_type);
      item_limit == null 
        ? (item_limit_string = "")
        : (item_limit_string = "/limit/" + item_limit);

      let api_url = `/leaders/${category}/region/${region}/type/${match_type}${item_limit_string}`;
      if (season != "current"){
        api_url = `/leadershist/season/${season}/category/${category}/region/${region}/type/${match_type}${item_limit_string}`;
      }

      return agent
        .get<ILeaderItem[]>(
          api_url
        )
        .then(pickData);
    },
  };
};

/*
https://rtcwproapi.donkanator.com/leaders/elo/region/na/type/6/limit/1
[
	{
		real_name: "john_mullins",
		value: 242,
		guid: "7d52b9640302f4d469211cc075ce5057",
		games: 127
	}
]
*/
