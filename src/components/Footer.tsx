import React from 'react'
import Link from 'next/link';

const Footer = () => {
    const getCurrentYear = () => new Date().getFullYear();
  return (
    <div className="bg-black text-white px-4 sm:px-10 md:px-20 lg:px-52 py-5">
        <div className='flex flex-row justify-between'>
        <div>
            <ul className='flex flex-col gap-2'>
                <li>
                <Link href='/'>
                    Home
                </Link>
                </li>
                <li>
                <Link href='/sign-in'>
                    Login
                </Link>
                </li>
                <li>
                <Link href='/sign-up'>
                    Signup
                </Link>
                </li>
            </ul>
        </div>
        <div>
            <a href='https://portfolio160.vercel.app/'>
                Contact me
            </a>
        </div>
        </div>
        <div className='flex flex-col gap-2 text-center justify-center items-center'>
            <h1>Made with ❤️ in 🇮🇳 </h1>
            <h1> © {getCurrentYear()} All rights reserved. </h1>
        </div>
        
            
    </div>
  )
}

export default Footer