'use client'
import Image from 'next/image';
import { useState } from "react";
import logo from '../../../public/images/logo-header.svg';
import HamburgerMenu from "@/components/ui/hamburgermenu";
import Navbar from './ui/Navbar';
import { User, LogOutIcon, LogInIcon } from 'lucide-react';
import { signOut, signIn } from "next-auth/react";

type HeaderProps = {
    user?: {
        name?: string | null;
        email?: string | null;
    };
};

const ElevHeader = ({ user }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const scrollToFront = () => {
        const frontSection = document.getElementById("front");
        if (frontSection) {
            frontSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    
    return (
        <header>
            <div 
                className='flex fixed flex-row gap-1 justify-center items-center w-screen max-w-screen bg-black/60 h-20 lg:h-24 p-4 z-50 backdrop-blur-lg'
            >
                <div className="flex justify-between items-center w-screen h-full">
                    <div className="cursor-pointer flex flex-col gap-2 w-20 justify-center items-center">
                        <Image 
                            src={logo}
                            alt="Create logo..."
                            id="logo"
                            onClick={scrollToFront} // Bruk handleClick her
                        />
                        <h3 className="text-moreredish font-semibold tracking-tighter">ELEVSIDER</h3>
                    </div>
                    
                    <div className="flex flex-row gap-12 m-4 justify-between items-center ">
                        {/* user box */}
                        <div className='flex flex-row justify-start items-center gap-2 p-2 bg-white/40 rounded-md'>
                            <User size="14"/> 
                            <div className='0 w-auto flex flex-row justify-center items-center gap-2'>
                                {user ? ( 
                                <>
                                    {user?.name}
                                    <button onClick={() => signOut({ callbackUrl: "/elev" })} className='bg-evenmoreredish p-1 rounded-full'>
                                        <LogOutIcon size="14"/>
                                    </button>
                                </>
                                ) : (
                                    <>
                                    <div onClick={() => signIn("feide", { callbackUrl: "/elev" })} className='flex flex-row justify-center items-center'>Logg inn med feide
                                        <button className='bg-green-600 p-1 rounded-full ml-2'>
                                            <LogInIcon size="14"/>
                                        </button>
                                    </div>
                                    </>
                                )}
                                
                            </div>
                        </div>
                        {user && <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />}
                    </div>
                    
                </div>
            </div>
            <div className="absolute top-20 lg:top-24 z-50">
                {user && <Navbar isOpen={isOpen} onClose={toggleMenu}/>}
            </div>
        </header>
    );
};

export default ElevHeader;
