'use client'
import React from "react";
import { Instagram, Facebook, Mail, Info, Music4, CircleArrowRight, Phone } from 'lucide-react'
import { Button } from "@/components/ui/button";

interface NavbarProps {
    isOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen }) => {
    return (
        
        <div className={`${isOpen ? "opacity-100 lg:opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-300 z-200 h-full md:h-auto `}>
            <div className="flex fixed bg-gradient-to-r from-black via-black to-black opacity-90 flex-col w-full h-full lg:h-44 text-slate-100 z-200 justify-start">
                <ul className="flex cursor-pointer flex-col lg:flex-row text-xxl font-bold lg:justify-center lg:left-0 lg:right-0 lg:mx-auto lg:max-w-screen-2xl z-200 divide-y-2 md:divide-y-0 divide-redpink ">
                    <li className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink"><span>Om Create</span><CircleArrowRight size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 md:ring-redpink"><span>Musikk, dans og drama</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink"><span>Opptak og forventninger</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center justify-between py-8 px-2 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink"><span>Søk på Create</span><CircleArrowRight  size={42} className="pr-2 lg:hidden"/></li>
                    <li className="flex lg:flex-col hover:bg-gradient-to-r from-pinky via-redpink to-orangy items-center py-8 px-2 justify-between lg:justify-center gap-4 text-2xl lg:bg-black lg:rounded-3xl lg:m-4 lg:p-6 md:ring-2 ring-redpink">Kontakt oss:
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