import React from "react";
import { ChakraProvider, Box, Flex, Stack } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Nav } from "./components/Nav/Nav";
import { MatchDetails } from "./pages/matches/MatchDetails/MatchDetails";
import { MatchList } from "./pages/matches/MatchList/MatchList";
import { GroupList } from "./pages/groups/GroupList/GroupList";
import { Player } from "./pages/players/PlayerList/Player";
import { PlayerList } from "./pages/players/PlayerList/PlayerList";
import {
  PlayerSearch,
  PlayerSearchResults,
} from "./pages/players/PlayerSearch";
import { ServerList } from "./pages/servers/ServerList/ServerList";
import { LeaderList } from "./pages/leaders/LeaderList/LeaderList";
import { EventList } from "./pages/events/EventList";
import { HealthSheet } from "./pages/health/HealthSheet"
import { ClientStats } from "./pages/clientstats/ClientStats";
import { InformationPage } from "./pages/info/Information";
import { MapsPage } from "./pages/maps/Maps";
import OnDemand from "./pages/ondemand/OnDemand";
import { AdminPage } from "./pages/admin";
import RegionTypeState from "./context/RegionTypeState";
import FrontPage from "./pages/frontpage/FrontPage";

import theme from "./theme";

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <RegionTypeState>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Stack
              direction={["column", "row"]}
              w="100%"
              spacing={["4px", "12px"]}
              p={"10px"}
            >
              <Box w={["100%", "30%", "250px"]}>
                <Nav />
              </Box>
              <Box w={["100%", "70%", "calc(100% - 250px)"]}>
                <Flex justifyContent="flex-end">
                  <Box maxWidth={["100%", "350px"]} width="100%">
                    <PlayerSearch />
                  </Box>
                </Flex>
                <Switch>
                  <Route exact path="/">
                    <FrontPage />
                  </Route>{" "}
                  <Route exact path="/frontpage" component={FrontPage} />
                  <Route exact path="/matches" component={MatchList} />
                  <Route exact path="/groups" component={GroupList} />
                  <Route
                    path="/matches/server/:serverId"
                    component={MatchList}
                  />
                  <Route path="/matches/:matchId" component={MatchDetails} />
                  <Route path="/groups/:groupId" component={MatchDetails} />
                  <Route exact path="/players" component={PlayerList} />
                  <Route
                    exact
                    path="/search/:searchTerm"
                    component={PlayerSearchResults}
                  />
                  <Route path="/player/:playerId" component={Player} />
                  <Route exact path="/servers" component={ServerList} />
                  <Route exact path="/leaders" component={LeaderList} />
                  <Route exact path="/events" component={EventList} />
                  <Route exact path="/health" component={HealthSheet} />
                  <Route exact path="/maps" component={MapsPage} />
                  <Route exact path="/info" component={InformationPage} />
                  <Route exact path="/clientstats" component={ClientStats} />
                  <Route exact path="/serverondemand" component={OnDemand} />
                  <Route path="/admin" component={AdminPage} />
                </Switch>
              </Box>
            </Stack>
          </BrowserRouter>
        </QueryClientProvider>
      </RegionTypeState>
    </ChakraProvider>
  );
};
