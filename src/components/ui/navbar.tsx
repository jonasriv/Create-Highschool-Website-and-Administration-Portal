'use client'
import React from "react";
import { Instagram, Facebook, Mail, CircleArrowRight, Phone } from 'lucide-react'
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
            <div className="flex fixed bg-black/35 flex-col w-full h-full lg:h-32 font-mina text-slate-100 z-200 justify-start backdrop-blur-lg border-white">
                <ul className="border-y-2 lg:border-0 border-pinky flex cursor-pointer flex-col lg:flex-row text-lg font-bold lg:justify-center lg:left-0 lg:right-0 lg:mx-auto lg:mt-4 lg:max-w-screen-2xl z-200 divide-y-2 lg:divide-y-0 divide-pinky">
                    <li onClick={() => { scrollToSection("intro"); onClose(); }} className="flex items-center lg:items-start justify-between py-4 px-2 lg:text-2xl lg:rounded-3xl lg:mx-4 lg:p-2 lg:ring-[2px] ring-transparent hover:text-pinky"><span>Elev på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li onClick={() => { scrollToSection("study"); onClose(); }} className="flex items-center lg:items-start justify-between py-4 px-2 lg:text-2xl  lg:rounded-3xl lg:mx-4 lg:p-2 lg:ring-[2px] ring-transparent hover:text-pinky"><span>Programfagene</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li onClick={() => { scrollToSection("admission"); onClose(); }} className="flex items-center lg:items-start justify-between py-4 px-2 lg:text-2xl  lg:rounded-3xl lg:mx-4 lg:p-2 lg:ring-[2px] ring-transparent hover:text-pinky"><span>Opptak og info</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <Link href="/soknad" className="flex flex-row items-center lg:items-start justify-between py-4 px-2 lg:text-2xl  lg:rounded-3xl lg:mx-4 lg:p-2 lg:ring-[2px] ring-transparent hover:text-pinky">
                        <li className="flex flex-row justify-between items-center lg:items-start w-full"><span>Søk på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    </Link>
                    <li onClick={() => { scrollToSection("contact"); onClose();}} className="flex lg:flex-col items-center py-4 px-2 justify-between lg:justify-center gap-4 lg:text-2xl  lg:rounded-3xl lg:mx-4 lg:p-2 lg:ring-[2px] ring-transparent hover:text-pinky">Kontakt oss:
                        <div className="flex flex-row justify-start gap-4 items-center pr-4">
                            <a href="https://www.instagram.com/createvgs/" target="_blank" className="hover:bg-pinky rounded-xl p-2">
                                <Instagram color="white" size={22} />
                            </a>
                            <a href="https://www.facebook.com/createvgs/" target="_blank" className="hover:bg-pinky rounded-xl p-2">
                            <Facebook color="white" size={22} />
                            </a>
                            <a href="mailto:mail@create.no" target="_blank" className="hover:bg-pinky rounded-xl p-2">
                                <Mail color="white" size={22} />
                            </a>
                            <a href="tel:+4746787000"  target="_blank" className="hover:bg-pinky rounded-xl p-2">
                                <Phone color="white" size={22} />
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;