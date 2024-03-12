import React, { useState, createRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/chatProvider";
import { generateItems, getChatDay } from "../helpers/ChatHelper";
import Message from "./Message";
import { Box, Icon } from "@chakra-ui/react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

const ScrollableChat = ({ messages }) => {
  const scrollRef = createRef();
  const { user } = ChatState();
  const newMessages = generateItems(messages);

  const sortedMessages = newMessages.reverse();

  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    scrollRef.current.scrollToBottom();
  };

  const renderMessage = (m, i) => {
    if (m?.type && m?.type === "day") {
      return (
        <Box w="100%" textAlign="center" margin="20px 0 10px" key={i + 1}>
          <small
            style={{
              width: "50px",
              padding: "5px 15px",
              fontSize: "12px",
              background: "#fffeda",
              color: "#54656f",
              borderRadius: "20px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1),0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            {getChatDay(m.date)}
          </small>
        </Box>
      );
    }
    return <Message m={m} messages={sortedMessages} i={i} user={user} />;
  };

  return (
    <>
      <ScrollableFeed
        onScroll={(isAtBottom) => setIsAtBottom(isAtBottom)}
        ref={scrollRef}
      >
        {sortedMessages && sortedMessages.map((m, i) => renderMessage(m, i))}
      </ScrollableFeed>
      {!isAtBottom && (
        <div style={{ position: "relative" }}>
          <Icon
            onClick={scrollToBottom}
            as={MdKeyboardDoubleArrowDown}
            fontSize={30}
            borderRadius="full"
            boxShadow="md"
            position="absolute"
            bottom={2}
            right="10px"
            bg="#e1e1e1"
            padding="5px"
            cursor="pointer"
          />
        </div>
      )}
    </>
  );
};

export default ScrollableChat;
