import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import { Box, useToast } from "@chakra-ui/react";
import SideDrawer from "../components/Misc/ProfileHead";
import MyChats from "../components/Misc/MyChats";
import ChatBox from "../components/Misc/ChatBox";
import { useNavigate } from "react-router-dom";

const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const Chats = () => {
  const { user } = ChatState();
  const toast = useToast();
  const [fetchAgain, setFetchAgain] = useState(false);
  const navigate = useNavigate();

  const createIndexedDb = () => {
    //check for support
    if (!idb) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }

    const request = idb.open("Chit-chat", 1);

    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };

    request.onupgradeneeded = function (event) {
      console.log(event);
      const db = request.result;

      if (!db.objectStoreNames.contains("chats")) {
        const objectStore = db.createObjectStore("chats", { keyPath: "_id" });

        objectStore.createIndex("chatId", "_id", {
          unique: false,
        });
      }
    };

    request.onsuccess = function () {
      console.log("Database opened successfully");

      const db = request.result;

      var tx = db.transaction("chats", "readwrite");

      return tx.complete;
    };
  }

  const fetchChats = async (user) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      if (data && data.length > 0) {
        const dbPromise = idb.open("Chit-chat", 1);
        dbPromise.onsuccess = () => {
          const db = dbPromise.result;

          var tx = db.transaction("chats", "readwrite");
          var chatsData = tx.objectStore("chats");
          data.forEach((item) => chatsData.add(item));
          return tx.complete;
        };
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
    createIndexedDb();
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
        maxH="100vh"
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
