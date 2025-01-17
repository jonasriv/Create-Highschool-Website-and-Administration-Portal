'use client'
import React from "react";
import { CircleArrowRight } from 'lucide-react'
import Link from 'next/link';

interface NavbarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Navbar: React.FC<NavbarProps> = ({isOpen, onClose }) => {

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
        onClose(); 
    };

    return (
        <div className={`${isOpen ? "opacity-100 lg:opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-300 z-200 h-full md:h-auto `}>
            <div className="flex fixed bg-black/40 flex-col w-full h-full lg:h-32 font-mina text-slate-100 z-200 justify-start backdrop-blur-lg border-white">
                <ul className="border-y-2 lg:border-0 border-pinky flex cursor-pointer flex-col lg:flex-row text-lg font-bold lg:justify-center lg:left-0 lg:right-0 lg:mx-auto lg:mt-4 lg:max-w-screen-2xl z-200 divide-y-2 lg:divide-y-0 divide-pinky">
                    <li onClick={() => { scrollToSection("hvaskjer"); onClose(); }} className="px-2 lg:px-0 flex items-center lg:items-start justify-between py-4 lg:text-xl lg:mx-4 hover:text-pinky"> 
                        <span>Hva skjer?</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/>
                    </li>
                    <li onClick={() => { scrollToSection("study"); onClose(); }} className="px-2 lg:px-0 flex items-center lg:items-start justify-between py-4 lg:text-xl lg:mx-4 hover:text-pinky">
                        <span>Programfagene</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/>
                    </li>
                    <li onClick={() => { scrollToSection("intro"); onClose(); }} className="px-2 lg:px-0 flex items-center lg:items-start justify-between py-4 lg:text-xl lg:mx-4 hover:text-pinky">
                        <span>Elev på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/>
                    </li>
                    <li onClick={() => { scrollToSection("admission"); onClose(); }} className="px-2 lg:px-0 flex items-center lg:items-start justify-between py-4 lg:text-xl lg:mx-4 hover:text-pinky">
                        <span>Opptak og info</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/>
                    </li>
                    <Link href="/soknad" className="flex flex-row items-center lg:items-start justify-between py-4 lg:text-xl lg:mx-4 hover:text-pinky">
                        <li className="px-2 lg:px-0 flex flex-row justify-between items-center lg:items-start w-full">
                            <span>Søk på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/>
                        </li>
                    </Link>
                    <li onClick={() => { scrollToSection("contact"); onClose();}} className="px-2 lg:px-0 flex items-center lg:items-start justify-between py-4 lg:text-xl lg:mx-4 hover:text-pinky">
                        <span>Kontakt</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;