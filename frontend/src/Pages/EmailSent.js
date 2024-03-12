import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Checkmark } from "react-checkmark";

const EmailSent = ({ setActiveComponent, emailParent, setEmailParent }) => {
  return (
    <VStack spacing="5px" mt="20px">
      <Checkmark color="teal" size="80px" />
      <Text
        fontSize="25px"
        fontWeight={700}
        color="teal"
        textShadow="1px 1px 3px rgba(92, 92, 92, 0.1) !important"
        mt="20px"
        textAlign="center"
      >
        {emailParent === "signup"
          ? "Sign Up Completed!"
          : "Verification Email Sent!"}
      </Text>
      <Text textAlign="center" color="teal">
        An email with verification link has been sent. Please check your inbox
        and activate your account.
      </Text>
      <Box position="relative" p={10} w="100%">
        <Divider borderColor="#61677c" />
      </Box>
      <Box w="100%">
        <Button
          width="100%"
          onClick={() => {
            setActiveComponent("login");
            setEmailParent("signup");
          }}
          minH="50px"
          borderRadius="10px"
          colorScheme="blue"
        >
          Login
        </Button>
      </Box>
    </VStack>
  );
};

export default EmailSent;
