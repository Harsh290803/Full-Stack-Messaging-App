import {
  Button,
  Tooltip,
  Text,
  Box,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  Flex,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import icon from "../../images/icon.png";
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import axios from "axios";
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

const baseUrl = "https://full-stack-messaging-app.onrender.com";

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { setSelectedChat, chats, setChats, notification, setNotification } =
    ChatState();

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("user");
    history.push("/");
    history.go("/");
  }

  async function handleSearch() {
    if (!search) {
      toast({
        title: "Search field is empty!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/api/user/searchUsers?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "An error occured!",
        description: "Failed to load the search results.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  }

  async function accessChat(userId) {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        `${baseUrl}/api/chat`,
        { userId },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (!chats.find((c) => c._id === data._id)) setChats([...chats, data]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "An error occured!",
        description: "Failed to load the selected chat.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip label="Search for users" hasArrow placement="bottom-end">
          <Button variant="solid" onClick={onOpen}>
            <IoSearch />
            <Text
              display={{ base: "none", md: "flex" }}
              ml="1"
              px="1"
              fontFamily="Work sans">
              Search
            </Text>
          </Button>
        </Tooltip>
        <Flex alignItems="center">
          <Image src={icon} boxSize="35px" />
          <Text
            color="black"
            fontSize="2xl"
            fontWeight="bold"
            fontFamily="Work sans"
            textAlign="center"
            ml="3">
            MERN Stack Chat App
          </Text>
        </Flex>
        <div>
          <Menu>
            <MenuButton p="1">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif.id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}>
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.photo}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={(e) => handleLogout(e)}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontFamily="Work sans" borderBottomWidth="1px">
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" fontFamily="Work sans" pb={2}>
              <Input
                placeholder="Search by name/email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={() => handleSearch()}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
