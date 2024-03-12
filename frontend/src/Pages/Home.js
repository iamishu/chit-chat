import React, { useEffect, useState } from "react";
import { Container, Box, Text, Image } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import * as constant from "../constants";
import { useNavigate } from "react-router-dom";
import { Fade } from "react-animated-components";
import EmailSent from "./EmailSent";
import SendVerificationLink from "./SendVerificationLink";
import ForgotPassword from "../components/Authentication/ForgotPassword";

const Home = () => {
  const navigate = useNavigate();

  const [activeComponent, setActiveComponent] = useState("login");
  const [emailParent, setEmailParent] = useState("signup");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user) {
      navigate("/");
    } else {
      navigate("/chats");
    }
  }, [navigate]);

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

        <Box>
          {activeComponent === "login" && (
            <Fade style={{ padding: "25px" }}>
              <Login setActiveComponent={setActiveComponent} />
            </Fade>
          )}
          {activeComponent === "signup" && (
            <Fade style={{ padding: "25px" }}>
              <SignUp setActiveComponent={setActiveComponent} />
            </Fade>
          )}
          {activeComponent === "email" && (
            <Fade style={{ padding: "25px" }}>
              <EmailSent
                setActiveComponent={setActiveComponent}
                emailParent={emailParent}
                setEmailParent={setEmailParent}
              />
            </Fade>
          )}
          {activeComponent === "verify" && (
            <Fade style={{ padding: "25px" }}>
              <SendVerificationLink
                setActiveComponent={setActiveComponent}
                emailParent={emailParent}
                setEmailParent={setEmailParent}
              />
            </Fade>
          )}
          {activeComponent === "forgot" && (
            <Fade style={{ padding: "25px" }}>
              <ForgotPassword
                setActiveComponent={setActiveComponent}
              />
            </Fade>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
