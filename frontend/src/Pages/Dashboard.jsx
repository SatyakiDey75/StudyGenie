import { Button } from "../Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../Components/ui/dropdown-menu";
import Aichat from "../Components/Aichat";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Prevchats from "../Components/Prevchats";
import { Card, CardContent, CardFooter } from "../Components/ui/card";
import { Label } from "../Components/ui/label";
import { Input } from "../Components/ui/input";
import { auth, store } from "../Context/Firebase.js";
import axios from "axios";
import { Avatar, AvatarImage, AvatarFallback } from "../Components/ui/avatar";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [avat, setavat] = useState("");
  const [email, setEmail] = useState("");
  const [prev, setPrev] = useState([]);
  const [name, setName] = useState("");
  const [pdf, setpdf] = useState("");
  const [link, setlink] = useState("");
  const [cont, setcont] = useState("pdf");
  const [avattext, setavattext] = useState("Upload File");
  const [isdoc, setisdoc] = useState(false);
  const [isvdo, setisvdo] = useState(false);
  const [uid, setuid] = useState("");
  const [comp, setcomp] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      fetchchats();
      if (user) {
        setavat(currentUser.photoURL);
        setEmail(currentUser.email);
        setName(currentUser.displayName);
        setuid(currentUser.uid);
      } else {
        setavat("");
        setName("");
        setEmail("");
        setuid("");
      }
    });
    return () => unsubscribe();
  }, [user]);

  
  

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

const fetchchats = async (req, res) => {
  const response = await axios.get(`https://backend-codefusers.vercel.app/api/chats/fetchChats/${user.uid}`);
  console.log(response.data.chats);
  setPrev(response.data.chats);
}

  const goback = () => {
    navigate("/");
  };

  const hadnelnavvvv = async() => {
    const data = {
      title : "AI chat",
      uid: uid,
      isDoc: false,
      isVdo: false,
    };
    console.log("Data to be sent:", data);
    try {
      const res = await axios.post(
        "https://backend-codefusers.vercel.app/api/chats/createChat",
        data
      );
      navigate(`/aichat/${res.data.code}`);
    } catch (error) {
      console.error(
        "Error in POST request:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const mongouploadPDF = async ( pdfUrl) => {
    const data = {
      uid: uid,
      isDoc: true,
      isVdo: false,
      pdfUrl : pdfUrl
    };
    console.log("Data to be sent:", data);
    try {
      const res = await axios.post(
        "https://backend-codefusers.vercel.app/api/chats/createChat",
        data
      );
      navigate(`/chat/${res.data.code}`); 
    } catch (error) {
      console.error(
        "Error in POST request:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const mongouploadVDO = async ( vdoUrl) => {
    const data = {
      uid: uid,
      isDoc: false,
      isVdo: true,
      vdoUrl : vdoUrl
    };
    console.log("Data to be sent:", data);
    try {
      const res = await axios.post(
        "https://backend-codefusers.vercel.app/api/chats/createChat",
        data
      );
      navigate(`/chat/${res.data.code}`);
    } catch (error) {
      console.error(
        "Error in POST request:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      let pdfURL = "";
      if (pdf) {
        const storageRef = store.ref();
        const pdfRef = storageRef.child(`pdfs/${user.uid}/${pdf.name}`);
        await pdfRef.put(pdf);
        pdfURL = await pdfRef.getDownloadURL();
        console.log(pdfURL);
        try {
          setTimeout(() => {
            mongouploadPDF( pdfURL);
          }, 500);
        } catch (e) {
          console.log(e);
          return;
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handlesubmitVdo = async (e) => {
    e.preventDefault();
    try {
      if (link) {
        try {
          setTimeout(() => {
            mongouploadVDO(link);
          }, 500);
        } catch (e) {
          console.log(e);
          return;
        }
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };


  const handleClick = () => {
    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.click();
    }
  };


  const check = () => {
    setcont("yt");
    setisvdo(true);
    setisdoc(false);
  };

  const check2 = () => {
    setcont("pdf");
    setlink("");
    setisvdo(false);
    setisdoc(true);
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setpdf(file);
        console.log(file.name);
        setavattext(file.name);
        setisdoc(true);
      } else {
        setavattext("Please select a PDF file");
        setisdoc(false);
        return;
      }
    }
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-white to-[#ecf9f3] mb-10${
        sidebarOpen && "grid md:grid-cols-[260px_1fr] min-h-screen"
      }`}
    >
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-4 z-100 ml-7">
          <Link to="/">
            <Button
              variant="ghost"
              className="rounded-xl h-10 hover:bg-[#dff5ec] text-lg"
            >
              <img src="./favicon.ico" className="w-5 mr-1.5" alt="logo" />{" "}
              StudyGenie
            </Button>
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 rounded-xl px-3 h-10 data-[state=open]:bg-muted">
              <Avatar className="w-6 h-6 border">
                <AvatarImage src={avat} />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-w-[300px] mr-9">
            <DropdownMenuItem className="items-start gap-2">
              <div className="grid gap-1">
                <div className="font-medium">{name}</div>
                <div className="text-muted-foreground/80">{email}</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="items-start gap-2 cursor-pointer"
            >
              <LogOutIcon className="w-4 h-4 mr-2 translate-y-1 shrink-0" />
              <div>Logout</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {
        <button
          onClick={toggleSidebar}
          className="fixed top-2 left-4 z-50 p-2 text-gray-500 rounded-lg bg-white dow-md hover:bg-gray-100 focus:outline-none transition-all duration-200"
        >
          <span className="sr-only">Open sidebar</span>
          <MenuIcon />
        </button>
      }

      {sidebarOpen && (
        <aside
          id="default-sidebar"
          className={`fixed top-10 left-0 z-40 w-64 h-screen bg-gray-50 transition-transform 
        `}
          aria-label="Sidebar"
        >
          <div className="h-full px-4 py-8 overflow-y-auto">
            <ul className="space-y-4">

              <hr className="h-1 mx-auto my-4 bg-gray-500" />

              <h5 className="text-sm font-bold text-gray-500">
                Previous Chats
              </h5>

              {prev.map( (chat, index) => (<Prevchats title={chat.title} key={index} res={chat.chatId} />))}
            </ul>
          </div>
        </aside>
      )}

      <div className="flex flex-col">
        <div className="flex flex-col items-center max-w-2xl px-4 mx-auto justify-center h-screen  w-full overflow-hidden">
          {!comp ? (
            <>
              <form
                className="flex flex-col bg-[#c2f8e2] w-full h-3/4 items-center rounded-2xl px-2 py-4"
                onSubmit={handlesubmitVdo}
              >
                <div className="my-3 flex gap-4">
                  <button
                    onClick={check}
                    className={`rounded-lg flex px-3 p-1 ${
                      cont === "pdf"
                        ? "bg-[#eff5eef3] text-black "
                        : "bg-black text-white fill-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 mx-1 top-5"
                      viewBox="0 0 576 512"
                    >
                      <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
                    </svg>
                    YouTube Video
                  </button>
                  <button
                    onClick={check2}
                    className={`rounded-lg p-1 flex px-3 ${
                      cont === "yt"
                        ? "bg-[#eff5eef3] text-black "
                        : "bg-black text-white fill-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 mx-1 top-5"
                      viewBox="0 0 640 512"
                    >
                      <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
                    </svg>
                    Pdf upload
                  </button>
                </div>
                <h1 className="text-3xl font-bold pt-10 text-center my-4">
                  {cont === "pdf" ? "Upload Pdf File" : "Upload YouTube Link"}
                </h1>
                {cont === "pdf" && (
                  <>
                  
                    <div className="h-full flex flex-col justify-end py-6">
                      <div className="w-96 flex flex-col items-center justify-center gap-y-10">
                        <input
                          type="file"
                          id="file-input"
                          className="absolute inset-0 hidden w-96 h-full opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                          required
                        />
                        <button
                          type="button"
                          className=" placeholder:text-gray-500 my-3 sha text-gray-500 w-96 border-2 border-solid border-slate-400 focus:border-slate-400 focus:ring-0 focus:outline-none h-10 text-center rounded-md bg-white"
                          onClick={handleClick}
                        >
                          {avattext}
                        </button>
                        <button
                          onClick={handlesubmit}
                          className="bg-gradient-to-b from-gray-600 to-black w-96 p-3 rounded-lg text-white font-semibold"
                          type="submit"
                        >
                          Submit Pdf
                        </button>
                      </div>
                    </div> 
                  </>
                )}
                {cont === "yt" && (
                  <>
                    <div className="h-full flex flex-col justify-end py-6">
                      <div className="w-96 flex flex-col items-center justify-center gap-y-10">
                        <input
                          value={link}
                          placeholder="Enter Youtube link here ..."
                          type="text"
                          className="mt[-20px] outline-none text-center cursor-text focus:outline-none rounded-md w-5/6 h-10"
                          onChange={(e) => setlink(e.target.value)}
                          required
                        />
                        <button
                          className="bg-gradient-to-b from-gray-600 to-black w-80 p-3 rounded-lg text-white font-semibold"
                          type="submit" onClick={handlesubmitVdo}
                        >
                          Submit Link
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <button
                onClick={hadnelnavvvv}
                className="bg-gradient-to-b from-gray-600 transition-all my-5 duration-300 hover:scale-95 to-black w-96 p-3 rounded-lg text-white font-semibold"
              >
                Chat With AI Instead
              </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex mb-12">
                <h1 className="my-2 text-3xl font-bold mt-5">Chat With AI</h1>
              </div>
              <Aichat />

              <div className=""></div>

              <button
                onClick={() => setcomp(!comp)}
                className="bg-gradient-to-b from-gray-600 transition-all my-5 duration-300 hover:scale-95 to-black w-96 p-3 mt-20 rounded-lg text-white font-semibold"
              >
                Upload Docs Instead
              </button>
            </>
          )}
        </div>
      </div>
    </div>
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
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
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
function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
