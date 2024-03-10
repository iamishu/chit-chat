import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import ChatLoading from "../Misc/ChatLoading";
import UserListItem from "../Misc/UserListItem";
import { ChatState } from "../../context/chatProvider";

const SearchDrawer = ({
  onSearchClose,
  isSearchOpen,
  user,
  setSelectedChat,
}) => {
  const toast = useToast();
  const { chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setLoadingChat(false);
      setSelectedChat(data);
      setSearch("");
      setSearchResult([]);
      onSearchClose();
    } catch (error) {}
  };

  return (
    <Drawer
      placement="right"
      onClose={() => {
        onSearchClose();
        setSearch("");
        setSearchResult([]);
      }}
      isOpen={isSearchOpen}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent bg="#1d1e22" color="#61677c">
        <DrawerHeader borderBottomWidth="1px" borderColor="#61677c">
          Search Users
          <DrawerCloseButton />
        </DrawerHeader>
        <DrawerBody>
          <Box display="flex" pb={2} mb={3}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              boxShadow="-5px -5px 20px rgba(92, 92, 92, 0.1), 5px 5px 20px rgba(0, 0, 0, 0.4)"
              color="#61677c"
              bg="transparent"
              minH="50px"
              border="2px solid #282828"
              borderRadius="40px"
              _hover={{
                boxShadow:
                  "-2px -2px 5px rgba(92, 92, 92, 0.1), 2px 2px 5px rgba(0, 0, 0, 0.4) !important",
                color: "#54D8FA",
              }}
              _active={{
                boxShadow:
                  "inset 1px 1px 2px rgba(0, 0, 0, 0.4), inset -1px -1px 2px rgba(92, 92, 92, 0.1) !important",
                color: "#54D8FA50",
              }}
            >
              Go
            </Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
                type="search"
              />
            ))
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
