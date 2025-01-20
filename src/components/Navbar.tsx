'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User } from 'next-auth';
import Dashboard from '@/components/dash';
import { useRouter } from 'next/navigation';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;
  const router = useRouter();


  return (
    <div >
    <nav className="p-4 md:p-6 shadow-md bg-black text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="text-xl font-bold mb-4 md:mb-0">
          Taskify
        </a>
        {session ? (
          <>
          <div className='flex flex-row gap-5'>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
              <a
                href="/diary"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/diary'); 
                }}
              >
                <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                Diary
                </Button>
              </a>

            </div>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
    </div>
   
  );
}

export default Navbar;