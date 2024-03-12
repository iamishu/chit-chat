import React, { useState } from "react";
import { AbsoluteCenter, Box, Divider, VStack, Text } from "@chakra-ui/layout";
import { Button, Image } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import monkeyHide from "../../Assets/monkeyhide.png";
import monkeyShow from "../../Assets/monkeyshow.png";
import { ChatState } from "../../context/chatProvider";

const Login = ({ setActiveComponent }) => {
  const navigate = useNavigate();

  const { setUser } = ChatState();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleShowClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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
        "/api/user/login",
        { email, password },
        config
      );
      if (data && !data.activated) {
        setLoading(false);
        setUser(data);
        setActiveComponent("verify");
      } else {
        toast({
          title: "Login Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
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
        lineHeight="25px"
        color="var(--textClr)"
        mb="20px"
        w="100%"
      >
        Welcome Back 👏<br />
        <small style={{
          fontSize: "14px"

        }}>Login to your account.</small>
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

      <FormControl id="password" isRequired mb="15px">
        <InputGroup>
          <Input
            focusBorderColor="var(--brandClr)"
            type={show ? "text" : "password"}
            placeholder="Password"
            borderColor="#000"
            borderWidth="2px"
            minH="50px"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="3.5rem" top="5px">
            <Button
              h="1.75rem"
              size="sm"
              variant="ghost"
              bg="none !important"
              boxShadow="none !important"
              padding="0 !important"
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
        Login
      </Button>
      <Box
        display="flex"
        justifyContent="flex-end"
        w="100%"
        alignItems="center"
        marginTop="5px"
      >
        <Text
          color="var(--textClr)"
          cursor="pointer"
          _hover={{
            color: "var(--brandClr)"
          }}
          onClick={() => setActiveComponent("forgot")}
        >
          Reset Password
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        w="100%"
        alignItems="center"
        marginTop="25px"
      >
        <Text
          color="var(--textClr)"
          mr="5px"
        >
          Don't have an account?
        </Text>
        <Text
          color="var(--brandClr)"
          cursor="pointer"
          fontWeight={600}
          onClick={() => setActiveComponent("signup")}>Sign Up</Text>
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

export default Login;
