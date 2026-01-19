import React, { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { BarDatum, ResponsiveBar} from "@nivo/bar";
import { BasicTooltip } from "@nivo/tooltip";
import { theme } from "./PlayerMapWinRatesTheme";
import { IPlayerMapRate } from "../../api/types";
import { StatsApi } from "../../api";


export const PlayerMapWinRates: React.FC<{
  gametype: string;
  region: string;
  playerId: string;
}> = ({ playerId, region, gametype }) => {
  const history = useHistory();

    const { data, isLoading, refetch } = useQuery<IPlayerMapRate[]>(
      "mapwinrates",
      () => StatsApi.Maps.GetPlayerMapRates(playerId, region, gametype)
    );
  
    useEffect(() => {
      refetch();
    }, [playerId, region, gametype]);

  function convertToNivoBarDatum(mapData: IPlayerMapRate[]): BarDatum[] {
    let playerMapData: BarDatum[] = [];
    mapData.forEach((playerMapRate: IPlayerMapRate) => {
      playerMapRate.games === 0 && (playerMapRate.games = 1); // to avoid division by zero
      playerMapData.push({
        "map": playerMapRate.map + ` (${playerMapRate.games})`,
        "wins": playerMapRate.wins/playerMapRate.games,
        "draws": playerMapRate.draws/playerMapRate.games,
        "losses": playerMapRate.losses/playerMapRate.games
      });
    });
    return playerMapData;
  }

  const nivoData = useMemo(() => {
    if (!data || "error" in data) {
      return null;
    }
    let mapSeries: any = convertToNivoBarDatum(data);
    return mapSeries;
  }, [data]);

  let barAreaHeight = 1000;
  if (nivoData) {
    barAreaHeight = Math.min(barAreaHeight, nivoData.length * 60);
  }


  return (
    <>
      {data && "error" in data && <>N/A</>}
      {data && nivoData && (
        <Box h={barAreaHeight}>
            <ResponsiveBar
              data={nivoData}
              theme={theme}
              indexBy="map"
              keys={["wins", "draws", "losses"]}
              layout="horizontal"
              padding={0.1}
              innerPadding={1}
              colorBy="id"
              colors={{ scheme: 'accent' }}
              enableLabel={true}
              labelSkipWidth={12}
              labelSkipHeight={12}
              axisBottom={null}
              legends={[
                  {
                      dataFrom: 'keys',
                      anchor: 'right',
                      direction: 'column',
                      translateX: 120,
                      itemsSpacing: 3,
                      itemWidth: 100,
                      itemHeight: 16
                  }
              ]}
              margin={{ top: 0, right: 120, bottom: 50, left: 150 }}
              valueFormat=" =-.0%"
          />
        </Box>
      )}
    </>
  );
};
