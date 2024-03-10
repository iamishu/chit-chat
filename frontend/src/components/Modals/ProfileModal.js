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
    Avatar,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/hooks';
import React from 'react'
import { ViewIcon } from '@chakra-ui/icons';

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>{children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
        )}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent pb="20px">
                    <ModalHeader
                        display="flex"
                        justifyContent="center"
                    >
                        {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                    >
                        <Avatar
                            borderRadius="full"
                            boxSize="150px"
                            src={user.pic}
                            name={user.name}
                            m="10px 0 20px"
                        />
                        <Text><b>Email:</b> {user.email}</Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal