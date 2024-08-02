import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../Components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "../Components/ui/avatar"
import { Button } from "../Components/ui/button"
import { auth } from "../Context/Firebase.js"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Teamcard from '../Components/Teamcard'
import { teamdata } from "../Context/Team"

export default function Knowabus() {

    const [user, setUser] = useState(null);
    const [avat, setAvat] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const [team, setTeam] = useState([]);

    useEffect(() => {
      setTeam(teamdata);
      console.log(teamdata);
    }, [team]);

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

  return (
    <>
         <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4">
            <DropdownMenu>
        
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
        </div>
    <div className="container mx-auto p-4">
        <h1 className='text-center text-4xl font-extrabold my-10'>About Us</h1>
        <p className='text-center my-3'>"We empower the students to achieve their best"</p>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md sha">
            <h2 className="text-xl font-bold mb-4">Our Mission</h2>
            <p>Our mission is to revolutionize the way students prepare for exams by providing them with high-quality, easily accessible study materials. We are dedicated to:</p>
            <ul className="list-disc list-inside">
            <li>Helping students excel academically with detailed <span className="text-green-500 font-semibold">notes</span> and <span className="text-green-500 font-semibold">summaries</span>.</li>
            <li>Creating engaging <span className="text-green-500 font-semibold">quizzes</span> that reinforce learning and enhance understanding.</li>
            <li>Utilizing diverse content formats including PDFs, YouTube videos, and text uploads to cater to different learning preferences.</li>
            <li>Ensuring a seamless and interactive user experience to make studying more effective and enjoyable.</li>
            </ul>
            <p>Our team has worked tirelessly to curate and develop content that meets the highest standards of quality. We believe in the power of education and strive to make learning resources accessible to all students, regardless of their background or learning style. Through our platform, we aim to support students in achieving their academic goals and fostering a love for learning.</p>
        </div>
        <div className="bg-gray-200 sha p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Our Values</h2>
            <ul className="list-disc list-inside">
            <li>Providing detailed <span className="text-green-500 font-semibold">notes</span></li>
            <li>Creating comprehensive <span className="text-green-500 font-semibold">summaries</span></li>
            <li>Offering engaging <span className="text-green-500 font-semibold">quizzes</span></li>
            <li>Utilizing PDFs, YouTube videos, and text uploads</li>
            <li>Enhancing student learning experiences</li>
            </ul>
            <h2 className="text-xl font-bold mb-4 mt-4">Why You Should Use Our Website</h2>
            <ul className="list-disc list-inside">
            <li>Access a wide range of study materials tailored for last-minute preparation.</li>
            <li>Benefit from our <span className="text-green-500 font-semibold">AI</span>-powered platform that generates high-quality <span className="text-green-500 font-semibold">notes</span> and <span className="text-green-500 font-semibold">summaries</span>.</li>
            <li>Engage with interactive <span className="text-green-500 font-semibold">quizzes</span> that reinforce your learning.</li>
            <li>Upload your own PDFs, YouTube videos, and texts to get personalized study content.</li>
            <li>Enjoy a user-friendly interface designed to make studying efficient and enjoyable.</li>
            </ul>
        </div>
        </div>
        </div>
        <div className="container mx-auto p-4">
        <h1 className='text-center text-4xl font-extrabold my-10'>Our Team</h1>
        <p className='text-center my-3'>"This project wouldn't be possible without our team's hard work"</p>
        <div className='grid rounded-lg bg-green-300 lg:grid-cols-4 sm:grid-cols-2'>
            {team.map((te, index) => (
            <div key={index} className='p-2'>
            <Teamcard name={te.name} alt={te.name} li={te.li} pic={te.pic} role={te.role} />
            </div>
            ))}
        </div>
        </div>
    </>
  )
}
