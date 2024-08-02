import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Chat from './Pages/ChatPage'
import Dashboard from './Pages/Dashboard'
import Chat2 from './Pages/chatwopdf'
import FlashCard from './Components/TextQuestions'
import Knowabus from './Pages/Knowabus'


export default function Page() {
  return (
    <>
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/chat/:id' element={<Chat />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/aichat/:id' element={<Chat2 />} />
            <Route path='/questions' element={<FlashCard />} />
            <Route path='/knowabus' element={<Knowabus />} />
        </Routes>
    </>
  )
}
