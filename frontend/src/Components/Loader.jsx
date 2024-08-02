import React from 'react'
import { motion } from 'framer-motion'

export default function Loader({ isExiting }) {

    const exitVariants = {
      exit: {
        opacity: 0,
        y: 100,
        transition: {
          duration: 0.5,
          ease: 'easeInOut'
        },
      },
    }
  
  return (
    <motion.div 
      className="flex h-screen items-center justify-center"
      variants={exitVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={isExiting}
    >
      <h1 className='text-[#1E2B3A] text-2xl font-bold mx-5'><span className='anim'>S</span>tudy<span className='anim'>Gennie</span></h1>
      <div className="loader"></div>
    </motion.div>
  )
}