import React, { useState } from "react";
import { AbsoluteCenter, Box, Divider, VStack } from "@chakra-ui/layout";
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
      <FormControl id="email" isRequired mb="15px">
        <Input
          focusBorderColor="#54D8FA"
          placeholder="Email"
          autoComplete="off"
          capture="user"
          autoFocus="none"
          _autofill={{
            boxShadow: `-5px -5px 5px rgba(92, 92, 92, 0.1), 10px 10px 10px rgba(0, 0, 0, 0.4), inset -5px -5px 5px rgba(82, 82, 82, 0.2), inset 10px 10px 10px rgba(0, 0, 0, 0.4) !important`,
            backgroundColor: "transparent !important",
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired mb="15px">
        <InputGroup>
          <Input
            focusBorderColor="#54D8FA"
            type={show ? "text" : "password"}
            placeholder="Password"
            value={password}
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

      <Button
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
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
        Login
      </Button>
      <Link
        style={{
          width: "100%",
          textAlign: "right",
          marginTop: "10px",
          color: "#61677c",
          textDecoration: "underline",
        }}
        to="/forgot"
      >
        Forgot Password?
      </Link>
      <Box position="relative" p={10} w="100%">
        <Divider borderColor="#61677c" />
        <AbsoluteCenter px="4" bg="#1d1e22" color="#61677c" fontWeight={600}>
          Or
        </AbsoluteCenter>
      </Box>
      <Box w="100%" mt="10px">
        <Button
          width="100%"
          onClick={() => setActiveComponent("signup")}
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
          Sign Up
        </Button>
      </Box>
    </VStack>
  );
};

export default Login;
