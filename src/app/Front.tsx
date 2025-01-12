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
            
            <div className="w-screen h-screen uppercase gap-6 flex flex-col justify-between items-center max-w-screen pt-32">
                <Image alt="image" src={Logo} className="w-36 md:w-72"></Image>
                <div className="md:flex flex-col width-screen px-8 tracking-widest font-mina text-lg font-black">
                    <h1 className="text-center leading-loose text-lg">
                        Lillehammer kreative videregående skole
                    </h1>
                </div>
                <h1 className="font-mina font-black text-xl">
                    Søknadsfrist 1.mars!
                </h1>
                <Link href="/soknad">
                    <button className="bg-pinky w-42 h-14 flex justify-center items-center text-2xl py-4 px-8 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                </Link>
                <div className="pb-8">
                    <ChevronsDown size="44"/>
                </div>
            </div>
        </div>
    )
}

export default Front;