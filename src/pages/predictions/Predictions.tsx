import React, { useContext, useMemo, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import { StatsApi } from "../../api";
import { RegionTypeContext } from "../../context";
import { RegionTypePicker } from "../../components/Nav/RegionTypePicker";
import { IPredictionRequest, IPredictionResult } from "../../types/predictions";
import {
  getOrCreateSessionId,
  getRandomPastDate,
  getScoreLabel,
  getSessionAccuracy,
} from "../../util/predictions";
import { PageTitle } from "../../components/PageTitle";

const Predictions: React.FC = () => {
  const { region, gametype } = useContext(RegionTypeContext);

  const sessionId = useMemo(() => getOrCreateSessionId(), []);

  const [sliderValue, setSliderValue] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] =
    useState<IPredictionResult | null>(null);
  const [submittedValue, setSubmittedValue] = useState<number | null>(null);
  const [matchKey, setMatchKey] = useState<number>(0);

  const {
    data: match,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["prediction-match", region, gametype, matchKey],
    () => StatsApi.Predictions.getMatch(region, gametype, getRandomPastDate()),
    { retry: 1, refetchOnWindowFocus: false }
  );

  const submitMutation = useMutation(
    (req: IPredictionRequest) => StatsApi.Predictions.submitPrediction(req),
    {
      onSuccess: (result) => {
        setPredictionResult(result);
        setSubmitted(true);
      },
    }
  );

  const handleSubmit = () => {
    if (!match || submitted) return;
    if (sliderValue < -3 || sliderValue > 3) return;
    setSubmittedValue(sliderValue);
    submitMutation.mutate({
      session_id: sessionId,
      groupgsi1sk: match.gsi1sk,
      prediction: String(sliderValue),
    });
  };

  const handleNextGame = () => {
    setSliderValue(0);
    setSubmitted(false);
    setPredictionResult(null);
    setSubmittedValue(null);
    setMatchKey((k) => k + 1);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !match) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Alert status="error" borderRadius="md" w="50%">
          <AlertIcon />
          <AlertTitle>Failed to load match.</AlertTitle>
          <AlertDescription>Could not fetch a match to predict.</AlertDescription>
        </Alert>
        <Button mt={4} onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    );
  }

  const teamA = match.players.TeamA[0] ?? "Team A";
  const teamB = match.players.TeamB[0] ?? "Team B";

  const isSubmitDisabled =
    submitted ||
    submitMutation.isLoading ||
    sliderValue < -3 ||
    sliderValue > 3;

  // Result panel vars (only used after submission)
  const isCorrect = predictionResult?.current_correct === 1;
  const accuracy = predictionResult ? getSessionAccuracy(predictionResult) : 0;
  const predictedLabel =
    submittedValue !== null ? getScoreLabel(submittedValue, teamA, teamB) : "—";
  const scorea = predictionResult?.scorea;
  const scoreb = predictionResult?.scoreb;
  
  const accuracy_percent = predictionResult?.accuracy_percent != null ? `${Math.round(predictionResult.accuracy_percent)}%` : "—";
  const actualLabel = scorea != null && scoreb != null ? `${scorea} : ${scoreb}` : "—";

  return (
    <Box display="flex" flexDirection="column" alignItems="left">
      <Box ml={40} mb={4}>
        <PageTitle>Predict a match!</PageTitle>
        <Box w="100%">
          <RegionTypePicker />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <HStack spacing={3} mb={2} flexWrap="wrap" justifyContent="center" alignItems="center">
          <Text fontSize="xs" color="gray.400">Maps:</Text>
          {match.maps.map((mapName) => (
            <Badge key={mapName} colorScheme="blue" fontSize="xs">{mapName}</Badge>
          ))}
        </HStack>

        {/* Team rosters */}
        <Box w="66%" mb={8}>
          <SimpleGrid columns={2} spacing={6}>
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bgGradient="linear(to-b, gray.700, gray.800)"
              boxShadow="0 4px 24px rgba(0,0,0,0.6)"
            >
              <Heading
                size="lg"
                mb={4}
                textAlign="center"
                textTransform="uppercase"
                letterSpacing="widest"
                textShadow="0px 1px 0px rgba(255,255,255,0.15), 0px -1px 0px rgba(0,0,0,0.8)"
                color="blue.200"
              >
                Team A
              </Heading>
              <Divider borderColor="blue.700" opacity={0.6} mb={2} />
              <VStack align="stretch" spacing={2}>
                {match.players.TeamA.map((player) => (
                  <Text
                    key={player}
                    fontSize="xl"
                    fontWeight="bold"
                    textAlign="center"
                    letterSpacing="wide"
                    color="whiteAlpha.900"
                  >
                    {player}
                  </Text>
                ))}
              </VStack>
            </Box>
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              bgGradient="linear(to-b, gray.700, gray.800)"
              boxShadow="0 4px 24px rgba(0,0,0,0.6)"
            >
              <Heading
                size="lg"
                mb={4}
                textAlign="center"
                textTransform="uppercase"
                letterSpacing="widest"
                textShadow="0px 1px 0px rgba(255,255,255,0.15), 0px -1px 0px rgba(0,0,0,0.8)"
                color="red.200"
              >
                Team B
              </Heading>
              <Divider borderColor="red.700" opacity={0.6} mb={2} />
              <VStack align="stretch" spacing={2}>
                {match.players.TeamB.map((player) => (
                  <Text
                    key={player}
                    fontSize="xl"
                    fontWeight="bold"
                    textAlign="center"
                    letterSpacing="wide"
                    color="whiteAlpha.900"
                  >
                    {player}
                  </Text>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Slider */}
        <Box w="50%" mb={6}>
          <Text mb={2} fontWeight="semibold" textAlign="center">
            Your prediction:{" "}
            <Badge colorScheme="purple" fontSize="md">
              {getScoreLabel(sliderValue, teamA, teamB)}
            </Badge>
          </Text>
          <Slider
            min={-3}
            max={3}
            step={1}
            value={sliderValue}
            onChange={setSliderValue}
            isDisabled={submitted}
            aria-label="prediction-slider"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <HStack justify="space-between" mt={1}>
            <Text fontSize="xs" color="gray.400">Team A wins</Text>
            <Text fontSize="xs" color="gray.400">Draw</Text>
            <Text fontSize="xs" color="gray.400">Team B wins</Text>
          </HStack>
        </Box>

        {/* Submission error */}
        {submitMutation.isError && (
          <Alert status="error" borderRadius="md" mb={3} w="50%">
            <AlertIcon />
            <AlertDescription>Submission failed. Please try again.</AlertDescription>
          </Alert>
        )}

        {/* Submit / Next Game button */}
        <Button
          colorScheme={submitted ? "green" : "blue"}
          onClick={submitted ? handleNextGame : handleSubmit}
          isDisabled={!submitted && isSubmitDisabled}
          isLoading={submitMutation.isLoading}
          size="lg"
          mb={6}
        >
          {submitted ? "Next Game" : "Submit Prediction"}
        </Button>

        {/* Result panel — shown after submission, stays visible */}
        { predictionResult && (
          <Box w="66%">
            <Alert
              status={isCorrect ? "success" : "error"}
              borderRadius="xl"
              mb={4}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              py={6}
              boxShadow={isCorrect ? "0 0 24px rgba(72,187,120,0.5)" : "0 0 24px rgba(245,101,101,0.5)"}
              borderWidth="2px"
              borderColor={isCorrect ? "green.400" : "red.400"}
            >
              <AlertTitle fontSize="3xl" fontWeight="extrabold" letterSpacing="wide">
                {isCorrect ? "🎉 Correct!" : "❌ Incorrect!"}
              </AlertTitle>
              <AlertDescription>
                "Round accuracy" {accuracy_percent}
              </AlertDescription>
            </Alert>

            <SimpleGrid columns={3} spacing={4}>
              <Box p={4} borderWidth="1px" borderRadius="md">
                <Text fontSize="sm" color="gray.400" mb={1}>Your prediction</Text>
                <Text fontWeight="bold" fontSize="lg">{predictedLabel}</Text>
              </Box>
              <Box p={4} borderWidth="1px" borderRadius="md">
                <Text fontSize="sm" color="gray.400" mb={1}>Actual result</Text>
                <Text fontWeight="bold" fontSize="lg">{actualLabel}</Text>
              </Box>
              <Box p={4} borderWidth="1px" borderRadius="md">
                <Text fontSize="sm" color="gray.400" mb={2}>Session stats</Text>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm">
                    Guesses: <Badge>{predictionResult.session_guesses}</Badge>
                  </Text>
                  <Text fontSize="sm">
                    Correct: <Badge colorScheme="green">{predictionResult.session_correct}</Badge>
                  </Text>
                  <Text fontSize="sm">
                    Accuracy: <Badge colorScheme="blue">{accuracy}%</Badge>
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Predictions;
