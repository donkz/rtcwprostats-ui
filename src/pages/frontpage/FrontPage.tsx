import React, { useState } from "react";
import { Flex, Box, Button } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { LeaderListContent } from "../leaders/LeaderList/LeaderListContent";
import { StatsApi } from "../../api";
import { ILeaderItem } from "../../api/types";
import { Loading } from "../../components/Loading";
import { ServerListContents } from "../servers/ServerList/ServerListContents";
import { IServerSimple } from "../../api/types";
import { IMatch } from "../../api/types";
import { MatchListContent } from "../matches/MatchList/MatchListContent";
import { BRAND_ICONS } from "../../constants";


const FrontPage: React.FC = () => {
  const [shouldLoadStats, setShouldLoadStats] = useState(false);

  const { isLoading: isLoadingNA, data: dataNA } = useQuery<ILeaderItem[]>(
    ["leaders", "elo", "na", "6", "20"],
    StatsApi.Leaders.GetLeaders,
    { enabled: shouldLoadStats }
  );
  const { isLoading: isLoadingEU, data: dataEU } = useQuery<ILeaderItem[]>(
    ["leaders", "elo", "eu", "6", "20"],
    StatsApi.Leaders.GetLeaders,
    { enabled: shouldLoadStats }
  );
  const { isLoading: isLoadingSA, data: dataSA } = useQuery<ILeaderItem[]>(
    ["leaders", "elo", "sa", "6", "20"],
    StatsApi.Leaders.GetLeaders,
    { enabled: shouldLoadStats }
  );
  const { isLoading: isLoadingServersNA, data: dataServersNA } = useQuery<IServerSimple[]>(
    ["server-detail", "na"],
    StatsApi.Servers.GetDetails,
    { enabled: shouldLoadStats }
  );
  const { isLoading: isLoadingServersEU, data: dataServersEU } = useQuery<IServerSimple[]>(
    ["server-detail", "eu"],
    StatsApi.Servers.GetDetails,
    { enabled: shouldLoadStats }
  );
  const { isLoading: isLoadingServersSA, data: dataServersSA } = useQuery<IServerSimple[]>(
    ["server-detail", "sa"],
    StatsApi.Servers.GetDetails,
    { enabled: shouldLoadStats }
  );
  
  const dataServersAll: IServerSimple[] = [
    ...(Array.isArray(dataServersNA) ? dataServersNA : []),
    ...(Array.isArray(dataServersEU) ? dataServersEU : []),
    ...(Array.isArray(dataServersSA) ? dataServersSA : [])
  ];
  
  const recentMatchDays = 7;
  const { isLoading: isLoadingMatches, data: dataMatchesRecent } = useQuery<IMatch[]>(
    ["matches-api", { days: recentMatchDays }],
    () => StatsApi.Matches.MatchRecentDays(7),
    { enabled: shouldLoadStats }
  );

  console.log(dataMatchesRecent);

  const handleLoadStats = () => {
    setShouldLoadStats(true);
  };

  // Show the button if stats haven't been loaded yet
  if (!shouldLoadStats) {
    return (
      <Box>
        {/* Welcome Banner */}
        <Box 
          color="white" 
          p={6} 
          textAlign="center"
          borderRadius="md"
          mb={8}
          boxShadow="lg"
        >
          <Box fontSize="2xl" fontWeight="bold" mb={3}>
            Welcome to competitive RTCW(Pro) community!
          </Box>
          <Box fontSize="md" mt={8} opacity={0.9} mx="auto" lineHeight="1.6">
             RTCWPro is a mod that helps connecting players across continents, adds competitive features, collects aggregated stats and implements modern technologies.
          </Box>
          <Flex justify="space-between" mt={8} alignItems="center">
            <Box textAlign="left">
               <Box mb={2}>
                 <img src={BRAND_ICONS.discord_logo} alt="Discord" style={{ width: '64px', height: '64px' }} />
               </Box>
            </Box>
            <Box textAlign="left" flex={1} ml={8}>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                  RTCW Pro (main)
                  <a href="https://discord.gg/vfWBwzTSBE" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                    Join Discord
                  </a>
              </Box>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>South/Latin America
              <a href="https://discord.gg/swJemVt" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                    Join Discord
                  </a>
              </Box>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                  RTCWMP (developers)
                  (ask to join)
              </Box>
              
            </Box>
            <Box textAlign="left">
               <Box mb={2}>
                 <img src={BRAND_ICONS.facebook_logo} alt="Facebook" style={{ width: '64px', height: '64px' }} />
               </Box>
            </Box>
            <Box textAlign="left" flex={1} ml={8}>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                  RTCW NA OSP
                  <a href="https://www.facebook.com/groups/nartcwosp" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                    Private Group
                  </a>
              </Box>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                  RTCW
                  <a href="https://www.facebook.com/groups/rtcwolfenstein" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                    Public Group
                  </a>
              </Box>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                RTCW Fan Club
              <a href="https://www.facebook.com/groups/2368569340" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                    Public Group
                  </a>
              </Box>
            </Box>
            <Box textAlign="left">
               <Box mb={2}>
                 <img src={BRAND_ICONS.internet_logo} alt="Internet" style={{ width: '64px', height: '64px' }} />
               </Box>
            </Box>
            <Box textAlign="left" flex={1} ml={8}>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                  Reddit
                  <a href="https://www.reddit.com/r/RtCW/" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                    r/RTCW
                  </a>
              </Box>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                  Archives
                  <a href="https://planet-rtcw.donkanator.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                    Planet RTCW
                  </a>
              </Box>
              <Box fontSize="lg" fontWeight="semibold" mb={2}>
                Youtube Shorts
              <a href="https://www.youtube.com/@NARTCW" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                  @NARTCW
                  </a>
              </Box>
            </Box>
          </Flex>
          <Box fontSize="md" mt={8} opacity={0.9} mx="auto" lineHeight="1.6">
            Load the basic stats below or see Activity, Matches, Groups and Leaders on the left to get more information.
          </Box>
          <Box fontSize="xl" fontWeight="bold" mt={8} opacity={0.9} mx="auto" lineHeight="1.6">
           Install RTCWPro!
               <a href="https://rtcwpro.com/install-instructions.php" target="_blank" rel="noopener noreferrer" style={{ color: '#5865F2', textDecoration: 'underline', marginLeft: '8px' }}>
                   Instructions
                   </a>
           </Box>
        </Box>

        {/* Load Stats Button */}
        <Box display="flex" justifyContent="center" alignItems="center" minH="40vh">
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={handleLoadStats}
            fontSize="16px"
            px={8}
            py={4}
            boxShadow="md"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            I'm not a bot, load stats
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <div>
        {(isLoadingNA || isLoadingEU || isLoadingSA) && <Loading />}
      </div>
      
      <Box mt={8}>
        <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: 8 }}>Active Servers (All Regions)</h2>
        {(isLoadingServersNA || isLoadingServersEU || isLoadingServersSA) && <Loading />}
        {dataServersAll.length > 0 && (
          <Box maxWidth="800px" mx="auto" mt={8}>
            <ServerListContents data={dataServersAll} />
          </Box>
        )}
      </Box>

      <Box p={8}>
        <Flex direction={{ base: "column", md: "row" }} gap={8} justify="center">
          <Box maxWidth="1200px" mx="auto" mt={8} flex={1} minW={0}>
            <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: 8 }}>Latest 10 matches from this week</h2>
            {dataMatchesRecent && !("error" in dataMatchesRecent) && (
              <MatchListContent
                data={
                  (dataMatchesRecent as IMatch[])
                    .sort((a, b) => parseInt(b.round_start) - parseInt(a.round_start))
                    .slice(0, 20)
                }
                compact={true}
              />
            )}
          </Box>
        </Flex>
      </Box>
      
      <Box p={8}>
        <Flex direction={{ base: "column", md: "row" }} gap={8} justify="center" maxWidth="1200px" mx="auto" mt={8}>
          <Box flex={1} minW={0}>
            <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '8px' }}>Leaders By ELO in North America</h2>
            {dataNA && !("error" in dataNA) && (<LeaderListContent data={dataNA} category={"elo"} />)}
          </Box>
          <Box flex={1} minW={0} borderLeft={{ md: "1px solid #ccc" }} pl={{ md: 4 }}>
            <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '8px' }}>Leaders By ELO in Europe</h2>
            {dataEU && !("error" in dataEU) && (<LeaderListContent data={dataEU} category={"elo"} />)}
          </Box>
          <Box flex={1} minW={0} borderLeft={{ md: "1px solid #ccc" }} pl={{ md: 4 }}>
            <h2 style={{ textAlign: 'center', fontSize: '16px', marginBottom: '8px' }}>Leaders By ELO in South America</h2>
            {dataSA && !("error" in dataSA) && (<LeaderListContent data={dataSA} category={"elo"} />)}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default FrontPage; 