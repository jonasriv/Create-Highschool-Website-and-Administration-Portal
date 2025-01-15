'use client'
import React from "react";
import Image from 'next/image';
import Logo from  '../../public/images/logo-header.svg'
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
const Front = () => {
    
    return (
        <div 
            id="front"
            className="flex flex-col justify-center items-center w-screen max-w-screen h-screen"

        >
            
            <div className="w-screen h-screen uppercase gap-6 flex flex-col justify-between items-center max-w-screen pt-32">
                <Image alt="image" src={Logo} className="w-36 md:w-72"></Image>
                <div className="flex flex-col justify-center items-center gap-12">
                    <div className="md:flex flex-col width-screen px-8 tracking-widest font-roboto text-lg font-black">
                        <h1 className="text-center leading-loose text-xs normal-case">
                            Lillehammer kreative videregående skole
                        </h1>
                    </div>
                    <h1 className="font-roboto font-black text-xl normal-case">
                        Søknadsfrist 1.mars!
                    </h1>
                </div>
                <Link href="/soknad">
                    <button className="bg-pinky w-42 h-14 flex justify-center items-center text-2xl py-4 px-8 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                </Link>
                <div className="flex justify-center items-center pb-16">
                    <div className="opacity-40 py-4 md:hidden">
                        <ChevronDown size="44"/>
                    </div>
                    <div className="hidden md:block opacity-40 py-4">
                        <ChevronDown size="56"/>
                    </div>
                </div>   
            </div>
        </div>
    )
}

export default Front;