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
        fontSize="25px"
        fontWeight={600}
        color="var(--textClr)"
        mb="20px"
        w="100%"
      >
        Create your account 👏
      </Text>
      {/* <Box
        mb="15px"
        position="relative"
        w="120px"
        h="120px"
        borderRadius="full"
        overflow="hidden"
        p="6px"
        border="2px solid var(--textClr)"
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
              top: "45px",
              left: "45px",
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
      </Box> */}

      <FormControl id="first-name" isRequired mb="15px">
        <Input
          focusBorderColor="#54D8FA"
          placeholder="Name"
          borderColor="#000"
          borderWidth="2px"
          minH="50px"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired mb="15px">
        <InputGroup>
          <Input
            focusBorderColor="#54D8FA"
            placeholder="Email"
            borderColor="#000"
            borderWidth="2px"
            minH="50px"
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
            placeholder="Password"
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
        minH="50px"
        borderRadius="10px"
        colorScheme="blue"
      >
        Sign Up
      </Button>
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
          Already have an account?
        </Text>
        <Text
          color="var(--brandClr)"
          cursor="pointer"
          fontWeight={600}
          onClick={() => setActiveComponent("login")}>Login</Text>
      </Box>
      {/* <Box position="relative" p={10} w="100%">
        <Divider borderColor="#61677c" />
        <AbsoluteCenter px="4" bg="#1d1e22" color="#61677c">
          Already have an account?
        </AbsoluteCenter>
      </Box> */}
    </VStack>
  );
};

export default SignUp;
