'use client'
import React from "react";
import Image from 'next/image';
import Logo from  '../../public/images/logo-header-kopi.svg'
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import GetTextContent from "./GetTextContent";
const Front = () => {
    
    return (
        <div 
            id="front"
            className="flex flex-col justify-center items-center w-screen max-w-screen h-screen"
        >          
            <div className="w-screen h-full gap-32 flex flex-col justify-center items-center max-w-screen pt-16 md:pt-0 pb-0 mb-0">
                <div className="bg-blue flex flex-col justify-around items-center w-full px-4 tracking-widest font-roboto text-lg gap-4 break-keep">
                    <Image alt="image" src={Logo} className="w-36 md:w-72 flex justify-center items-center svg-purple"></Image>
                    <h1 className="text-center leading-loose text-xs normal-case font-roboto break-keep">
                        Lillehammer kreative videregående skole
                    </h1>
                </div>


                <div className="flex flex-col w-full items-center justify-around gap-8">
                    <h1 className="font-roboto font-black text-xl normal-case text-center">
                        <GetTextContent contentKey="frontpage_soknadsfrist"/>
                    </h1>
                    <Link href="/soknad">
                        <button className="bg-pinky w-42 h-14 flex justify-center items-center text-2xl py-4 px-8 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                    </Link>
                    <div className="flex justify-center items-center">
                        <div className="opacity-40 py-4 md:hidden">
                            <ChevronDown size="44"/>
                        </div>
                        <div className="hidden md:block opacity-40 py-4">
                            <ChevronDown size="56"/>
                        </div>
                    </div> 
                </div>
            </div>  
        </div>
    )
}

export default Front;