import React from "react";
import { IAwardSummary } from "../../api/types";
import { Box, HStack, Text, Tooltip } from "@chakra-ui/react";
import { unitsToMeters, getRandomColor } from "../../util";
import { MdHelp } from "react-icons/md";
import { AWARD_DESCRIPTIONS } from "../../constants";
import { RTCWColorText } from "../../components/RTCWColorText/RTCWColorText"

export const AwardsDisplay: React.FC<{ data: IAwardSummary }> = ({ data }) => {
  let playerColors: any = {};
  for (const [, values] of Object.entries(data)) {
    for (const [player] of Object.entries(values)) {
      playerColors[player] = getRandomColor();
    }
  }

  return (
    <>
      <Text mt={5} fontSize="2xl">
        Awards
      </Text>
      <Box>
        {Object.entries(data).map(([award, values]) => (
          <Box
            width="200px"
            display="inline-block"
            verticalAlign="top"
            my={4}
            mr={4}
            borderLeft="rgb(76, 140, 204) solid thick"
            key={award}
          >
            <Box px={2} backgroundColor="rgba(0, 0, 0, 0.15)" w="100%">
              <HStack>
                <Text fontSize="16px" fontWeight="bold" display="inline-block">
                  {award}
                </Text>
                {AWARD_DESCRIPTIONS[award] && (
                  <Tooltip
                    label={`${AWARD_DESCRIPTIONS[award]}`}
                    aria-label={`${AWARD_DESCRIPTIONS[award]} tooltip`}
                    placement="top"
                  >
                    <Box>
                      <MdHelp />
                    </Box>
                  </Tooltip>
                )}
              </HStack>
            </Box>
            {Object.entries(values).map(([player, value]) => (
              <Box
                pl={2}
                bgColor="var(--background-light)"
                whiteSpace="nowrap"
                key={player}
                w="100%"
              >
                <Text
                  fontWeight="bold"
                  color={playerColors[player]}
                  display="inline"
                  fontSize="14px"
                >
                  <RTCWColorText coloredString={player} />:{" "}
                  <Box as="span" color="white" fontWeight="normal">
                    {award === "Longest Kill" ? `${unitsToMeters(value)} m`
                      : award === "Sharpshooter" ? `${value.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 })}`
                        : award === "Press W" || award === "Weary Traveler" ? `${unitsToMeters(value)} m`
                          : award === "Pisa incarnate" || award === "Gollum" || award === "Slav squat" ? `${(value / 1000).toFixed(0)} s`
                            : value}
                  </Box>
                </Text>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </>
  );
};
