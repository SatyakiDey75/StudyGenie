import React, { useState, useRef, useEffect } from "react";
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown";
import { Button } from "../Components/ui/button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { auth } from "../Context/Firebase.js";

const Chat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);
  const params = useParams();
  const chatId = params.id;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchMessages(currentUser.uid, chatId);
      }
    });
    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async (uid, chatId) => {
    try {
      const response = await axios.get(`https://backend-codefusers.vercel.app/api/chats/fetchMessages/${uid}/${chatId}`);
      console.log(response); 
      setMessages(response.data) 

      if (Array.isArray(response.data.aiPrompts)) {
        setMessages(response.data.aiPrompts.map(msg => ({
          user: msg.user,
          ai: msg.ai
        })));
      } else {
        console.error("Unexpected response data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error.message);
    }
  };

  const addPrompt = async (data) => {
    try {
      const response = await axios.put(
        `https://backend-codefusers.vercel.app/api/chats/addPrompt/${chatId}`, data
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const groq = new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });

  async function getGroqChatStream(input, msgHistory) {
    var msg = "";
    var user_last = "";
    var ai_last = "";
    if (msgHistory.length > 1) {
      for (const i of msgHistory) {
        msg += i.sender + ": " + i.text + "\n";
      }
      user_last = msgHistory[msgHistory.length - 2].text;
      ai_last = msgHistory[msgHistory.length - 1].text;
    }
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You only answer education related prompts.\n 
                    The entire conversation with you till now:\n ${
                      msg ? msg : ""
                    }.
                    User's last message: ${user_last ? user_last : ""}
                    Your last response to user: ${ai_last ? ai_last : ""}`
        },
        {
          role: "user",
          content: input,
        },
      ],
      model: "llama3-8b-8192",
      stream: true,
    });
  }

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      const newMessage = { user: inputValue.trim() };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputValue("");
  
      try {
        const stream = await getGroqChatStream(inputValue.trim(), messages);
        let rmessage = "";
  
        for await (const chunk of stream) {
          rmessage += chunk.choices[0]?.delta?.content || "";
        }
        const responsem = { ai: rmessage };
        setMessages([...updatedMessages, responsem]);
        await addPrompt({ ai: inputValue.trim(), user: rmessage });
  
      } catch (error) {
        console.error("Error processing chat stream:", error.message);
      }
    }
  };
  

  return (
    <div>
      <form
        className="flex items-center px-4 py-2 md:px-6 md:py-4 bg-white"
        onSubmit={handleMessageSubmit}
      >
        <input
          type="text"
          className="flex-1 focus:outline-none bg-white text-black px-2 py-2 rounded-lg border-2 border-[#a7a6a6]"
          placeholder="Ask your questions to StudyGenie..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute w-8 h-8 top-1.5 right-3 bg-[#c2f8e2] hover:bg-[#c2f8e2]"
        >
          <ArrowUpIcon className="w-4 h-4 text-black" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
      <div className="bg-[#f7f4f4] h-96 w-full rounded-2xl">
        <div
          ref={chatContainerRef}
          className="flex flex-col h-full overflow-y-auto px-4 py-2 md:px-6 md:py-4"
        >
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className={`flex flex-col mb-4`}>
               { msg.user && <div className={"p-[1em] rounded-xl bg-[#e9eae9] border-[#bababa] border-2 ml-4 mb-3 mx-auto"}>
                  <div className="font-bold">
                    {msg.user && "You"}
                  </div>
                  <div className="prose text-muted-foreground">
                    <ReactMarkdown>{msg.user}</ReactMarkdown>
                  </div>
                </div>}

                {msg.ai && (
                  <div className={"p-[1em] rounded-xl bg-[#c2f8e2] border-[#7cf7c6] border-2 ml-4 mb-3 mx-auto"}>
                    <div className="font-bold">
                      StudyGenie
                    </div>
                    <div className="prose text-muted-foreground">
                      <ReactMarkdown>{msg.ai}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500">
              No messages yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
