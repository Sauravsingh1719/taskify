'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { User } from 'next-auth';
import { useRouter, usePathname } from 'next/navigation';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

  const isOnDiaryPage = pathname === '/diary';

  return (
    <div>
      <nav className="p-4 md:p-6 shadow-md bg-black text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="/" className="text-xl font-bold mb-4 md:mb-0">
            Taskify
          </a>
          {session ? (
            <div className="flex flex-row gap-5">
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
              <Button
                onClick={() => router.push(isOnDiaryPage ? '/dashboard' : '/diary')}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                {isOnDiaryPage ? 'Home' : 'Diary'}
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;