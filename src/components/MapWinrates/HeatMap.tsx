import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { BasicTooltip } from "@nivo/tooltip";
import { theme } from "./HeatMapTheme";
import { IMapsAllItem, IMapStats } from "../../api/types";


const HeatMap: React.FC<{
  data: any
}> = ({ data }) => {
  const history = useHistory();

  interface HeatmapPoint {
    x: string;
    y: number;
    wins: number;
    games: number;
  }

  interface HeatmapData {
    id: string;
    name: string;
    data: HeatmapPoint[];
  }

  function convertToNivoHeatmap(gameData: IMapsAllItem[]): HeatmapData[] {
    let heatMapData: any = gameData.map((player) => ({
      id: player.real_name + "/" + player.id.substring(0,2),
      data: player.data.map((mapStats) => ({
        x: mapStats.map,
        y: parseFloat((mapStats.wins / mapStats.games).toFixed(2)),
        wins: mapStats.wins,
        games: mapStats.games
      }))
    }));
    return heatMapData.sort((a: any, b: any) => a.id.localeCompare(b.id));
  }

  const nivoData = useMemo(() => {
    if (!data || "error" in data) {
      return null;
    }
    let mapSeries: any = convertToNivoHeatmap(data);
    return mapSeries;
  }, [data]);

  interface HeatMapDatum {
    x: string;
    y: number;
    wins: number;
    games: number;
  }

  return (
    <>
      {data && "error" in data && <>N/A</>}
      {data && nivoData && (
        <Box h={2500}>
            <ResponsiveHeatMap<HeatMapDatum>
                theme={theme}
                data={nivoData}
                margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                valueFormat=" >-.0%"
                axisTop={{ tickRotation: -45, legendOffset: -50 }}

                colors={{
                    type: 'diverging',
                    scheme: 'red_blue',
                    divergeAt: 0.5,
                    minValue: 0,
                    maxValue: 1
                }}
                emptyColor="#555555"
                legends={[
                    {
                        anchor: 'bottom',
                        translateX: 0,
                        translateY: 30,
                        length: 400,
                        thickness: 8,
                        direction: 'row',
                        tickPosition: 'after',
                        tickSize: 3,
                        tickSpacing: 4,
                        tickOverlap: false,
                        tickFormat: '>-.2s',
                        title: 'Value →',
                        titleAlign: 'start',
                        titleOffset: 4
                    }     
                ]}
                tooltip={({ cell }) => (
                  <div
                    style={{
                      background: 'white',
                      padding: '5px 10px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      color: 'black'
                    }}
                  >
                    <div style={{ fontFamily: 'monospace' }}>Map  : {cell.data.x}</div>
                    <div style={{ fontFamily: 'monospace' }}>Wins : {cell.data.wins}</div>
                    <div style={{ fontFamily: 'monospace' }}>Games: {cell.data.games}</div>
                  </div>
                )}

            />
        </Box>
      )}
    </>
  );
};

export default HeatMap;
