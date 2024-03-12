import React from 'react'
import { ChatState } from '../../context/chatProvider'
import { getChatTime, getSender, getSenderDetail } from '../../helpers/ChatHelper';
import { Avatar, Box, Text } from '@chakra-ui/react';

const ChatHeads = ({ chat, loggedUser }) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
    return (
        <Box
            onClick={() => setSelectedChat(chat)}
            cursor="pointer"
            bg={selectedChat === chat ? "var(--bgClr)" : "#fff"}
            color={"var(--textClr)"}
            _hover={{
                bg: `${selectedChat !== chat && "#f5f6f6"}`,
            }}
            px={3}
            py={2}
            key={chat._id}
            display="flex"
            alignItems="center"
        >
            <Avatar
                name={
                    !chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName
                }
                src={
                    !chat.isGroupChat
                        ? getSenderDetail(user, chat.users).pic
                        : ""
                }
                border={
                    getSenderDetail(user, chat.users).active
                        ? "2px solid #2ecc71"
                        : "2px solid #95a5a6"
                }
                marginRight="10px"
            />
            <Text display="flex" flexDir="column" alignItems="flex-start" width="70%">
                {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                {chat.latestMessage && (
                    <div
                        className='last-message'
                        style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "inline-block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%"
                        }}
                        dangerouslySetInnerHTML={{
                            __html: chat.latestMessage.content
                        }}
                    />
                )}
            </Text>
            <Text
                fontSize={12}
                fontWeight={600}
                marginLeft="auto"
                alignItems="flex-end"
            >
                {getChatTime(chat.updatedAt)}
            </Text>
        </Box>
    )
}

export default ChatHeads