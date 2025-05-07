// app/chat/page.js
"use client";
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import AppAppBar from "../home-page/components/AppAppBar";
import AppTheme from "../shared-theme/AppTheme";
import Footer from "../home-page/components/Footer";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! My name is Dash, the AI Support Agent for Smart Finder. Feel free to drop your questions down below!",
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (message.trim() === "") return;

    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = "";
    const processText = async ({ done, value }) => {
      if (done) {
        return result;
      }
      const text = decoder.decode(value || new Int8Array(), { stream: true });
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text,
          },
        ];
      });
      return reader.read().then(processText);
    };
    return reader.read().then(processText);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <AppTheme>
      <Box
        id="contact-section"
        sx={(theme) => ({
          minHeight: { xs: "100vh", sm: "100vh" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "center" },
          width: "100%",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
          }),
          overflow: "auto",
          padding: {
            xs: "20px 10px 40px",
            sm: "60px 20px",
          },
          pt: { xs: "150px", sm: "100px" },
        })}
      >
        <AppAppBar />

        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#fff",
            padding: "20px",
            marginTop: "30px",
            borderRadius: "20px",
            fontFamily: "Kanit, sans-serif",
            fontWeight: "900",
            textTransform: "uppercase",
            textAlign: "center",
            maxWidth: "1200px",
            "@media (maxWidth: 600px)": {
              fontSize: "15px",
              padding: "20px",
              borderRadius: "20px",
            },
          }}
        >
          Smart Finder Support Chat
        </Typography>

        <Stack
          direction="column"
          width="100%"
          maxWidth="1200px"
          height="70vh"
          border="2px solid rgb(236, 236, 236)"
          borderRadius={4}
          p={2}
          spacing={3}
          sx={{
            backgroundColor: "#111",
            color: "white",
            overflow: "hidden",
            mt: 2,
            "@media (maxWidth: 600px)": {
              height: "60vh",
            },
            border: "2px solid rgb(18, 69, 121)",
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            sx={{
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "grey",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "darkgrey",
                borderRadius: "4px",
              },
              "@media (maxWidth: 600px)": {
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
              },
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={message.role === "assistant" ? "#0D1A26" : "#6266b3"}
                  color="white"
                  borderRadius={16}
                  padding={"24px"}
                  m={1}
                  boxShadow={3}
                  style={{
                    color: "#FFF",
                    border: "3px solid #111",
                    maxWidth: "80%",
                    "@media (maxWidth: 600px)": {
                      padding: "15px",
                    },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            color="white"
            sx={{
              "@media (maxWidth: 600px)": {
                flexDirection: "column",
                gap: "1rem",
              },
            }}
          >
            <TextField
              label="Enter message here:"
              fullWidth
              multiline
              maxRows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                style: {
                  color: "white",
                },
              }}
              InputLabelProps={{
                style: {
                  color: "#FFF",
                  transition: "all 0.2s ease",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                },
                "& .MuiInputBase-input": {
                  overflow: "auto",
                  "@media (maxWidth: 600px)": {
                    fontSize: "15px",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              sx={{
                height: "56px",
                bgcolor: "#660708",
                fontWeight: "bold",
                color: "#FFF",
                "@media (maxWidth: 600px)": {
                  width: "100%",
                  height: "48px",
                  fontSize: "0.875rem",
                },
                "&:hover": {
                  bgcolor: "#0D1A26",
                  fontWeight: "bold",
                  color: "#FFF",
                },
              }}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Footer />
    </AppTheme>
  );
}
