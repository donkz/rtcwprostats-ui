import { AxiosInstance, AxiosRequestConfig } from "axios";
import { pickData } from "../util";
import { IPredictionMatch, IPredictionResult, IPredictionRequest } from "../../types/predictions";

export const createPredictionsApi = (agent: AxiosInstance) => {
  return {
    getMatch: async (region: string, gametype: string, startDate: string) => {
      return agent
        .get<IPredictionMatch>(
          `/groups/region/${region}/type/${gametype}/startdate/${startDate}/limit/4`
        )
        .then(pickData);
    },

    submitPrediction: async (request: IPredictionRequest) => {
      const config: AxiosRequestConfig = {
        headers: {
          "x-api-key": "rtcwproapikeythatisjustforbasicauthorization",
        },
      };
      return agent
        .post<IPredictionResult>("/prediction/add", request, config)
        .then(pickData);
    },
  };
};
