import React, { useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Button, Flex, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { HiUser, HiUserGroup } from "react-icons/hi";

const baseUrl = "https://full-stack-messaging-app.onrender.com";

export default function Chats({ fetchAgain }) {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  useEffect(() => {
    async function fetchChats() {
      try {
        const { data } = await axios.get(`${baseUrl}/api/chat`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setChats(data);
      } catch (error) {
        toast({
          title: "An error occurred!",
          description: "Failed to fetch the chats.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
    fetchChats();
  }, [fetchAgain, setChats, toast, user]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p="3"
      bg="white"
      w={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
      opacity="0.9">
      <Box
        pb="3"
        px="3"
        w="100%"
        fontSize="30px"
        fontFamily="Work sans"
        display="flex"
        justifyContent="space-between"
        alignItems="center">
        Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
            rightIcon={<AddIcon />}>
            Create Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p="3"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="scroll">
        {chats ? (
          <Stack overflowY="hidden">
            {chats.map((chat) => (
              <Box
                onClick={(e) => setSelectedChat(chat)}
                cursor="pointer"
                _hover={{ bg: "#009E60" }}
                bg={selectedChat === chat ? "#009E60" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}>
                {!chat.isGroupChat ? (
                  <Flex alignItems="center">
                    <HiUser />
                    <Text
                      fontSize="1xl"
                      fontWeight="bold"
                      fontFamily="Work sans"
                      ml="3">
                      {getSender(user, chat.users)}
                    </Text>
                  </Flex>
                ) : (
                  <Flex alignItems="center">
                    <HiUserGroup />
                    <Text
                      fontSize="1xl"
                      fontWeight="bold"
                      fontFamily="Work sans"
                      ml="3">
                      {chat.chatName}
                    </Text>
                  </Flex>
                )}
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}
