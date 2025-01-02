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
            <div className="flex fixed bg-black/60 flex-col w-full h-full lg:h-44 text-slate-100 z-200 justify-start backdrop-blur-lg">
                <ul className="flex cursor-pointer flex-col lg:flex-row text-xxl font-bold lg:justify-center lg:left-0 lg:right-0 lg:mx-auto lg:max-w-screen-xl z-200 divide-y-2 md:divide-y-0 divide-redpink ">
                    <li onClick={() => { scrollToSection("front"); onClose(); }} className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-6 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink"><span>Forsiden</span><CircleArrowRight size={42} className="pr-2 lg:hidden"/></li>
                    <li onClick={() => { scrollToSection("intro"); onClose(); }} className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-6 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 md:ring-redpink"><span>Elev på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li onClick={() => { scrollToSection("study"); onClose(); }} className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-6 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink"><span>Programfagene</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li onClick={() => { scrollToSection("admission"); onClose(); }} className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-6 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink"><span>Opptak og info</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <Link href="/soknad" className="flex flex-row hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-6 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink">
                        <li className="flex flex-row justify-between items-center w-full"><span>Søk på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    </Link>
                    <li className="flex lg:flex-col items-center py-6 px-2 justify-between lg:justify-center gap-4 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink">Kontakt oss:
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