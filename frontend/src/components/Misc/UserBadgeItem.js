import { CloseIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            cursor="pointer"
            bg="teal"
            color="white"
            px={2}
            py={1}
            mr={2}
            mb={2}
            borderRadius="lg"
            variant="solid"
            fontSize={12}
        >
            {user.name}
            <CloseIcon
                pl={2}
                fontSize={15}
                onClick={handleFunction}
            />
        </Box>
    )
}

export default UserBadgeItem