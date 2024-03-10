import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import {
  Box,
  Stack,
  useToast,
  Text,
  Avatar,
  Badge,
  StackDivider,
} from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import {
  getChatTime,
  getNotificationContent,
  getSender,
  getSenderDetail,
} from "../../helpers/ChatHelper";
import { GoDotFill } from "react-icons/go";
import MainDrawer from "../Drawers/MainDrawer";
import ProfileHead from "./ProfileHead";

const MyChats = ({ fetchAgain }) => {
  const toast = useToast();
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the chats.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  console.log("chats", chats);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="0 0 10px"
      // bg="#191b23"
      // boxShadow="-5px -5px 20px rgba(92, 92, 92, 0.1), 5px 5px 20px rgba(0, 0, 0, 0.4)"
      // border="2px solid #282828"
      w={{ base: "100%", md: "31%" }}
      // borderRadius="20px"
      overflow="hidden"
      // borderWidth="1px"
    >
      <Box
        p="15px 0px 10px"
        fontSize={{ base: "20px", md: "17px" }}
        width="100%"
        alignItems="center"
        bg="transparent"
        // boxShadow="-5px -5px 20px rgba(92, 92, 92, 0.1), 5px 5px 20px rgba(0, 0, 0, 0.4)"
        // borderBottom="2px solid #282828"
      >
        <ProfileHead />
      </Box>
      <Box
        display="flex"
        flexDir="column"
        // p={3}
        bg="#fff"
        w="100%"
        h="100%"
        overflowY="hidden"
      >
        {chats && chats.length > 0 ? (
          <Stack
            overflowY="scroll"
            divider={<StackDivider borderColor="#e9edef" />}
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#fff"}
                color={selectedChat === chat ? "white" : "#black"}
                _hover={{
                  bg: `${selectedChat !== chat && "#f5f6f6"}`,
                }}
                px={3}
                py={2}
                // borderRadius="lg"
                key={chat._id}
                display="flex"
                alignItems="center"
              >
                <Avatar
                  name={
                    !chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName
                  }
                  src={
                    !chat.isGroupChat
                      ? getSenderDetail(user, chat.users).pic
                      : ""
                  }
                  border={
                    getSenderDetail(user, chat.users).active
                      ? "2px solid #2ecc71"
                      : "2px solid #95a5a6"
                  }
                  marginRight="10px"
                />
                <Text display="flex" flexDir="column" alignItems="flex-start">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                  {chat.latestMessage && (
                    <small
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {getNotificationContent(chat.latestMessage.content)}
                    </small>
                  )}
                </Text>
                <Text
                  fontSize={12}
                  fontWeight={600}
                  marginLeft="auto"
                  alignItems="flex-end"
                >
                  {getChatTime(chat.updatedAt)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : loading ? (
          <ChatLoading />
        ) : (
          <Text>No Chats Available!</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
