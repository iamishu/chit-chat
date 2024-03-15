import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import { Box, useToast } from "@chakra-ui/react";
import SideDrawer from "../components/Misc/ProfileHead";
import MyChats from "../components/Misc/MyChats";
import ChatBox from "../components/Misc/ChatBox";
import { useNavigate } from "react-router-dom";
import { IndexedDBService } from "../services/indexedDBService";

const Chats = () => {
  const { user } = ChatState();
  const toast = useToast();
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  const indexedDBService = new IndexedDBService();


  const fetchChats = async (user) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/user/getall", config);
      if (data && Object.keys(data).length > 0) {
        const { chats, friends, messages } = data;
        if (chats && chats.length > 0) {
          indexedDBService.addChatsData(chats);
        }
        if (friends && friends.length > 0) {
          indexedDBService.addFriendsData(friends);
        }
        if (messages && messages.length > 0) {
          indexedDBService.addMessagesData(messages);
        }
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to load the chats.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user) {
      navigate("/");
    }
    indexedDBService.connectToDB();
    fetchChats(user);
  }, []);
  return (
    <div style={{ width: "100%" }}>
      {/* {user && <SideDrawer />} */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        maxW="1600px"
        h="100%"
        maxH="100%"
        boxShadow="0 6px 48px rgba(11,16,20, .3)"
        zIndex="3"
        bg="#f0f2f5"
        position="relative"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chats;
