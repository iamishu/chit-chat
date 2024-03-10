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
        and verify your account.
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
          Login
        </Button>
      </Box>
    </VStack>
  );
};

export default EmailSent;
