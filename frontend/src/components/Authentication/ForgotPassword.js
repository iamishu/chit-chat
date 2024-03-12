import React, { useState } from "react";
import { Box, VStack, Text } from "@chakra-ui/layout";
import { Button, Image } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const ForgotPassword = ({ setActiveComponent }) => {

    const [email, setEmail] = useState();
    const [loading, setLoading] = useState();

    const toast = useToast();

    const submitHandler = async () => {
        setLoading(true);
        if (!email) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/reset",
                { email },
                config
            );
            if (data && !data.activated) {
                setLoading(false);
                // setActiveComponent("verify");
            } else {
                toast({
                    title: "Login Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                localStorage.setItem("userInfo", JSON.stringify(data));
                setLoading(false)
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
                fontWeight={600}
                color="var(--textClr)"
                mb="20px"
                w="100%"
            >
                Reset Password
            </Text>
            <FormControl id="email" isRequired mb="15px">
                <Input
                    focusBorderColor="var(--brandClr)"
                    placeholder="Email"
                    autoComplete="off"
                    capture="user"
                    autoFocus="none"
                    borderColor="#000"
                    borderWidth="2px"
                    minH="50px"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <Button
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
                color="var(--white)"
                minH="50px"
                borderRadius="10px"
                colorScheme="blue"
            >
                Send Reset Link
            </Button>
            <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                alignItems="center"
                marginTop="5px"
            >
                <Text
                    color="var(--textClr)"
                    cursor="pointer"
                    fontWeight={600}
                    _hover={{
                        color: "var(--brandClr)"
                    }}
                    onClick={() => setActiveComponent("login")}
                >
                    Login
                </Text>
                <Text
                    color="var(--textClr)"
                    cursor="pointer"
                    fontWeight={600}
                    _hover={{
                        color: "var(--brandClr)"
                    }}
                    onClick={() => setActiveComponent("signup")}
                >
                    Sign Up
                </Text>
            </Box>
            {/* <Box position="relative" p={10} w="100%">
        <Divider borderColor="var(--textClr)" />
        <AbsoluteCenter px="4" bg="var(--bgClr)" color="var(--textClr)" fontWeight={600}>
          Or
        </AbsoluteCenter>
      </Box> */}
        </VStack>
    );
};

export default ForgotPassword;
