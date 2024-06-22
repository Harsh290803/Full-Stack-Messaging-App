import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import Chats from "../components/Chats";
import ChatBox from "../components/ChatBox";
import { useHistory } from "react-router-dom";

export default function ChatsPage() {
  const { user, setUser } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      history.push("/");
    } else {
      setUser(JSON.parse(user));
    }
  }, [history, setUser]);

  return (
    <div style={{ width: "100%" }}>
      {user && (
        <>
          <SideDrawer />
          <Box
            display="flex"
            justifyContent="space-between"
            w="100%"
            h="90vh"
            p="10px">
            <Chats fetchAgain={fetchAgain} />
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </Box>
        </>
      )}
    </div>
  );
}
