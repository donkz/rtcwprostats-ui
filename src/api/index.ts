import axios from "axios";
import { API_BASE_URL } from "../constants";
import { createMatchesApi } from "./matches";
import { createPlayersApi } from "./players";
import { createServersApi } from "./servers";
import { createLeadersApi } from "./leaders";
import { createGroupsApi } from "./groups";
import { createEventsApi } from "./events";
import { createSeasonsApi } from "./seasons";
import { createMapsApi } from "./maps";
import { createAdminApi } from "./admin";
import { createPredictionsApi } from "./predictions";


const createStatsApi = () => {
  const agent = axios.create({ baseURL: API_BASE_URL });

  return {
    Matches: createMatchesApi(agent),
    Players: createPlayersApi(agent),
    Servers: createServersApi(agent),
    Leaders: createLeadersApi(agent),
    Groups: createGroupsApi(agent),
    Events: createEventsApi(agent),
    Seasons: createSeasonsApi(agent),
    Maps: createMapsApi(agent),
    Admin: createAdminApi(agent),
    Predictions: createPredictionsApi(agent),
  };
};

export const StatsApi = createStatsApi();
