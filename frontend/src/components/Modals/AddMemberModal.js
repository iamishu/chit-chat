import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    useToast,
    FormControl,
    Input,
    Spinner,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import React, { useEffect, useState } from 'react'
import UserListItem from '../Misc/UserListItem';
import UserBadgeItem from '../Misc/UserBadgeItem';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';

const AddMemberModal = ({ fetchAgain, setFetchAgain, children }) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user, selectedChat, setSelectedChat } = ChatState();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);


    const handleClose = () => {
        setLoading(false);
        setSearch("");
        setSearchResult([]);
        onClose();
    }

    const handleSearh = async (query) => {
        setSearch(query);
        if (!query) {
            setSearch("");
            setSearchResult([]);
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the search results.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleUserDelete = async (delUser) => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.put('/api/chat/group/remove',
                {
                    chatId: selectedChat._id,
                    userId: delUser._id
                },
                config
            );
            setLoading(false);
            setSelectedChat(data);
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

    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast({
                title: "User already in the group!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.put('/api/chat/group/add',
                {
                    chatId: selectedChat._id,
                    userId: userToAdd._id
                },
                config
            );
            setLoading(false);
            setSelectedChat(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to add user.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    useEffect(() => {
        setSelectedUsers(selectedChat.users.filter(u => u._id !== selectedChat.groupAdmin._id))
    }, [selectedChat]);

    return (
        <>
            <Box w="100%" borderRadius="lg" onClick={onOpen}>{children}</Box>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                isCentered
                scrollBehavior='inside'
            >
                <ModalOverlay />
                <ModalContent pb="20px">
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                    >
                        Add Members
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <Box
                            display="flex"
                            w="100%"
                            flexWrap="wrap"
                        >
                            {selectedUsers.map(user => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleUserDelete(user)}
                                />
                            ))}
                        </Box>
                        <FormControl>
                            <Input
                                placeholder='Add Users'
                                mb={1}
                                value={search}
                                onChange={(e) => handleSearh(e.target.value)}
                            />
                        </FormControl>
                        {loading
                            ? <Spinner />
                            : searchResult?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                    type="member"
                                />
                            ))}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddMemberModal