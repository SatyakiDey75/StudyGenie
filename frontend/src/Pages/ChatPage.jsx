import React, { useState, useEffect } from "react";
import { auth } from "../Context/Firebase.js";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../Components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../Components/ui/avatar";
import { Button } from "../Components/ui/button";
import Chatwaicomp from "../Components/Aichat";
import TextQuestions from "../Components/TextQuestions";
import TextNotes from "../Components/TextNotes";
import TextSummary from "../Components/TextSummary";
import Prevchats from "../Components/Prevchats";
import AIChat from "./chatwopdf";
import axios from "axios";



export default function Chat() {
  const params = useParams();
  const chatId=params.id

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [msg, setmsgs] = useState([]);
  const [notes, setNotes] = useState("");
  const [summ, setSumm] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [avat, setAvat] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [tog, settog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prev, setPrev] = useState([]);
  const [comp, setcomp] = useState("notes");
  const [isVdo, setisVdo] = useState(false);
  const [isDoc, setisDoc] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      fetchchats();
      if (user) {
        setAvat(currentUser.photoURL);
        setName(currentUser.displayName);
      } else {
        setAvat("");
        setName("");
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setisVdo(false);
        setisDoc(false);
        const response = await axios.get(`https://backend-codefusers.vercel.app/api/chats/fetchChat/${user.uid}/${chatId}` ); 
        setSumm(response.data.summary);
        setNotes(response.data.notes[0].note);
        setQuiz(response.data.quiz);
        setisVdo(response.data.isVdo)
        setisDoc(response.data.isDoc)
      } catch (error) {
        console.error("Error fetching chats:", error.message);
      }
    };
    fetchChat();
  }, [user,chatId]);

  const fetchchats = async (req, res) => {
    const response = await axios.get(`https://backend-codefusers.vercel.app/api/chats/fetchChats/${user.uid}`);
    console.log(response.data.chats);
    setPrev(response.data.chats);
  }

  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const goback = () => {
    navigate("/");
  };


  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <DropdownMenu>
                {!sidebarOpen && (
                  <button
                    onClick={toggleSidebar}
                    className="top-4 sha left-4 z-50 p-2 text-gray-500 rounded-lg bg-white hover:bg-gray-200 focus:outline-none transition-all duration-200"
                  >
                    <span className="sr-only">Open sidebar</span>
                    <svg
                      className="w-4 h-4"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 rounded-xl px-3 h-10 data-[state=open]:bg-muted">
                  <Avatar className="w-6 h-6 border">
                    <AvatarImage src={avat} />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  
                  <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
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
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="items-start gap-2"
                >
                  <LogOutIcon className="w-4 h-4 mr-2 translate-y-1 shrink-0" />
                  <div>Logout</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/">
              <Button
                variant="ghost"
                className="gap-1 rounded-xl px-3 h-10 hover:bg-[#dff5ec] text-lg"
              >
                <img src="/favicon.ico" className="w-5" alt="logo" />
                &nbsp; StudyGenie
              </Button>
            </Link>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="gap-1 rounded-xl px-3 h-10 data-[state=open]:bg-muted text-lg"
              >
                <MenuIcon className="w-6 h-6" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-w-[300px]">
              <DropdownMenuItem className="items-start gap-2">
                <SparkleIcon className="w-4 h-4 mr-2 translate-y-1 shrink-0" />
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
      </div>

      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-300 sha transition-transform ${
          sidebarOpen ? "" : "hidden sm:hidden"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex justify-end p-4">
          {sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="text-white bg-gray-500 rounded-full p-1 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="h-full px-4 py-8 overflow-y-auto">
              <Button onClick={goback}
                variant="ghost"
                className="gap-1 rounded-xl px-3 h-10 hover:bg-[#dff5ec] text-lg"
              >
                <img src="/favicon.ico" className="w-5" alt="logo" />
                &nbsp; StudyGenie
              </Button>
          <div className="mt-5">
            <hr className="h-1 mx-auto my-4 bg-gray-500" />
          </div>
          <h5 className="text-sm font-bold text-gray-500">Previous Chats</h5>
          {prev.map( (chat, index) => (<Prevchats title={chat.title} key={index} res={chat.chatId} />))}
        </div>
      </aside>

      <div className={`grid h-screen w-full p-3 ${(isVdo || isDoc) ? "lg:grid-cols-2 sm:grid-cols-1" : "grid-cols-1"} gap-y-16`}>
        <div className="flex flex-col w-full lg:border-right">
          <h1 className="text-xl mt-8 mb-5 ml-7 font-extrabold text-left">
            AI Chat 
          </h1>
          <div className="w-full px-3">
            <Chatwaicomp msgs={msg} />
          </div>
        </div>
        <div className="flex flex-column lg:mt-8 sm:mt-[-30px] relative">
        {(isVdo || isDoc) &&
          <>
          <div className="flex w-full">
            <Button
              onClick={() => setcomp("notes")}
              className={`rounded-3xl ml-4 ${
                comp === "notes" ? "bg-[#4cd8a0]" : "bg-[#d8d7d7]"
              } text-black hover:bg-[#4cd8a0]`}
            >
              Notes
            </Button>
            <Button
              onClick={() => setcomp("summarize")}
              className={`rounded-3xl ml-4 ${
                comp === "summarize" ? "bg-[#4cd8a0]" : "bg-[#d8d7d7]"
              } text-black hover:bg-[#4cd8a0]`}
            >
              Summary
            </Button>
            <Button
              onClick={() => setcomp("questions")}
              className={`rounded-3xl ml-4 ${
                comp === "questions" ? "bg-[#4cd8a0]" : "bg-[#d8d7d7]"
              } text-black hover:bg-[#4cd8a0]`}
            >
              Questions
            </Button>
          </div>
          

            <div className="h-[27.5rem] absolute mt-16 flex-column w-full rounded-2xl bg-[#f7f4f4]">
            {comp === "questions" && <TextQuestions quiz={quiz}/>}
            {comp === "notes" && <TextNotes notes={notes} isVdo={isVdo} />}
            {comp === "summarize" && <TextSummary summa={summ} isVdo={isVdo} />}
          </div>
          </>
          }
        </div>
        
      </div>
    </div>
  );
}

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

function ChevronDownIcon(props) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ClipboardIcon(props) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function SparkleIcon(props) {
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
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

function ZapIcon(props) {
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
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function LogOutIcon(props) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
