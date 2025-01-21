import React from 'react'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { Button } from '@/components/ui/button'
import Image from 'next/image'



const page = () => {
  const words = `Organize your life with Taskify. Effortlessly manage your to-dos, track progress, and boost your productivity.`;
  return (
  
    <div className='h-dvh grid grid-cols-1 md:grid-cols-2 gap-4 lg:px-48 sm:px-10 py-5' style={{
      background :'radial-gradient(circle, #000000, #050505, #090909, #0d0d0d, #111111)'
    }}>
      <div className='order-2 md:order-1 flex gap-5 flex-col text-center items-center justify-center'>
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
          Getting Started
        </Button>
        </a>
        </div>
      </div>
      </div>
      <div className='flex items-center justify-center lg:p-40 order-1 md:order-2'>
      <Image
          src='/task.png'
          alt='taskifyavtar'
          layout='responsive'
          width={400}
          height={400}
        />

      </div>
  
    </div>
   
  )
}

export default page;