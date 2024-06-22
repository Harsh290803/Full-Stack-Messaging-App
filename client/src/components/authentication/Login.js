import React, { useState } from "react";
import {
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";

const baseUrl = "http://localhost:5000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  async function handleSubmit() {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/user/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast({
        title: "Log in successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("user", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
      history.go("/chats");
    } catch (err) {
      toast({
        title: "An error occurred while logging in! Please try again.",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing="5px">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement w="3rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="green"
        w="20%"
        mt="15"
        onClick={handleSubmit}
        isLoading={loading}>
        Log In
      </Button>

      <Button
        variant="solid"
        colorScheme="blue"
        w="25%"
        mt="1"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}>
        Guest User
      </Button>
    </VStack>
  );
}
