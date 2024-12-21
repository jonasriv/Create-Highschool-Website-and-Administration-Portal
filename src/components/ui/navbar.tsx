'use client'
import React from "react";
import { Instagram, Facebook, Mail, Info, Music4, CircleArrowRight, Phone } from 'lucide-react'
import { Button } from "@/components/ui/button";

interface NavbarProps {
    isOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen }) => {
    return (
        
        <div className={`${isOpen ? "opacity-90 lg:opacity-80 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-300 z-200`}>
            <div className="flex fixed bg-black flex-col w-full z-55 text-slate-100 justify-center z-200">
                <ul className="flex cursor-pointer flex-col lg:flex-row text-xxl font-bold divide-y-2 lg:divide-y-0 z-80 divide-pink-700 lg:justify-center lg:left-0 lg:right-0 lg:mx-auto lg:max-w-screen-2xl z-200">
                    <li className="flex hover:bg-gradient-to-r from-pinky to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 lg:border-x-2 border-pink-700"><span>Om Create</span><CircleArrowRight size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 lg:border-x-2 "><span>Musikk, dans og drama</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 lg:border-2 "><span>Opptak og forventninger</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 lg:border-2 "><span>Søk på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex lg:flex-col hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center py-8 px-2 justify-between lg:justify-center gap-4 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 lg:border-2 ">Kontakt oss:
                        <div className="flex flex-row justify-start gap-4 items-center pr-4">
                            <Instagram color="white" size={22} />
                            <Facebook color="white" size={22} />
                            <Mail color="white" size={22} />
                            <Phone color="white" size={22} />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar;