import React, { createRef, useCallback, useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon, CloseIcon, LockIcon } from "@chakra-ui/icons";
import { AppName } from "../../constants";
import { getSender, getSenderDetail } from "../../helpers/ChatHelper";
import ProfileModal from "../Modals/ProfileModal";
import UpdateGroupChatModal from "../Modals/UpdateGroupChatModal";
import { IoMdSend } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import ScrollableChat from "../ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import typingAnimation from "../../animation/typing.json";
import { HiPlusSm } from "react-icons/hi";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [placeholderStatus, setPlaceholderStatus] = useState(true);
  const [typer, setTyper] = useState("");

  const msgDivRef = createRef();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    socket.on("typing", (typerName) => {
      setIsTyping(true);
      setTyper(typerName);
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const handleTyping = () => {

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", { room: selectedChat._id, name: user.name });
    }

    let lastTypingTime = new Date().getTime();
    var timerLen = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLen && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLen);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the messages.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSendMessage = async () => {
    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/message",
        {
          content: msgDivRef.current.innerHTML,
          chatId: selectedChat._id,
        },
        config
      );
      socket.emit("new message", data);
      msgDivRef.current.innerHTML = "";
      setFetchAgain(!fetchAgain);
      setMessages([...messages, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send a message.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved?.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  useEffect(() => {
    const message = document.getElementsByClassName("message");
    for (var i = 0; i < message.length; i++) {
      const imgs = message[i].getElementsByTagName('img');
      if (message[i].innerText === "" && imgs.length === 1) {
        imgs[0].classList.add("onlyImage");
      }
    }
  }, [messages])

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "25px" }}
            p="0px 20px"
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            bg="inherit"
            h="60px"
            minH="60px"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
                setFetchAgain(!fetchAgain);
              }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderDetail(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            overflowY="hidden"
            color="var(--textClr)"
            bg="var(--chatBg)"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color="teal"
              />
            ) : (
              <Box
                display="flex"
                flexDir="column"
                overflowY="scroll"
                style={{ scrollbarWidth: "none" }}
                mb={4}
              >
                <ScrollableChat messages={messages} />
              </Box>
            )}
            {isTyping ? (
              <Text
                display="flex"
                alignItems="center"
                fontSize={12}
                color="#555"
                margin="0px 0px 15px 47px"
              >
                {typer} is Typing
                <Lottie
                  options={defaultOptions}
                  width={50}
                  height="auto"
                  style={{ margin: "0px" }}
                />
              </Text>
            ) : (
              <></>
            )}
          </Box>
          {emojiOpen && (
            <Box w="100%" position="relative">
              <EmojiPicker
                height={300}
                width="100%"
                style={{
                  position: "absolute",
                  bottom: 0
                }}
                emojiStyle="google"
                searchDisabled
                onEmojiClick={(emoji) => {
                  setNewMessage((prevState) => `${prevState + "<img src=" + emoji.imageUrl + " alt=" + emoji.emoji + " class='emoji-msg'  />"}`)
                  msgDivRef.current?.insertAdjacentHTML('beforeend', "<img src=" + emoji.imageUrl + " alt=" + emoji.emoji + " class='emoji-msg'  />");
                }}
                previewConfig={{ showPreview: false }}
              />
            </Box>
          )}
          <FormControl
            display="flex"
            alignItems="center"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newMessage) {
                handleSendMessage();
              }
            }}
            bg="var(--bgClr)"
            p={2}
          >
            <Button
              size="md"
              variant="ghost"
              bg="transparent !important"
              width="30px"
              marginRight="5px"
              p={0}
              onClick={() => setEmojiOpen(!emojiOpen)}
            >
              {emojiOpen ? (
                <CloseIcon color="#61677c" size="80%" />
              ) : (
                <MdOutlineEmojiEmotions size="80%" color="#61677c" />
              )}
            </Button>
            <Button
              size="md"
              variant="ghost"
              bg="transparent !important"
              width="30px"
              marginRight="5px"
              p={0}
            // onClick={() => setEmojiOpen(!emojiOpen)}
            >
              <HiPlusSm size="80%" color="#61677c" />
            </Button>
            <Box
              contentEditable
              display="flex"
              flexWrap="wrap"
              onInput={(e) => {
                e.currentTarget.innerHTML === ""
                  ? setPlaceholderStatus(true)
                  : setPlaceholderStatus(false);
                handleTyping();
              }}
              p="6px 10px"
              w="100%"
              borderRadius="10px"
              bg="var(--white)"
              focusBorderColor="none !important"
              borderWidth="0px"
              outline="none"
              _focus={{
                boxShadow: "none"
              }}
              ref={msgDivRef}
              className="msg-box"
              role="textbox"
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            {(placeholderStatus && !newMessage) && <Text className="editor-placeholder">Type a message...</Text>}
            <Button
              size="md"
              variant="ghost"
              bg="transparent !important"
              width="60px"
              onClick={handleSendMessage}
              isDisabled={msgDivRef.current?.innerHTML === ""}
            >
              <IoMdSend
                fontSize="20px"
                color="var(--iconClr)"
              />
            </Button>
          </FormControl>
        </>
      ) : (
        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Alert
            status="warning"
            display="flex"
            flexDir="column"
            maxW="300px"
            w="100%"
            textAlign="center"
            borderRadius="20px"
            fontSize="12px"
            boxShadow="md"
            mb={4}
            color="#000"
            fontWeight={500}
          >
            <LockIcon mb={2} />
            End-to-end encryption keeps personal messages that you send to your
            friends private. Not even {AppName} can read <br />
            or listen to them.
          </Alert>
          <Text fontSize="20px" color="#777" pb={3}>
            Click on user to start chatting
          </Text>
        </Box>
      )
      }
    </>
  );
};

export default SingleChat;
