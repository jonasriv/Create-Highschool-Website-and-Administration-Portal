'use client'

import Image from 'next/image';
import { useState, useEffect } from "react";
import logo from '../../../public/images/logo-header.svg';
import HamburgerMenu from "@/components/ui/hamburgermenu";
import Navbar from './ui/Navbar';
import { User, LogOutIcon, LogInIcon } from 'lucide-react';
// import { Calendar } from 'lucide-react';
import { signOut, signIn } from "next-auth/react";

type HeaderProps = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  msConnected?: boolean;
};

const ElevHeader = ({ user }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [msConnected, setMsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await fetch("/api/ms/status");
      const data = await res.json();
      setMsConnected(Boolean(data.connected));
    })();
  }, [user]);
  const toggleMenu = () => setIsOpen(!isOpen);

  const scrollToFront = () => {
    const frontSection = document.getElementById("front");
    frontSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // const scrollToCalendar = () => {
  //   const cal = document.getElementById("calendar");
  //   cal?.scrollIntoView({ behavior: "smooth", block: "start" });
  // };

  return (
    <header>
      <div
        className='flex flex-row gap-1 justify-center items-center w-screen max-w-screen bg-black/60 h-24 lg:h-24 p-4 z-50 backdrop-blur-2xl border-white border-b'
      >
        <div className="flex justify-between items-center w-screen h-full">
          <div className="cursor-pointer flex flex-col gap-2 w-20 justify-center items-center">
            <Image
              src={logo}
              alt="Create logo..."
              id="logo"
              onClick={scrollToFront}
            />
            <h3 className="text-moreredish font-semibold tracking-tighter">ELEVSIDER</h3>
          </div>

          <div className="flex flex-row gap-4 lg:gap-12 m-4 justify-between items-center">
            {/* user box */}
            <div className='flex flex-row justify-start items-center gap-2 p-2 bg-white/40 rounded-md'>
              <User size={14} />
              <div className='w-auto flex flex-row justify-center items-center gap-2'>
                {user ? (
                  <>
                    <span className="text-sm">{user?.name ?? user?.email ?? ""}</span>

                    {/* Microsoft connect / status */}
                    {/* {!msConnected ? (
                      <button
                         onClick={() =>
                            signIn("azure-ad", {
                            callbackUrl: "/elev",
                            redirect: true,
                            })
                        }
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md"
                        title="Koble Microsoft-konto for kalender"
                      >
                        Koble Microsoft
                      </button>
                    ) : (
                      <button
                        onClick={scrollToCalendar}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md flex flex-row gap-1 items-center"
                        title="Gå til kalender"
                      >
                        <Calendar size={14} />
                        Kalender
                      </button>
                    )} */}

                    {/* logout */}
                    <button
                      onClick={() => signOut({ callbackUrl: "/elev" })}
                      className='bg-evenmoreredish p-1 rounded-full'
                      title="Logg ut"
                    >
                      <LogOutIcon size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    {/* LOGIN med Feide */}
                    <button
                      onClick={() => signIn("feide", { callbackUrl: "/elev" })}
                      className="flex flex-row justify-center items-center text-sm bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md"
                    >
                      Logg inn med Feide
                      <span className='bg-green-600 p-1 rounded-full ml-2'>
                        <LogInIcon size={14} />
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {user && <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />}
          </div>
        </div>
      </div>

      <div className="absolute top-20 lg:top-24 z-50">
        {user && <Navbar isOpen={isOpen} onClose={toggleMenu} />}
      </div>
    </header>
  );
};

export default ElevHeader;
