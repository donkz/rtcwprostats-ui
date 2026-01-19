import React, { useCallback } from "react";
import { useTable, useSortBy } from "react-table";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";

import { Box, Text, Table, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react";
import { IElos, IPlayerStatsWithId, IClasses } from "../../api/types";
import { useHistory } from "react-router-dom";
import styles from "./MatchStatsTeamTable.module.css";
import { CLASS_ICONS } from "../../constants";
import { RTCWColorText } from "../../components/RTCWColorText/RTCWColorText"

const MatchStatsTeamTable: React.FC<{
  teamName: string;
  teamData: any[];
  displayHeader: boolean;
  elos: IElos;
  classes: IClasses;
}> = ({ teamName, teamData, displayHeader, elos, classes }) => {
  const history = useHistory();
  const data = React.useMemo(
    () =>
      teamData.map((player: IPlayerStatsWithId) => {
        const d: any = {
          playerId: player.playerId,
          name: elos != null && player.playerId in elos ? elos[player.playerId][0] : (player.alias_colored == null ? player.alias : player.alias_colored),
          kdr: (player.categories.kills / player.categories.deaths).toFixed(2),
          kills: player.categories.kills,
          deaths: player.categories.deaths,
          gibs: player.categories.gibs,
          suicides: player.categories.suicides,
          revives: player.categories.revives,
          accuracy: (
            <>
              {(
                (player.categories.hits /
                  (player.categories.shots +
                    (player.categories.shots === 0 ? 1 : 0))) *
                100
              ).toFixed(1)}
              %
            </>
          ),
          headshots: player.categories.headshots,
          damagegiven: player.categories.damagegiven,
          damagereceived: player.categories.damagereceived,
          dmgratio: (player.categories.damagereceived == 0 ? 0 : player.categories.damagegiven / player.categories.damagereceived).toFixed(1),
          damageteam: player.categories.damageteam,
          elo: elos != null && player.playerId in elos ? elos[player.playerId][1] : null,
          class: classes != null && player.playerId in classes ? classes[player.playerId] : null,
          obj_captured: player.categories.obj_captured,
          obj_returned: player.categories.obj_returned,
          obj_killcarrier: player.categories.obj_killcarrier,
          obj_taken: player.categories.obj_taken,
          obj_destroyed: player.categories.obj_destroyed,
        };

        // Add time_played if it exists
        if (player.categories.time_played != null) {
          d.time_played = (
            <>
              {(
                (player.categories.time_played / (player.categories.time_allies + player.categories.time_axis) * 100).toFixed(1))}
              %
            </>
          );
        }

        // Add obj_held_sec if time_objheld exists
        if (player.categories.time_objheld != null) {
          d.obj_held_sec = Math.round(player.categories.time_objheld / 1000);
        }

        return d;
      }),
    [teamData]
  );

  // Check if any player has time data
  const hasTimePlayedData = React.useMemo(() => {
    return teamData.some((player: IPlayerStatsWithId) =>
      player.categories.time_played != null
    );
  }, [teamData]);

  const hasObjHeldData = React.useMemo(() => {
    return teamData.some((player: IPlayerStatsWithId) =>
      player.categories.time_objheld != null
    );
  }, [teamData]);

  const columns = React.useMemo(
    () => {
      let temp_col = [
        {
          Header: "Name",
          accessor: "name",
          Footer: "Totals"
        },
        {
          Header: "KDR",
          accessor: "kdr",
          isNumeric: true,
          Footer: _footerKdr(data)
        },
        {
          Header: "Kills",
          accessor: "kills",
          isNumeric: true,
          //this is original way of providing footers. Leaving it here for reference.
          Footer: (data: any) => {
            const total = React.useMemo(
              () =>
                data.rows.reduce((sum: number, row: any) => row.values.kills + sum, 0),
              [data.rows]
            )

            return <>{total}</>
          },
        },
        {
          Header: "Deaths",
          accessor: "deaths",
          isNumeric: true,
          Footer: _footerSum(data, "deaths")
        },
        {
          Header: "Gibs",
          accessor: "gibs",
          isNumeric: true,
          Footer: _footerSum(data, "gibs")
        },
        {
          Header: "HS",
          accessor: "headshots",
          isNumeric: true,
          Footer: _footerSum(data, "headshots")
        },
        {
          Header: "Suicides",
          accessor: "suicides",
          isNumeric: true,
          Footer: _footerSum(data, "suicides")
        },
        {
          Header: "Revives",
          accessor: "revives",
          isNumeric: true,
          Footer: _footerSum(data, "revives")
        },
        {
          Header: "Accuracy",
          accessor: "accuracy",
          isNumeric: true,
        },
        {
          Header: "DMG Given",
          accessor: "damagegiven",
          isNumeric: true,
          Footer: _footerSum(data, "damagegiven")
        },
        {
          Header: "DMG Received",
          accessor: "damagereceived",
          isNumeric: true,
          Footer: _footerSum(data, "damagereceived")
        },
        {
          Header: "DMG Ratio",
          accessor: "dmgratio",
          isNumeric: true,
          Footer: _footerDamageRatio(data)
        },
        {
          Header: "DMG Team",
          accessor: "damageteam",
          isNumeric: true,
          Footer: _footerSum(data, "damageteam")
        },
        {
          Header: "OBJECTIVE TAKEN",
          accessor: "obj_taken",
          isNumeric: true,
          Footer: _footerSum(data, "obj_taken")
        },
        {
          Header: "OBJECTIVE CAPTURED",
          accessor: "obj_captured",
          isNumeric: true,
          Footer: _footerSum(data, "obj_captured")
        },
        {
          Header: "OBJECTIVE KILLCARRIER",
          accessor: "obj_killcarrier",
          isNumeric: true,
          Footer: _footerSum(data, "obj_killcarrier")
        },
        {
          Header: "OBJECTIVE RETURNED",
          accessor: "obj_returned",
          isNumeric: true,
          Footer: _footerSum(data, "obj_returned")
        },
        {
          Header: "OBJECTIVE DESTROYED",
          accessor: "obj_destroyed",
          isNumeric: true,
          Footer: _footerSum(data, "obj_destroyed")
        }
      ]

      // Conditionally add Time Played column
      if (hasTimePlayedData) {
        temp_col.splice(-5, 0, {
          Header: "Time Played",
          accessor: "time_played",
          isNumeric: true
        });
      }

      // Conditionally add Objective Held column
      if (hasObjHeldData) {
        temp_col.push({
          Header: "Objective Held (S)",
          accessor: "obj_held_sec",
          isNumeric: true,
          Footer: _footerSum(data, "obj_held_sec")
        });
      }

      if (elos != null) {
        temp_col.splice(1, 0,
          {
            Header: "elo",
            accessor: "elo",
            isNumeric: true,
            Footer: _footerMean(data, "elo")
          }
        )
      }
      if (classes != null) {
        temp_col.splice(1, 0,
          {
            Header: "Class",
            accessor: "class",
            isNumeric: false,
          }
        )
      }
      return temp_col;
    }
    ,
    [hasTimePlayedData, hasObjHeldData]
  );

  const createGoToPlayerPage = useCallback(
    (playerId: string) => () => {
      history.push(`/player/${playerId}`);
    },
    [history]
  );

  const sortBy = React.useMemo(() => [{ id: "kdr", desc: true }], []);

  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, rows, prepareRow } =
    useTable({ columns, data, initialState: { sortBy } }, useSortBy);

  return (
    <>
      <Text m={2} mt={5} fontSize="2xl">
        {displayHeader && teamName}
      </Text>
      <Box w="100%" overflowX={"auto"}>
        <Table size="sm" variant="striped" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup: any) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                  >
                    {column.render("Header")}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <VscTriangleDown
                          style={{ display: "inline", paddingLeft: "3px" }}
                          aria-label="sorted descending"
                        />
                      ) : (
                        <VscTriangleUp
                          style={{ display: "inline", paddingLeft: "3px" }}
                          aria-label="sorted ascending"
                        />
                      )
                    ) : null}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map((row: any) => {
              prepareRow(row);
              return (
                <Tr
                  {...row.getRowProps()}
                  className={styles.tableRow}
                  onClick={createGoToPlayerPage(row.original.playerId)}
                >
                  {row.cells.map((cell: any) => (
                    <Td
                      {...cell.getCellProps()}
                      isNumeric={cell.column.isNumeric}
                      width={cell.column.width}
                    >
                      {_renderCell(cell)}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            {footerGroups.map((footerGroup: any) => (
              <Tr {...footerGroup.getFooterGroupProps()}>
                {footerGroup.headers.map((column: any) => (
                  <Td {...column.getFooterProps()} isNumeric={column.isNumeric} className={styles.tableRow}>{column.render('Footer')}</Td>
                ))}
              </Tr>
            ))}
          </Tfoot>
        </Table>
      </Box>
    </>
  );
};

export default MatchStatsTeamTable;

const _renderKdrCell = (cell: any) => {
  if (cell.value < 1) {
    return <Text color="red.500">{cell.value}</Text>;
  }

  return <Text color="green.500">{cell.value}</Text>;
};

const _renderDmgRatioCell = (cell: any) => {
  if (cell.value < 1) {
    return <Text color="red.500">{cell.value}</Text>;
  }

  return <Text color="green.500">{cell.value}</Text>;
};

const _renderPlayerClassCell = (iconType: string) => {
  const PlayerClassIcon = CLASS_ICONS[iconType];
  return <PlayerClassIcon className={styles.linkIcon} />;
};

const _renderPlayerName = (aliasColored: string) => {
  return <RTCWColorText coloredString={aliasColored} />;
};

const _renderCell = (cell: any) => {
  if (cell.column.id === "kdr") {
    return _renderKdrCell(cell);
  }
  if (cell.column.id === "dmgratio") {
    return _renderDmgRatioCell(cell);
  }
  if (cell.column.id === "name") {
    return _renderPlayerName(cell.value);
  }
  if (cell.column.id === "class") {
    return _renderPlayerClassCell(cell.value);
  }

  return cell.render("Cell");
};

const _footerSum = (data: any, accessor: string) => {
  let total: number = data.reduce((sum: number, row: any) => row[accessor] + sum, 0);
  return <>{total}</>
};

const _footerSumDecimal = (data: any, accessor: string) => {
  const total: number = data.reduce((sum: number, row: any) => parseFloat(row[accessor]) + sum, 0);
  return <>{total.toFixed(1)}</>
};

const _footerMean = (data: any, accessor: string) => {
  const total: number = data.reduce((sum: number, row: any) => row[accessor] + sum, 0)
  const mean: string = (total / data.length).toFixed();
  return <>{mean}</>
};

const _footerKdr = (data: any) => {
  const totalKills: number = data.reduce((sum: number, row: any) => row.kills + sum, 0)
  const totalDeaths: number = data.reduce((sum: number, row: any) => row.deaths + sum, 0)
  const kdr: number = totalKills / totalDeaths;
  const kdrString: string = kdr.toFixed(1);
  if (kdr < 1) {
    return <Text color="red.500">{kdrString}</Text>;
  }
  return <Text color="green.500">{kdrString}</Text>;
};

const _footerDamageRatio = (data: any) => {
  const totalDmg: number = data.reduce((sum: number, row: any) => row.damagegiven + sum, 0)
  const totalDmr: number = data.reduce((sum: number, row: any) => row.damagereceived + sum, 0)
  const totalDmgRatio: number = totalDmg / totalDmr;
  const totalDmgRatioString: string = totalDmgRatio.toFixed(1);
  if (totalDmgRatio < 1) {
    return <Text color="red.500">{totalDmgRatioString}</Text>;
  }
  return <Text color="green.500">{totalDmgRatioString}</Text>;
};
