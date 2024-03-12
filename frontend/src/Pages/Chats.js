import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Misc/ProfileHead";
import MyChats from "../components/Misc/MyChats";
import ChatBox from "../components/Misc/ChatBox";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user) {
      navigate("/");
    }
  }, []);
  return (
    <div style={{ width: "100%" }}>
      <span
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          width: "100%",
          height: "127px",
          backgroundColor: "var(--brandClr)",
        }}
      />
      {/* {user && <SideDrawer />} */}
      <Box
        display="flex"
        justifyContent="space-between"
        // p="10px"
        w="calc(100% - 38px)"
        maxW="1600px"
        h="calc(100% - 38px)"
        maxH="calc(100vh - 38px)"
        m="19px auto 0"
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
