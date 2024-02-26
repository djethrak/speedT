import { Box } from "@chakra-ui/react";

export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Box
          onClick={flip}
          display="inline-block"
          width={20}
          height={20}
          textAlign="center"
          bg="green.300"
          borderRadius="10px"
        ></Box>
      );
    case "flipped":
      return (
        <Box
          display="inline-block"
          width={20}
          height={20}
          textAlign="center"
          bg="green.500"
          color="white"
          borderRadius={10}
          p="10%"
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Box>
      );
    case "matched":
      return (
        <Box
          display="inline-block"
          width={20}
          height={20}
          textAlign="center"
          color="green.100"
          p="10%"
        >
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Box>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}
