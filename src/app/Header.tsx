'use client'
import Image from 'next/image';
import { useState } from "react";
import logo from '../../public/images/logo-header.svg';
import HamburgerMenu from "@/components/ui/hamburgermenu";
import Navbar from "@/components/ui/navbar";


const Header = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen)
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
            className='flex fixed flex-row gap-1 opacity-60 justify-center items-center w-screen max-w-screen bg-gradient-to-r from-black via-black to-black h-20 md:h-24 p-4 z-50'
           >
            <div className="flex justify-between items-center max-w-screen-lg w-screen h-full">
                <div className="cursor-pointer">
                    <Image 
                    src={logo}
                    alt="Create logo..."
                    id="logo"
                    onClick={scrollToFront}
                    />
                </div>
                <div className="flex flex-row gap-6 m-4 justify-between items-center">
                    <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
                </div>
            </div>
        </div>
        <div className="absolute top-20 md:top-24 z-50">
            <Navbar isOpen={isOpen} onClose={toggleMenu}/>
        </div>
    </header>
    )
}

export default Header;

