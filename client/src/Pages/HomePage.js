import React, { useEffect } from "react";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Image,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useHistory } from "react-router-dom";
import icon from "../images/icon.png";

export default function HomePage() {
  const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        alignItems="center"
        p="3"
        w="100%"
        m="40px 0 15px 0"
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        borderRadius="lg">
        <Flex justifyContent="center">
          <Image src={icon} boxSize="50px" />
          <Text
            color="white"
            fontSize="4xl"
            fontWeight="bold"
            fontFamily="Work sans"
            textAlign="center"
            ml="3">
            MERN Stack Chat App
          </Text>
        </Flex>
      </Box>

      <Box
        bg="white"
        opacity="0.9"
        w="100%"
        p="4"
        borderRadius="lg"
        borderWidth="1px"
        mb="2em">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab w="50%">Log In</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}
