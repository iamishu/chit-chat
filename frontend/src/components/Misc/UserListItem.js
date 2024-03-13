import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";

const UserListItem = ({
  user,
  handleFunction,
  type,
  groupAdmin,
  setFetchAgain,
  fetchAgain,
}) => {
  const toast = useToast();
  const { user: loggedUser, selectedChat } = ChatState();
  const [loading, setLoading] = useState(false);

  const makeGroupAdmin = async (u) => {
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };

      await axios
        .put(
          `/api/chat/group/addadmin`,
          {
            chatId: selectedChat?._id,
            user: u,
          },
          config
        )
        .then(() => {
          setLoading(false);
          setFetchAgain(!fetchAgain);
        });
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
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        bg={"var(--white)"}
        color={"var(--textClr)"}
        _hover={{
          bg: `#f5f6f6`,
        }}
        px={3}
        py={2}
        key={user._id}
        display="flex"
        alignItems="center"
        w="100%"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box w="100%">
          <Text
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text>{user.name}</Text>
              <Text fontSize="xs">
                <b>Email : </b>
                {user.email}
              </Text>
            </Box>
            {groupAdmin &&
            groupAdmin.filter((g) => g._id === user._id).length > 0 ? (
              <Box display="flex" flexDir="column" alignItems="flex-end">
                <Badge
                  ml="1"
                  colorScheme="green"
                  fontSize="10px"
                  textTransform="capitalize"
                >
                  Group Admin
                </Badge>
                {loggedUser._id !== user._id && type === "group-members" && (
                  <Menu>
                    <MenuButton>
                      <ChevronDownIcon />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => makeGroupAdmin(user)}>
                        Make Group Admin
                      </MenuItem>
                      <MenuItem>Remove</MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Box>
            ) : (
              <Menu>
                <MenuButton>
                  <ChevronDownIcon />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => makeGroupAdmin(user)}>
                    Make Group Admin
                  </MenuItem>
                  <MenuItem>Remove</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Text>
        </Box>
      </Box>
      <Divider />
    </>
  );
};

export default UserListItem;
