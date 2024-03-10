import React from "react";
import { ChatState } from "../../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="0 0 10px"
      overflow="hidden"
      bg="inherit"
      borderLeft="2px solid #282828"
      w={{ base: "100%", md: "69%" }}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
