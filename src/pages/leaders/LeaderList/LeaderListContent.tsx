import React from "react";
import { Link, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Link as reactLink } from "react-router-dom";

import { ILeaderItem } from "../../../api/types";
import { CATEGORIES } from "../../../constants";

export const LeaderListContent: React.FC<{
  data: ILeaderItem[];
  category: string;
}> = ({ data, category }) => {
  const categoryTitle =
    CATEGORIES.find((item) => item.id === category)?.name || "Value";
  return (
    <Table variant="simple" colorScheme="gray">
      <Thead>
        <Tr>
          <Th>Player</Th>
          <Th isNumeric>{categoryTitle}</Th>
          <Th isNumeric>Games</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data
          .sort((a, b) => {
            return b.value - a.value;
          })
          .map((leaderItem) => (
            <Tr key={leaderItem.guid}>
              <Td>
                <Link as={reactLink} to={`/player/${leaderItem.guid}`}>
                  <span>{leaderItem.real_name}</span>
                </Link>
              </Td>
              <Td isNumeric>{leaderItem.value}</Td>
              <Td isNumeric>{leaderItem.games}</Td>
            </Tr>
          ))}
      </Tbody>
    </Table>
  );
};

export default LeaderListContent;