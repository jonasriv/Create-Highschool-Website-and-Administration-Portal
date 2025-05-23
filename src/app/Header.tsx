'use client'
import Image from 'next/image';
import { useState } from "react";
import logo from '../../public/images/logo-header.svg';
import HamburgerMenu from "@/components/ui/hamburgermenu";
import Link from 'next/link';
import Navbar from "@/components/ui/navbar";

const Header = () => {
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
                <div className="flex justify-between items-center max-w-screen-lg w-screen h-full">
                    <div className="cursor-pointer">
                        <Image 
                            src={logo}
                            alt="Create logo..."
                            id="logo"
                            onClick={scrollToFront} // Bruk handleClick her
                        />
                    </div>
                    
                    <div className="flex flex-row gap-12 m-4 justify-between items-center ">
                        <Link href="/soknad">
                            <button className="bg-pinky w-22 h-10 flex justify-center items-center text-md py-2 px-4 rounded-3xl font-black text-slate-200 border-2 border-transparent hover:border-white hover:text-white">
                                Søk nå
                            </button>
                        </Link>
                        <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
                    </div>
                </div>
            </div>
            <div className="absolute top-20 lg:top-24 z-50">
                <Navbar isOpen={isOpen} onClose={toggleMenu}/>
            </div>
        </header>
    );
};

export default Header;
