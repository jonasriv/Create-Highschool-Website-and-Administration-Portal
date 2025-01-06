'use client'
import React from "react";
import Image from 'next/image';
import Logo from  '../../public/images/logo-header.svg'
import { ChevronsDown } from 'lucide-react';
import Link from 'next/link';
import GetTextContent from "./GetTextContent";
const Front = () => {
    
    return (
        <div 
            id="front"
            className="flex flex-col justify-center items-center w-screen max-w-screen h-screen"

        >
            
            <div className="w-screen h-screen uppercase gap-8 flex flex-col justify-center items-center max-w-screen pt-12">
                <Image alt="image" src={Logo} className="w-36 md:w-72"></Image>
                <div className="flex flex-col md:hidden md:flex-row width-screen px-4 tracking-widest font-bahiana text-3xl font-black">
                    <h1 className="text-center leading-loose">
                        Lillehammer kreative 
                    </h1>
                    <h1 className="text-center leading-loose">
                        videregående skole
                    </h1>
                </div>
                <div className="hidden md:flex flex-col width-screen px-8 tracking-widest font-bahiana text-4xl md:text-4xl font-black">
                    <h1 className="text-center leading-loose">
                        <GetTextContent contentKey="frontpage_title"/>
                    </h1>
                </div>
                <h1 className="font-mina font-black text-xl md:text-3xl">
                <GetTextContent contentKey="frontpage_soknadsfrist"/>
                </h1>
                <Link href="/soknad">
                    <button className="bg-pinky w-52 md:w-72 h-14 flex justify-center items-center text-2xl md:text-4xl p-6 md:p-10 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                </Link>
                <div>
                    <ChevronsDown size="72"/>
                </div>
            </div>
        </div>
    )
}

export default Front;