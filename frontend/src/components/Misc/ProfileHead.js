import { BellIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import React from "react";
import * as constant from "../../constants";
import { ChatState } from "../../context/chatProvider";
import { useDisclosure } from "@chakra-ui/hooks";
import MainDrawer from "../Drawers/MainDrawer";
import SearchDrawer from "../Drawers/SearchDrawer";
import { getNotificationContent, getSender } from "../../helpers/ChatHelper";
import NotificationBadge from "react-notification-badge";
import moment from "moment";

const ProfileHead = () => {
  const { user, setSelectedChat, notification, setNotification } = ChatState();
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            onClick={onMenuOpen}
            p="0px 10px"
            fontSize="18px"
            lineHeight="18px"
            variant="ghost"
            color="inherit"
            borderRadius="full"
            bg="none !important"
          >
            <Avatar name={user.name} src={user.pic} />
          </Button>
        </Box>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notification.length} />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              {!notification.length && (
                <MenuItem isDisabled={true}>No New Message</MenuItem>
              )}
              {notification.map((notifi, i) => (
                <>
                  <MenuItem
                    key={notifi._id}
                    onClick={() => {
                      setSelectedChat(notifi.chat);
                      setNotification(notification.filter((n) => n !== notifi));
                    }}
                    flexDir="column"
                  >
                    {notifi.chat?.isGroupChat ? (
                      <>
                        <Text
                          fontSize={12}
                          fontWeight={600}
                          // color="#a71607"
                          cursor="pointer"
                          display="block"
                          w="100%"
                        >
                          {notifi.chat?.chatName}
                        </Text>
                        <Text
                          fontSize={13}
                          display="flex"
                          alignItems="flex-end"
                          justifyContent="space-between"
                          w="100%"
                        >
                          {getNotificationContent(notifi.content)}
                          <small
                            style={{
                              fontWeight: 600,
                              color: "#333",
                            }}
                          >
                            {moment(notifi.createdAt).format("HH: mm A")}
                          </small>
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text
                          fontSize={12}
                          fontWeight={600}
                          // color="#a71607"
                          cursor="pointer"
                          display="block"
                          w="100%"
                        >
                          {getSender(user, notifi.chat.users)}
                        </Text>
                        <Text
                          fontSize={13}
                          display="flex"
                          alignItems="flex-end"
                          justifyContent="space-between"
                          w="100%"
                        >
                          {getNotificationContent(notifi.content)}
                          <small
                            style={{
                              fontWeight: 600,
                              color: "#333",
                            }}
                          >
                            {moment(notifi.createdAt).format("HH: mm A")}
                          </small>
                        </Text>
                      </>
                    )}
                  </MenuItem>
                  {notification.length > i + 1 && <Divider />}
                </>
              ))}
            </MenuList>
          </Menu>
          <Button
            bg="transparent"
            _hover={{ bg: "transparent" }}
            onClick={onSearchOpen}
            color="inherit"
          >
            <SearchIcon />
          </Button>
        </div>
      </Box>

      {/* Main Menu Drawer */}
      <MainDrawer
        isMenuOpen={isMenuOpen}
        onMenuClose={onMenuClose}
        user={user}
      />

      {/* Search Drawer */}
      <SearchDrawer
        isSearchOpen={isSearchOpen}
        onSearchClose={onSearchClose}
        user={user}
        setSelectedChat={setSelectedChat}
      />
    </>
  );
};

export default ProfileHead;
