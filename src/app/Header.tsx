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
        <div className='flex fixed flex-row gap-1 opacity-90 justify-center items-center w-screen max-w-screen bg-gradient-to-r from-black via-transparent to-black h-24 lg:h-36 p-4 z-50'>
            <div className="flex justify-between items-center max-w-screen-lg w-screen h-full">
                <div>
                    <Image 
                    src={logo}
                    alt="Create logo..."
                    id="logo"
                    />
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

