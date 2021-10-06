import React from "react";
import { ChakraProvider, Box, Flex, Stack } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Nav } from "./components/Nav/Nav";
import { MatchDetails } from "./pages/matches/MatchDetails/MatchDetails";
import { MatchList } from "./pages/matches/MatchList/MatchList";
import { Player } from "./pages/players/PlayerList/Player";
import { PlayerList } from "./pages/players/PlayerList/PlayerList";
import {
  PlayerSearch,
  PlayerSearchResults,
} from "./pages/players/PlayerSearch";
import { ServerList } from "./pages/servers/ServerList/ServerList";
import { LeaderList } from "./pages/leaders/LeaderList/LeaderList";
import RegionTypeState from "./context/RegionTypeState";

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
              <Box w={["100%", "70%", "100%"]}>
                <Flex justifyContent="flex-end">
                  <Box maxWidth={["100%", "350px"]} width="100%">
                    <PlayerSearch />
                  </Box>
                </Flex>
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/leaders" />
                  </Route>{" "}
                  <Route exact path="/matches" component={MatchList} />
                  <Route
                    path="/matches/server/:serverId"
                    component={MatchList}
                  />
                  <Route
                    path="/matches/:matchId/:map"
                    component={MatchDetails}
                  />
                  <Route exact path="/players" component={PlayerList} />
                  <Route
                    exact
                    path="/search/:searchTerm"
                    component={PlayerSearchResults}
                  />
                  <Route path="/player/:playerId" component={Player} />
                  <Route exact path="/servers" component={ServerList} />
                  <Route exact path="/leaders" component={LeaderList} />
                </Switch>
              </Box>
            </Stack>
          </BrowserRouter>
        </QueryClientProvider>
      </RegionTypeState>
    </ChakraProvider>
  );
};
