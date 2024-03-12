import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack p={2}>
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
      <Skeleton height="50px" borderRadius="0px" />
    </Stack>
  );
};

export default ChatLoading;
