'use client'

import Image from 'next/image';
import { useState, useEffect } from "react";
import OrangeLogo from "../../../public/images/FetBakgrunnMoreRedish.png"
import HamburgerMenu from "@/components/ui/ElevHamburger";
import { User, LogOutIcon, LogInIcon } from 'lucide-react';
// import { Calendar } from 'lucide-react';
import { signOut, signIn } from "next-auth/react";
import { useElevStore } from './store';
import DarkSlider from '@/components/ui/DarkSlider';

type HeaderProps = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  msConnected?: boolean;
  toggleRef?: React.RefObject<HTMLDivElement | null>;

};

const ElevHeader = ({ user, toggleRef }: HeaderProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [msConnected, setMsConnected] = useState(false);
  const showingNavbar = useElevStore((s) => s.showingNavbar);
  const toggleNavbar = useElevStore((s)=> s.actions.toggleNavbar);
  const dark = useElevStore((s) => s.dark);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await fetch("/api/ms/status");
      const data = await res.json();
      setMsConnected(Boolean(data.connected));
    })();
  }, [user]);

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
        className={`flex flex-row gap-1 justify-between items-center w-screen max-w-screen h-22 lg:h-22 px-2 z-50 backdrop-blur-2xl ${dark ? "bg-black/60 text-white" : "bg-transparent text-black" }`}
      >
        <div className="flex justify-between items-center w-screen h-full">
          <div className="cursor-pointer flex flex-col gap-1 w-16 md:w-20 justify-center items-center">
            <Image
              src={OrangeLogo}
              alt="Create logo..."
              id="logo"
              onClick={scrollToFront}
            />
            <h3 className="text-white pl-1 font-semibold tracking-wider text-xs">ELEVHUB</h3>
          </div>             
          <div className="flex flex-row gap-4 lg:gap-12 m-4 justify-between items-center">
            <DarkSlider />
            {/* user box */}
            
            <div className='flex flex-row justify-start items-end gap-2 p-2 rounded-md'>
            <div className={`p-2 rounded-full `}>  
              <User color="white" size={16} />
            </div>
              <div className='w-auto flex flex-row justify-center items-center gap-2'>
                {user ? (
                  <>
                    <span className="text-sm text-white">{user?.name ?? user?.email ?? ""}</span>

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
                      className='bg-redish p-2 rounded-full'
                      title="Logg ut"
                    >
                      <LogOutIcon color="white" size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    {/* LOGIN med Feide */}
                    <button
                      onClick={() => signIn("feide", { callbackUrl: "/elev" })}
                      className={`flex flex-row justify-center items-center text-sm px-2 py-1 rounded-md ${dark ? "bg-white/20 hover:bg-white/30 " : "bg-black/20 hover:bg-black/30"}`}
                    >
                      Logg inn med Feide
                      <span className='bg-green-600 p-2 rounded-full ml-2'>
                        <LogInIcon size={14} />
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div ref={toggleRef} className='hidden md:block'>
              {user && <HamburgerMenu isOpen={showingNavbar} toggleMenu={toggleNavbar} />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ElevHeader;
