import React from 'react'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { motion } from "motion/react"
import { Button } from '@/components/ui/button'


const page = () => {

  const taskanimate = {
    hidden: {
      scale: 0.1,
      opacity: 0
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.8
      }
    }
  }

  const words = `Organize your life with Taskify. Effortlessly manage your to-dos, track progress, and boost your productivity.`;
  return (
    <div className='h-dvh w-dvw flex gap-5 flex-col text-center items-center justify-center' style={{
      background :'radial-gradient(circle, #000000, #050505, #090909, #0d0d0d, #111111)'
    }}>
      <div>
        <div>
          <h1 className='font-extrabold text-8xl' style={{ 
            WebkitTextFillColor: 'transparent', 
            WebkitBackgroundClip: 'text', 
            backgroundImage: 'linear-gradient(to bottom, #000000, #3b3b3b, #777676, #b9b7b7, #fffdfd);' 
          }}>
            Taskify
          </h1>
        </div>
      </div>
      <div >
        <TextGenerateEffect words={words} />
      </div>
      <div className='flex flex-row gap-4'>
        <div>
          <a href='/sign-in'>
        <Button>
          Login
        </Button>
        </a>
        </div>
        <div>
          <a href='/sign-up'>
          <Button>
            Signup
          </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default page;