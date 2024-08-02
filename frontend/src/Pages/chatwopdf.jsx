import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../Components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "../Components/ui/avatar"
import { Button } from "../Components/ui/button"
import { Textarea } from "../Components/ui/textarea"
import { auth, store } from "../Context/Firebase.js"
import axios from "axios"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import Groq from "groq-sdk";
import ReactMarkdown from "react-markdown"
import { Input } from "../Components/ui/input";

export default function Component() {

  const [user, setUser] = useState(null);
  const [avat, setAvat] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello, I am StudyGenie ... I am here to help you today with your queries 👋" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatContainerRef = useRef(null);
  const [ai, setAi] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const par = useParams();
  const parm = par.id;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAvat(currentUser.photoURL);
        setEmail(currentUser.email);
        setName(currentUser.displayName);
      } else {
        setAvat("");
        setName("");
        setEmail("");
      }
    });
    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const groq = new Groq({
    apiKey: import.meta.env.VITE_AP_GRO,
    dangerouslyAllowBrowser: true,
  });

  async function getGroqChatStream(input, msgHistory) {
    let msg = "";
    let user_last = "";
    let ai_last = "";
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
      model: "llama3-70b-8192",
      stream: true,
    });
  }

  const mongoai = async (userMessage, aiMessage) => {
    const data = {
      user: aiMessage,
      ai: userMessage,
    };
    try {
      const res = await axios.put(`https://backend-codefusers.vercel.app/api/chats/addPrompt/${parm}`, data);
      console.log(res.data);
    } catch (error) {
      console.error('Error in PUT request:', error.message);
    }
  };


  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "" && !isStreaming) { 
      const newMessage = { text: inputValue.trim(), sender: "user" };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInputValue("");
  
      const stream = await getGroqChatStream(inputValue.trim(), messages);
      setIsStreaming(true); 
      let rmessage = "";
      for await (const chunk of stream) {
        rmessage += chunk.choices[0]?.delta?.content || "";
        const responseMessage = { text: rmessage, sender: "bot" };
        setAi(responseMessage.text);
        setMessages((prevMessages) => [...updatedMessages, responseMessage]);
      }
      setIsStreaming(false); 
      if (updatedMessages.length > 0) {
        const userMessage = updatedMessages[updatedMessages.length - 1];
        const aiMessage = { text: rmessage, sender: "bot" };
        mongoai(userMessage.text, aiMessage.text);
      }
  
      const latestUserMessage = updatedMessages[updatedMessages.length - 1];
      const text = latestUserMessage.text;
      console.log(latestUserMessage);
      const words = text.split(" ");
      const result = words.length < 3 ? words.slice(0, 1).join(" ") : words.slice(0, 3).join(" ");
      console.log(result);
  
      try {
        const data = {
          title: `${result} ...`,
          uid: user.uid
        };
        const res = await axios.put(`https://backend-codefusers.vercel.app/api/chats/chattitlechange/${parm}`, data);
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    }
  };
  

  const copyToClipboard = async (msgText) => {
    try {
      await navigator.clipboard.writeText(msgText);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 rounded-xl px-3 h-10 data-[state=open]:bg-muted">
                  <Avatar className="w-6 h-6 border">
                    <AvatarImage src={avat} />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-w-[300px]">
                <DropdownMenuItem className="items-start gap-2">
                  <div className="grid gap-1">
                    <div className="font-medium">{name}</div>
                    <div className="text-muted-foreground/80">{email}</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 translate-y-1 shrink-0" viewBox="0 0 512 512"><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
                  <div>Logout</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/"><Button variant="ghost" className="gap-1 rounded-xl px-3 h-10 hover:bg-[#dff5ec] text-lg">
              <img src="/favicon.ico" className="w-5" alt="logo" />&nbsp; StudyGenie
            </Button></Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 rounded-xl px-3 h-10 data-[state=open]:bg-muted text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-[300px]">
              <DropdownMenuItem className="items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2 translate-y-1 shrink-0" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm64 64V416H224V160H64zm384 0H288V416H448V160z"/></svg>
                <Link to="/dashboard">
                  <div className="font-medium">Dashboard</div>
                  <div className="text-muted-foreground/80">
                    Go back to dashboard to view chat history
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-7rem)] flex flex-col items-center justify-center overflow-hidden">
          <div ref={chatContainerRef} className="flex-1 w-full p-4 mt-10 overflow-y-auto bg-[#F8FAFC] rounded-lg max-w-2xl border">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded-lg ${
                  message.sender === "user" ? "bg-blue-200 self-end" : "bg-gray-200 self-start"
                }`}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
                {message.sender !== "user" && (
                  <Button
                    variant="ghost"
                    className="text-xs"
                    onClick={() => copyToClipboard(message.text)}
                  >
                    Copy
                  </Button>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleMessageSubmit} className="w-full max-w-2xl p-4 flex flex-col sm:flex-row gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
              disabled={isStreaming} 
            />
            <Button type="submit" disabled={isStreaming}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
