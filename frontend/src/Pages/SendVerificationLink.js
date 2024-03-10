import { Box, Button, Divider, Text, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";

const SendVerificationLink = ({
  setActiveComponent,
  emailParent,
  setEmailParent,
}) => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = ChatState();
  const toast = useToast();

  const handleSendLink = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/resend/email",
        { _id: user?._id, name: user?.name, email: user?.email },
        config
      );
      if (data && data.status === "PENDING") {
        setEmailParent("verify");
        setActiveComponent("email");
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <Text
        fontSize="25px"
        fontWeight={700}
        color="#b28e00"
        textShadow="1px 1px 1px rgba(92, 92, 92, 0.1) !important"
        mt="20px"
        textAlign="center"
      >
        Your account is not verified yet!
      </Text>
      <Text
        textShadow="1px 1px 1px rgba(92, 92, 92, 0.1) !important"
        textAlign="center"
        color="#b28e00"
        fontSize="14px"
      >
        Create new verification link by clicking <b>Send Verification Link</b>{" "}
        button.
      </Text>
      <Button
        width="100%"
        style={{ marginTop: 10 }}
        onClick={handleSendLink}
        isLoading={loading}
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
        Send Verification Link
      </Button>
      <Box position="relative" p={10} w="100%">
        <Divider borderColor="#61677c" />
      </Box>
      <Box w="100%" mt="10px">
        <Button
          width="100%"
          onClick={() => {
            setActiveComponent("login");
            setEmailParent("signup");
            setUser();
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
          Log Out
        </Button>
      </Box>
    </VStack>
  );
};

export default SendVerificationLink;
