import React from 'react';
import { getChatTime, isFirstMessage, isSameSender, isSameSenderMargin, isSameUser } from '../helpers/ChatHelper';
import { Avatar, Text, Tooltip } from '@chakra-ui/react';
import "./chat.css";
import ProfileModal from './Modals/ProfileModal';
import { ArrowDownIcon } from '@chakra-ui/icons';

const Message = ({ m, messages, i, user }) => {
    return (
        <div
            style={{ display: "flex", width: "calc(100% - 60px)", margin: "0 auto" }}
            key={m?._id}
        >
            {(isSameSender(messages, m, i, user._id) ||
                isFirstMessage(messages, i, user._id)) && (
                    <ProfileModal user={m?.sender}>
                        <Tooltip
                            label={m?.sender.name}
                            hasArrow
                            placement='bottom-start'
                        >
                            <Avatar
                                mt="7px"
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={m?.sender.name}
                                src={m?.sender.pic}
                            />
                        </Tooltip>
                    </ProfileModal>
                )}
            <span
                style={{
                    backgroundColor: `${m?.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                    borderRadius: `${(isSameSender(messages, m, i, user._id) ||
                        isFirstMessage(messages, i, user._id)) ? "0px 20px 20px 20px" : "20px"}`,
                    padding: "5px 15px",
                    maxWidth: "75%",
                    position: "relative",
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 5 : 10,
                    display: "flex",
                    flexDirection: "column"
                }}
                className={(isSameSender(messages, m, i, user._id) ||
                    isFirstMessage(messages, i, user._id)) && "message-head"}
            >
                {m?.chat.isGroupChat && (isSameSender(messages, m, i, user._id) ||
                    isFirstMessage(messages, i, user._id)) && (
                        <ProfileModal user={m?.sender}>
                            <Text
                                fontSize={12}
                                fontWeight={600}
                                color="#a71607"
                                cursor="pointer"
                            >
                                {m?.sender.name}
                            </Text>
                        </ProfileModal>
                    )}
                {m?.content}
                <small
                    style={{
                        width: "100%",
                        textAlign: "right",
                        fontSize: "11px",
                        color: "#555"
                    }}
                >{getChatTime(m?.createdAt)}</small>
            </span>
        </div>
    )
}

export default Message