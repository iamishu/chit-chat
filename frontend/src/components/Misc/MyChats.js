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
  Input,
  Divider,
  FormControl,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import ProfileHead from "./ProfileHead";
import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import UserListItem from "./UserListItem";
import ChatHeads from "./ChatHeads";
import { filterUsers, searchChats } from "../../helpers/Filters";

const MyChats = ({ fetchAgain }) => {
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);

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

  console.log("filterChat", filteredChats);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setFilteredChats(chats);
      return;
    }
    try {
      setFilteredChats(searchChats(query, chats, loggedUser));
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);

      setLoading(false);
      setSearchResult(filterUsers(data, chats));
    } catch (error) {
      console.log(error);
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

  const accessChat = async (userId, userName) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat",
        { userId, userName },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setLoadingChat(false);
      setSelectedChat(data);
      setSearch("");
      setSearchResult([]);
    } catch (error) {}
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      w={{ base: "100%", md: "31%" }}
      overflow="hidden"
    >
      <Box
        p="0px"
        fontSize={{ base: "20px", md: "17px" }}
        width="100%"
        alignItems="center"
        bg="transparent"
      >
        <ProfileHead />
      </Box>
      <Box
        display="flex"
        flexDir="column"
        bg="#fff"
        w="100%"
        h="100%"
        overflowY="hidden"
      >
        <Box w="100%" p={2} bg="var(--white)">
          <FormControl>
            <InputGroup>
              <InputLeftElement h="30px">
                <Search2Icon color="var(--iconClr)" fontSize="14px" />
              </InputLeftElement>
              <Input
                placeholder="Search Chat"
                mr={2}
                value={search}
                h="30px"
                fontSize="14px"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <InputRightElement right="10px" height="30px">
                {search && (
                  <CloseIcon
                    color="var(--iconClr)"
                    fontSize="14px"
                    cursor="pointer"
                    onClick={() => setSearch("")}
                  />
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Box>
        <Divider borderColor="#e9edef" />
        {!search && filteredChats && filteredChats.length > 0 ? (
          <Stack
            overflowY="scroll"
            divider={<StackDivider borderColor="#e9edef" m="0px !important" />}
          >
            {filteredChats.map((chat) => (
              <ChatHeads chat={chat} loggedUser={loggedUser} />
            ))}
          </Stack>
        ) : search ? (
          <>
            {filteredChats && filteredChats.length > 0 && (
              <>
                <Text
                  fontWeight={600}
                  color="var(--brandClr)"
                  fontSize="18px"
                  p="10px 20px"
                >
                  Chats:{" "}
                </Text>
                {filteredChats.map((chat) => (
                  <ChatHeads chat={chat} loggedUser={loggedUser} />
                ))}
              </>
            )}
            <Text
              fontWeight={600}
              color="var(--brandClr)"
              fontSize="18px"
              p="10px 20px"
            >
              Users:{" "}
            </Text>
            {searchResult.length > 0 &&
              searchResult?.map((user) =>
                user ? (
                  <>
                    <UserListItem
                      key={user?._id}
                      user={user}
                      handleFunction={() => accessChat(user?._id, user?.name)}
                      type="search"
                    />
                  </>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    w="100%"
                    h="100%"
                    color="var(--iconClr)"
                  >
                    Users not found.
                  </Box>
                )
              )}
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="100%"
            h="100%"
            color="var(--iconClr)"
          >
            Chats not Available!
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
