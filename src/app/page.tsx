import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
  return (
    <div className='h-dvh w-dvw flex gap-5 flex-row items-center justify-center'>
      <div>
        <Button>
          <a href='/sign-in'>Sign-in</a>
        </Button>
      </div>
      <div>
        <Button>
          <a href='/sign-up'>Signup</a>
        </Button>
      </div>
    </div>
  )
}

export default page