import { Avatar, Badge, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction, type, groupAdmin }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      // bg={type === "search" ? "#E8E8E8" : "transparent"}
      // _hover={{
      //   background: `${type === "search" ? "teal" : "#E8E8E8"}`,
      //   color: `${type === "search" ? "white" : "black"}`,
      // }}
      w="100%"
      display="flex"
      alignItems="center"
      // color="black"
      px={3}
      py={2}
      mb={2}
      //   borderRadius="lg"
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
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box w="100%">
        <Text display="flex" justifyContent="space-between" alignItems="center">
          {user.name}
          {groupAdmin && groupAdmin._id === user._id && (
            <Badge
              ml="1"
              colorScheme="green"
              fontSize="10px"
              textTransform="capitalize"
            >
              Group Admin
            </Badge>
          )}
        </Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
