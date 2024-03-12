import React, { useState } from "react";
import { Box, VStack, Text, Container } from "@chakra-ui/layout";
import { Button, Image } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import monkeyHide from "../../Assets/monkeyhide.png";
import monkeyShow from "../../Assets/monkeyshow.png";
import * as constant from "../../constants";

const ResetPassword = () => {

    const [show, setShow] = useState(false);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [loading, setLoading] = useState();

    const toast = useToast();

    const handleShowClick = () => setShow(!show);

    const submitHandler = async () => {
        setLoading(true);
        if (!password || !confirmPassword) {
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
                { password },
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
        <Container maxw="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                w="100%"
                m="20px 0"
                borderRadius="lg"
                borderWidth="0px"
                className="home-content"
            >
                <Text
                    fontSize="20px"
                    fontWeight={700}
                    color="var(--brandClr)"
                    textAlign="center"
                    m="15px 0 0px 0"
                    p="25px 25px 0"
                >
                    <Image
                        src={constant.AppLogo}
                        alt="TalkIt Logo"
                        boxSize="48px"
                        m="0 auto"
                        objectFit="cover"
                    />
                    {constant.AppName}
                </Text>

                <Box mt="20px">
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
                        <FormControl id="password" isRequired mb="15px">
                            <InputGroup>
                                <Input
                                    focusBorderColor="#54D8FA"
                                    type={show ? "text" : "password"}
                                    placeholder="New Password"
                                    borderColor="#000"
                                    borderWidth="2px"
                                    minH="50px"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement width="3.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        variant="ghost"
                                        bg="none !important"
                                        boxShadow="none !important"
                                        padding="0 !important"
                                        margin="8px 15px 0 0"
                                        _hover={{ bg: "none !important", boxShadow: "none !important" }}
                                        onClick={handleShowClick}
                                    >
                                        {show ? <Image src={monkeyShow} /> : <Image src={monkeyHide} />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        <FormControl id="confirm-password" isRequired mb="15px">
                            <InputGroup>
                                <Input
                                    focusBorderColor="#54D8FA"
                                    type={show ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    borderColor="#000"
                                    borderWidth="2px"
                                    minH="50px"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <InputRightElement width="3.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        variant="ghost"
                                        bg="none !important"
                                        boxShadow="none !important"
                                        padding="0 !important"
                                        margin="8px 15px 0 0"
                                        _hover={{ bg: "none !important", boxShadow: "none !important" }}
                                        onClick={handleShowClick}
                                    >
                                        {show ? <Image src={monkeyShow} /> : <Image src={monkeyHide} />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
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
                            Reset Password
                        </Button>

                    </VStack>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPassword;
