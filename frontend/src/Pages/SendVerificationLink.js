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
        color="var(--warningClr)"
        mt="20px"
        textAlign="center"
      >
        Your account is not activated yet!
      </Text>
      <Text
        textAlign="center"
        color="var(--textClr)"
        fontSize="14px"
      >
        Create new verification link by clicking <b style={{ color: "var(--brandClr)" }}>Send Verification Link</b>{" "}
        button.
      </Text>
      <Button
        width="100%"
        style={{ marginTop: 10 }}
        onClick={handleSendLink}
        isLoading={loading}
        minH="50px"
        borderRadius="10px"
        colorScheme="blue"
      >
        Send Verification Link
      </Button>
    </VStack>
  );
};

export default SendVerificationLink;
