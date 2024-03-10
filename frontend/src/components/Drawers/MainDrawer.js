import { Avatar, Box, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Icon, Text } from '@chakra-ui/react';
import React from 'react'
import { FaUser } from 'react-icons/fa';
import { HiOutlineLogout } from 'react-icons/hi';
import ProfileModal from '../Modals/ProfileModal';
import { useNavigate } from 'react-router-dom';
import { PlusSquareIcon } from '@chakra-ui/icons';
import GroupChatModal from '../Modals/GroupChatModal';

const MainDrawer = ({
    onMenuClose,
    isMenuOpen,
    user,
}) => {
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    }

    return (
        <Drawer
            placement='left'
            onClose={() => {
                onMenuClose();
            }}
            isOpen={isMenuOpen}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader
                    borderBottomWidth="1px"
                    display="flex"
                    flexDir="column"
                    alignItems="start"
                    bg="#54D8FA"
                >
                    <Avatar
                        boxSize="90px"
                        src={user.pic}
                        name={user.name}
                        border="2px solid #fff"
                    />
                    <Text
                        fontSize="15px"
                        marginTop="15px"
                        fontWeight={600}
                    >
                        {user.name}
                    </Text>
                    <Text
                        fontSize="14px"
                        color="#333"
                        fontWeight={400}
                    >
                        {user.email}
                    </Text>
                    <DrawerCloseButton />
                </DrawerHeader>
                <DrawerBody
                    p="10px 0px"
                >
                    <Box>
                        <GroupChatModal onMenuClose={onMenuClose}>
                            <Box
                                display="flex"
                                alignItems="center"
                                p="10px 1.5rem"
                                cursor="pointer"
                                _hover={{ bg: "#edf2f7" }}
                            >
                                <PlusSquareIcon
                                    fontSize="17px"
                                    color="#b1c9d5"
                                />
                                <Text
                                    width="100%"
                                    ml="10px"
                                    fontSize="16px"
                                    fontWeight={500}
                                >
                                    Create Group
                                </Text>
                            </Box>
                        </GroupChatModal>
                        <Divider />
                        <ProfileModal user={user}>
                            <Box
                                display="flex"
                                alignItems="center"
                                p="10px 1.5rem"
                                cursor="pointer"
                                _hover={{ bg: "#edf2f7" }}
                            >
                                <Icon
                                    as={FaUser}
                                    fontSize="17px"
                                    color="#b1c9d5"
                                />
                                <Text
                                    width="100%"
                                    ml="10px"
                                    fontSize="16px"
                                    fontWeight={500}
                                >
                                    Profile
                                </Text>
                            </Box>
                        </ProfileModal>
                        <Divider />
                        <Box
                            display="flex"
                            alignItems="center"
                            p="10px 1.5rem"
                            cursor="pointer"
                            _hover={{ bg: "#edf2f7" }}
                            onClick={logoutHandler}
                        >
                            <Icon
                                as={HiOutlineLogout}
                                fontSize="17px"
                                color="#b1c9d5"
                            />
                            <Text
                                width="100%"
                                ml="10px"
                                fontSize="16px"
                                fontWeight={500}
                            >
                                Logout
                            </Text>
                        </Box>
                    </Box>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default MainDrawer