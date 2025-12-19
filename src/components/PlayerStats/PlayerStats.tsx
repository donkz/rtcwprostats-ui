import React, { useContext } from "react";
import { Link as reactLink } from "react-router-dom";
import {
  Box,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { RegionTypeContext } from "../../context";
import { MatchStatsPlayerTable } from "../MatchStats";

import { IPlayerDetails, IPlayerStats } from "../../api/types";
import { REGIONS, GAME_TYPES } from "../../constants";
import { EloProgress } from "../EloProgress";
import { Achievements } from "../Achievements/Achievements";
import { PlayerMapWinRates } from "../PlayerMapWinRates/PlayerMapWinRates";


const PlayerStats: React.FC<{
  data: IPlayerDetails;
  playerId: string;
}> = ({ data, playerId }) => {
  const rTypeContext = useContext(RegionTypeContext);
  const { region, gametype } = rTypeContext; //region: 'na', gametype: '6'
  const regionKey = `${region}#${gametype}`;

  const { elos = {}, aggstats = {}, kdr = {}, acc = {} } = data;
  const { [regionKey]: eloRegion } = elos;
  const { [regionKey]: aggStatsRegion = {} } = aggstats;
  const { [regionKey]: kdrRegion } = kdr;
  const { [regionKey]: accRegion } = acc;

  const regionTitle = REGIONS.find((item) => item.id === region)?.name;
  const gameTypeTitle = GAME_TYPES.find((item) => item.id === gametype)?.name;

  const headshotRatio = aggStatsRegion["headshots"]
    ? `${((aggStatsRegion["headshots"] / aggStatsRegion["hits"]) * 100).toFixed(
        2
      )}%`
    : "N/A";

  const accuracy = accRegion ? `${accRegion}%` : "N/A";

  const objectivePerGame = aggStatsRegion["obj_captured"]
    ? `${(
        (aggStatsRegion["obj_captured"] / aggStatsRegion["games"]) *
        100
      ).toFixed(2)}%`
    : "N/A";

  const damagePerGame = aggStatsRegion["damagegiven"]
    ? (aggStatsRegion["damagegiven"] / aggStatsRegion["games"]).toFixed(2)
    : "N/A";

  const gibsPerGame = aggStatsRegion["gibs"]
    ? (aggStatsRegion["gibs"] / aggStatsRegion["games"]).toFixed(2)
    : "N/A";

  // TODO: Need to figure out how/what to actually display
  return (
    <Box my="10px">
      <Box w="100%">
        <Heading as="h4" size="md" mb="10px">
          {`Lifetime - ${regionTitle} ${gameTypeTitle}`}
        </Heading>
        <SimpleGrid columns={[2, 2, 3]} spacing={10}>
          <Stat>
            <StatLabel>ELO</StatLabel>
            <StatNumber>{(eloRegion && eloRegion.elo) || "N/A"}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Games</StatLabel>
            <StatNumber>{aggStatsRegion["games"] || "N/A"}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>KDR</StatLabel>
            <StatNumber>{(kdrRegion && kdrRegion) || "N/A"}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Accuracy</StatLabel>
            <StatNumber>
              {(aggStatsRegion &&
                accuracy &&
                `${accuracy}`) ||
                "N/A"}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Headshot %</StatLabel>
            <StatNumber>{headshotRatio}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Obj/Game</StatLabel>
            <StatNumber>{objectivePerGame}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Dmg/Game</StatLabel>
            <StatNumber>{damagePerGame}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Gibs/Game</StatLabel>
            <StatNumber>{gibsPerGame}</StatNumber>
          </Stat>
        </SimpleGrid>
      </Box>
      <Box w="100%">
        <Heading as="h4" size="md" mt="20px" mb="10px">
            Achievements
        </Heading>
        <Achievements achievements={data.achievements}/>
      </Box>
      <Box w="100%">
        <Heading as="h4" size="md" mt="20px" mb="10px">
          Elo Progression
        </Heading>
        <EloProgress playerId={playerId} region={region} gametype={gametype}/>
      </Box>
      <Box w="100%">
        <Heading as="h4" size="md" mt="20px" mb="10px">
          Match History
        </Heading>
        <MatchStatsPlayerTable playerId={playerId} />
      </Box>
      <Box w="100%">
        <Heading as="h4" size="md" mt="20px" mb="10px">
          Map Win/Draw/Loss Rates
        </Heading>
        <PlayerMapWinRates playerId={playerId} region={region} gametype={gametype}/>
      </Box>
    </Box>
  );
};

export default PlayerStats;
