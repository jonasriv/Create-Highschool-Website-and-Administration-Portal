'use client'
import React from "react";
import Image from 'next/image';
import Logo from  '../../public/images/FetBakgrunnMoreRedish.png'
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
const Front = () => {
    
    return (
        <div 
            id="front"
            className="flex flex-col justify-center items-center w-screen max-w-screen h-screen"
        >          
            <div className="w-screen h-full gap-24 flex flex-col justify-center items-center max-w-screen pt-16 md:pt-0 pb-0 mb-12">
                <div className="flex flex-col justify-around items-center w-full px-4 font-roboto text-lg gap-0 break-keep">
                    <Image alt="image" src={Logo} className="w-52 md:w-96 flex justify-center items-center pb-16"></Image>
                    <h1 className="text-center text-[16px]  normal-case break-keep font-roboto">
                        Lillehammer kreative videregående skole
                    </h1>
                </div>
                <div className="flex flex-col w-96 items-center justify-around gap-6">
                    
                    <Link href="/soknad">
                        <button className="bg-white/20 w-42 h-14 flex justify-center items-center text-2xl py-4 px-8 rounded-3xl font-black text-white border-2 border-transparent hover:border-white hover:text-white ">
                            Søk nå!
                        </button>
                    </Link>
                    <h1 className="font-roboto text-xl normal-case text-center">
                        Søknadsfrist 1. mars!
                    </h1>
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