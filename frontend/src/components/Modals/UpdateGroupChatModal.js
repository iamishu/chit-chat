import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useToast,
  FormControl,
  Input,
  ModalFooter,
  Button,
  Box,
  Avatar,
  Text,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import React, { useState } from "react";
import { CheckIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import UserListItem from "../Misc/UserListItem";
import { IoPersonAdd, IoSave } from "react-icons/io5";
import AddMemberModal from "./AddMemberModal";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [leaveLoading, setLeaveLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [editName, setEditName] = useState(false);
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  const closeModal = () => {
    onClose();
    setGroupChatName("");
  };

  const handleUpdate = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setEditName(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleLeave = async () => {
    try {
      setLeaveLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/group/remove",
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        config
      );
      setLeaveLoading(false);
      user._id === selectedChat.groupAdmin._id
        ? setSelectedChat()
        : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to remove user.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <ViewIcon display={{ base: "flex" }} cursor="pointer" onClick={onOpen} />
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        isCentered
        scrollBehavior="inside"
        size="full"
      >
        <ModalOverlay />
        <ModalContent pb="20px" bg="#f0f2f5">
          <ModalHeader display="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Avatar
              boxSize="100px"
              name={selectedChat.chatName}
              src={selectedChat.pic}
              border="2px solid"
            />
            {!editName ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={2}
                mb={2}
              >
                <Text>{selectedChat.chatName}</Text>
                <EditIcon
                  ml={3}
                  cursor="pointer"
                  onClick={() => setEditName(true)}
                />
              </Box>
            ) : (
              <FormControl mt={2}>
                <InputGroup>
                  <Input
                    placeholder="Group Name"
                    mb={3}
                    value={
                      !groupChatName ? selectedChat.chatName : groupChatName
                    }
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <InputRightElement width="3.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleUpdate}
                      isLoading={renameLoading}
                    >
                      <CheckIcon />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            )}

            <Box
              textAlign="left"
              mb={3}
              p={3}
              w="100%"
              bg="#fff"
              borderRadius="10px"
              boxShadow="lg"
            >
              <Text>Group Members</Text>
              <Text fontSize="12px" mb={3}>
                {selectedChat.users.length} members
              </Text>
              <Box display="flex" w="100%" flexWrap="wrap">
                {selectedChat.groupAdmin.length > 0 &&
                  selectedChat.groupAdmin.filter((g) => g._id === user._id) && (
                    <AddMemberModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    >
                      <Box
                        w="100%"
                        variant="ghost"
                        textAlign="left"
                        display="flex"
                        alignItems="center"
                        px={3}
                        py={2}
                        mb={2}
                        cursor="pointer"
                        bg="transparent"
                        _hover={{
                          background: "#E8E8E8",
                          color: "black",
                        }}
                        borderRadius="lg"
                      >
                        <Icon
                          as={IoPersonAdd}
                          bg="teal"
                          color="white"
                          fontSize="35px"
                          p={2}
                          borderRadius="full"
                        />
                        <Text ml={3}>Add Members</Text>
                      </Box>
                    </AddMemberModal>
                  )}
                {selectedChat.users.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    type="group-members"
                    groupAdmin={selectedChat.groupAdmin}
                    setFetchAgain={setFetchAgain}
                    fetchAgain={fetchAgain}
                  />
                ))}
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={leaveLoading}
              colorScheme="red"
              onClick={handleLeave}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
