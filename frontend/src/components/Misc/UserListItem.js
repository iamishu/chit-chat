import { Avatar, Badge, Box, Divider, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction, type, groupAdmin }) => {
  return (<>
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
    <Divider />
  </>);
};

export default UserListItem;
