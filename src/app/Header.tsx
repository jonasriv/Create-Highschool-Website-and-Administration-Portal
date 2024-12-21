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

    return (
    <header>
        <div className='flex fixed flex-row gap-1 justify-center items-center w-full bg-gradient-to-r from-pinky to-redpink h-24 min-h-24 px-4 py-4 z-50'>
            <div className="flex justify-between items-center max-w-screen-xl w-full">
                <div>
                    <Image 
                    src={logo}
                    alt="Create logo..."
                    id="logo"
                    />
                </div>
                <h1 className="hidden lg:block font-bold font-mina text-slate-200">Lillehammer kreative videregående skole</h1>
                <div className="lg:hidden text-xs md:text-xl flex flex-col items-center font-bold [font-family:var(--font-bungee)]">
                    <h3>Lillehammer kreative</h3>
                    <h3>videregående skole</h3>
                </div>
                <div className="flex flex-row gap-6 m-4 justify-between items-center">
                    <HamburgerMenu isOpen={isOpen} toggleMenu={toggleMenu} />
                </div>
            </div>
        </div>
        <div className="absolute top-24 z-50">
            <Navbar isOpen={isOpen}/>
        </div>
    </header>
    )
}

export default Header;

