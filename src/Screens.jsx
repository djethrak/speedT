import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import {
  Box,
  Button,
  VStack,
  Spacer,
  Text,
  Grid,
  HStack,
} from "@chakra-ui/react";

import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  return (
    <Box
      h="380px"
      w="380px"
      bg="teal.50"
      borderRadius="12px"
      my="80px"
      mx="auto"
    >
      <VStack
        spacing="24px"
        m="auto"
        h="380px"
        color="teal.500"
        fontWeight="bold"
        fontSize="4xl"
        marginBottom="20px"
      >
        <Spacer />
        <Text>Memory</Text>
        <Text fontSize="lg" mb="20px" fontWeight="normal">
          Flip over tiles looking for pairs
        </Text>
        <Button
          onClick={start}
          color="white"
          w="130px"
          h="50px"
          mb="20px"
          borderRadius="full"
          bgGradient="linear(teal.400 30%, teal.500 70%)"
          _hover={{
            bgGradient: "linear(teal.500 30%, teal.600 70%)",
          }}
          size="lg"
          boxShadow="2xl"
        >
          Play
        </Button>
        <Spacer />
      </VStack>
    </Box>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti();
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <Box py="40px">
        <HStack mb="20px" color="green">
          <Spacer />
          <Text>Tries</Text>
          <Text bg="green.200" px="2" borderRadius="5">
            {tryCount}
          </Text>
          <Spacer />
        </HStack>

        <Grid
          h="380px"
          w="380px"
          bg="green.50"
          p="10px"
          borderRadius="12px"
          m="auto"
          gap={3}
          templateColumns="repeat(4, 1fr)"
        >
          {getTiles(16).map((tile, i) => (
            <Tile key={i} flip={() => flip(i)} {...tile} />
          ))}
        </Grid>
      </Box>
    </>
  );
}
