import React, { useState, createRef } from "react";
import { AbsoluteCenter, Box, Divider, Text, VStack } from "@chakra-ui/layout";
import { Button, Image, Spinner } from "@chakra-ui/react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import monkeyHide from "../../Assets/monkeyhide.png";
import monkeyShow from "../../Assets/monkeyshow.png";
import defaultPic from "../../Assets/user.png";
import { TbCameraPlus } from "react-icons/tb";

const SignUp = ({ setActiveComponent }) => {
  const navigate = useNavigate();
  const fileInputRef = createRef();
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const toast = useToast();

  const handleShowClick = () => setShow(!show);

  const handleImageChange = (pics) => {
    setImageLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setImageLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "friendly");
      data.append("cloud_name", "dkyunbijq");
      fetch("https://api.cloudinary.com/v1_1/dkyunbijq/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.secure_url.toString());
          setImageLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setImageLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setImageLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not Match!",
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
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      if (data) {
        if (data.status === "PENDING") {
          setLoading(false);
          setActiveComponent("email");
        } else {
          toast({
            title: data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error Occur!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const onInputFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <VStack spacing="5px">
      <Text
        fontSize="20px"
        // fontWeight={600}
        color="#61677c"
        mb="20px"
        textAlign="center"
      >
        Sign Up to start chatting <br />
        with your friends!
      </Text>
      <Box
        mb="15px"
        position="relative"
        boxShadow="-5px -5px 5px rgba(92, 92, 92, 0.1),
    10px 10px 10px rgba(0, 0, 0, 0.4), inset -5px -5px 5px rgba(82, 82, 82, 0.2),
    inset 10px 10px 10px rgba(0, 0, 0, 0.4)"
        w="120px"
        h="120px"
        borderRadius="full"
        overflow="hidden"
        p="6px"
      >
        <Image
          src={!pic ? defaultPic : pic}
          opacity={!pic ? 0.5 : 1}
          borderRadius="full"
        />
        {!pic && !imageLoading && (
          <TbCameraPlus
            onClick={onInputFileClick}
            style={{
              fontSize: "30px",
              position: "absolute",
              top: "45px",
              left: "45px",
              cursor: "pointer",
            }}
          />
        )}
        {!pic && imageLoading && (
          <Spinner
            style={{
              fontSize: "30px",
              position: "absolute",
              top: "35px",
              left: "35px",
              cursor: "pointer",
            }}
          />
        )}
        <Input
          type="file"
          display="none"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
          ref={fileInputRef}
        />
      </Box>

      <FormControl id="first-name" isRequired mb="15px">
        <Input
          focusBorderColor="#54D8FA"
          placeholder="Name *"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired mb="15px">
        <InputGroup>
          <Input
            focusBorderColor="#54D8FA"
            placeholder="Email *"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired mb="15px">
        <InputGroup>
          <Input
            focusBorderColor="#54D8FA"
            type={show ? "text" : "password"}
            placeholder="Password *"
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
            placeholder="Confirm Password *"
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
      <Box position="relative" p={10} w="100%">
        <Divider borderColor="#61677c" />
        <AbsoluteCenter px="4" bg="#1d1e22" color="#61677c">
          Already have an account?
        </AbsoluteCenter>
      </Box>
      <Box w="100%">
        <Button
          width="100%"
          onClick={() => setActiveComponent("login")}
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

export default SignUp;
