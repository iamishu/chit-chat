import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    IconButton,
    Image,
    Text,
    useToast,
    FormControl,
    Input,
    ModalFooter,
    Button,
    Box,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import React, { useState } from 'react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import UserListItem from '../Misc/UserListItem';
import UserBadgeItem from '../Misc/UserBadgeItem';

const GroupChatModal = ({ children, onMenuClose }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    const closeModal = () => {
        onClose();
        setSearch("");
        setSelectedUsers([]);
        setGroupChatName("");
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

    const handleUserDelete = (delUser) => {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== delUser._id)
        );
    };

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already addedd!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.post(`/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map(u => u._id))
                },
                config
            );
            setChats([data, ...chats]);
            closeModal();
            onMenuClose();
            toast({
                title: "Group Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to create the group.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    return (
        <>{children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
        )}
            <Modal isOpen={isOpen} onClose={closeModal} isCentered>
                <ModalOverlay />
                <ModalContent pb="20px">
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                    >
                        Create New Group
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input
                                placeholder='Group Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='Add Users'
                                mb={1}
                                value={search}
                                onChange={(e) => handleSearh(e.target.value)}
                            />
                        </FormControl>
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
                        {loading
                            ? <div>loading ...</div>
                            : searchResult?.slice(0, 4).map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal;