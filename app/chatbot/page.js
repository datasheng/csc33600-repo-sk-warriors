// app/chat/page.js
"use client";
import { Box, Stack, TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import SendIcon from '@mui/icons-material/Send';
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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const textFieldRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim() === "" || isSending) return;

    setIsSending(true);
    const userMessage = message.trim();
    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: userMessage }]),
      });
      
      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      const processText = async ({ done, value }) => {
        if (done) {
          setIsSending(false);
          return result;
        }
        
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        result += text;
        
        setMessages((prevMessages) => {
          const lastMessageIndex = prevMessages.length - 1;
          return [
            ...prevMessages.slice(0, lastMessageIndex),
            {
              ...prevMessages[lastMessageIndex],
              content: prevMessages[lastMessageIndex].content + text,
            },
          ];
        });
        
        return reader.read().then(processText);
      };
      
      return reader.read().then(processText);
    } catch (error) {
      console.error("Error sending message:", error);
      
      setMessages((prevMessages) => {
        const lastMessageIndex = prevMessages.length - 1;
        return [
          ...prevMessages.slice(0, lastMessageIndex),
          {
            ...prevMessages[lastMessageIndex],
            content: "Sorry, there was an error processing your request. Please try again.",
          },
        ];
      });
      
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    // Allow new line with Shift+Enter
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
      // Force textarea to grow when Shift+Enter is pressed
      const textarea = textFieldRef.current?.querySelector('textarea');
      if (textarea) {
        // Manually adjust height after next render cycle
        setTimeout(() => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }, 0);
      }
    }
  };

  // Handle text field auto-resizing and focus
  useEffect(() => {
    if (textFieldRef.current) {
      const textarea = textFieldRef.current.querySelector('textarea');
      if (textarea) {
        // Set initial focus
        textarea.focus();
        
        // Handle auto-resize
        const handleInput = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        };
        
        textarea.addEventListener('input', handleInput);
        
        // Initial sizing
        handleInput();
        
        return () => {
          textarea.removeEventListener('input', handleInput);
        };
      }
    }
  }, []);

  return (
    <AppTheme>
      <Box
        id="contact-section"
        component="main"
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
          component="h1"
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
            "@media (max-width: 600px)": {
              fontSize: "1.5rem",
              padding: "15px",
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
          border="2px solid rgb(18, 69, 121)"
          borderRadius={4}
          p={2}
          spacing={3}
          sx={{
            backgroundColor: "#111",
            color: "white",
            overflow: "hidden",
            mt: 2,
            "@media (max-width: 600px)": {
              height: "60vh",
            },
          }}
          component="section"
          aria-label="Chat conversation"
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            sx={{
              scrollBehavior: "smooth",
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
              "@media (max-width: 600px)": {
                "&::-webkit-scrollbar": {
                  width: "4px",
                },
              },
              p: 1,
            }}
            role="log"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
                aria-label={`${message.role} message`}
              >
                <Box
                  bgcolor={message.role === "assistant" ? "#0D1A26" : "#6266b3"}
                  color="white"
                  borderRadius={3}
                  padding={"18px"}
                  m={1}
                  boxShadow={3}
                  sx={{
                    color: "#FFF",
                    border: "2px solid #111",
                    maxWidth: "80%",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    "@media (max-width: 600px)": {
                      padding: "15px",
                      maxWidth: "85%",
                    },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-end" // Align items to bottom for expanding textarea
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            sx={{
              "@media (max-width: 600px)": {
                flexDirection: "column",
                gap: "1rem",
              },
            }}
            aria-label="Message input area"
          >
            <TextField
              inputRef={textFieldRef}
              label="Enter message here:"
              fullWidth
              multiline
              minRows={1}
              maxRows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              placeholder="Type your message (Shift+Enter for new line)"
              InputProps={{
                style: {
                  color: "white",
                },
                sx: {
                  alignItems: "flex-start", // Fixes textarea alignment
                },
              }}
              InputLabelProps={{
                style: {
                  color: "#FFF",
                  transition: "all 0.2s ease",
                },
                shrink: true,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.7)",
                  },
                  "&:hover fieldset": {
                    borderColor: "white",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white",
                  },
                  height: "auto", // Important for proper text field growing
                },
                "& .MuiInputBase-input": {
                  overflow: "auto",
                  "@media (max-width: 600px)": {
                    fontSize: "15px",
                  },
                  overflowY: "auto", // Allow scrolling within the text field
                  lineHeight: "1.5", // Better line height for readability
                  padding: "12px 14px", // Consistent padding
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white",
                },
                "& textarea": {
                  resize: "none", // Prevent manual resizing
                  transition: "height 0.2s ease",
                },
                flexGrow: 1,
              }}
              aria-label="Message input"
            />
            <Button
              variant="contained"
              type="submit"
              disabled={isSending || !message.trim()}
              endIcon={isSending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              sx={{
                height: "56px",
                minWidth: "100px",
                bgcolor: "#0D1A26",
                fontWeight: "bold",
                color: "#FFFFFF",
                textShadow: "0px 1px 2px rgba(0,0,0,0.5)", // Add text shadow for better visibility
                fontSize: "1rem",
                letterSpacing: "0.5px", // Improved text spacing
                transition: "all 0.2s ease",
                "@media (max-width: 600px)": {
                  width: "100%",
                  height: "48px",
                  fontSize: "0.875rem",
                },
                "&:hover": {
                  bgcolor: "#0D1A26",
                  transform: "translateY(-2px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(102, 7, 8, 0.7)", 
                  color: "#FFFFFF", 
                },
              }}
              aria-label={isSending ? "Sending message..." : "Send message"}
            >
              {isSending ? "Sending" : "Send"}
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Footer />
    </AppTheme>
  );
}
