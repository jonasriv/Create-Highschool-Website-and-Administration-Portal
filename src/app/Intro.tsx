'use client'
import React, { useRef, useState, useEffect } from 'react';
import { ChevronsRight, ChevronsLeft, ChevronsDown } from "lucide-react";

import Create1 from '../../public/images/foto/create1.png';
import Create2 from '../../public/images/foto/create2.png';
import Create3 from '../../public/images/foto/create3.png';
import Create4 from '../../public/images/foto/create4.png';

const Intro: React.FC = () => {
    
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                // Beregn hvor langt til venstre vi har scrollet, som en prosentandel
                const scrollLeft = scrollContainerRef.current.scrollLeft;  // Track horizontal scroll position
                const containerWidth = scrollContainerRef.current.scrollWidth;  // Total container width
                const windowWidth = scrollContainerRef.current.clientWidth;  // Visible width of the container

                // Beregn prosentandel som er scrollet horisontalt
                const scrollPercentage = (scrollLeft / (containerWidth - windowWidth)) * 100;
                setScrollPosition(scrollPercentage);
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            // Legg til event listener for scroll på containeren
            scrollContainer.addEventListener('scroll', handleScroll);
        }

        // Fjern event listener ved unmount
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    return (
        <div className="flex flex-col justify-start items-center w-screen h-screen pt-24 md:pt-36">
            <div className="w-full text-white flex flex-col justify-start items-center box-border ...  no-scrollbar  relative">
                <div className="">

                    <h1 className="font-bahiana uppercase text-4xl lg:text-5xl tracking-widest text-center text-white font-black">
                        Elev på Create
                    </h1>

                    {/*scroll-indikator*/}
                    <div className="w-full h-2 bg-slate-400 mt-4 md:mb-6 relative">
                        <div
                            className="h-full bg-pinky relative"
                            style={{
                            width: `${scrollPosition < 4 ? scrollPosition + 4 : scrollPosition}%`,
                            }}
                        >
                            <div
                            className=""
                            ></div>
                        </div>
                    </div>

                    <div ref={scrollContainerRef} className="flex flex-row md:max-width-screen-md lg:max-w-screen-lg w-screen snap-x snap-mandatory no-scrollbar overflow-x-scroll overflow-y-scroll scroll-smooth h-75-percent-screen py-10">
                        
                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-screen px-2 md:w-full">
                                <p className="text-lg md:text-2xl lg:text-3xl lg:px-0">
                                    På CREATE kan du velge fordypning i <b>musikk</b>, <b>dans</b> eller <b>drama</b>. I tillegg har vi vårt eget fag <b>kulturentreprenørskap</b>, og jobber med vanlige fag, slik at du får generell studiekompetanse. 
                                </p>   
                                <div className="flex justify-end items-center">
                                        <div className="bg-black/60 opacity-40 rounded-xl p-2 my-2">
                                            <ChevronsRight size="42"/>
                                        </div>
                                    </div>
                                <div 
                                    className="w-full h-30-percent-screen md:h-50-percent-screen md:rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create2.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="flex justify-center items-end h-full">
                                        <div className="bg-black/40 opacity-60 rounded-xl m-2 p-2">
                                            <ChevronsDown size="36"/>   
                                        </div>
                                    </div>
                                </div>
                              
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-full px-2">
                                <p className="text-lg md:text-2xl lg:text-3xl lg:px-0">
                                Velger du musikk, dans og drama må du like å arbeide med vanlige skolefag. I tillegg bør du ha en sterk interesse for det fagområdet du velger.           
                                </p>    
                                <div className="flex items-center">
                                        <div className="flex w-full justify-between my-2">
                                            <div className="rounded-xl p-2  bg-black/60 opacity-40 ">
                                                <ChevronsLeft size="36"/>
                                            </div>
                                            <div className="rounded-xl p-2  bg-black/60 opacity-40  ">
                                                <ChevronsRight size="36"/>
                                            </div>
                                        </div>
                                    </div>                                
                                <div 
                                    className="w-full h-30-percent-screen md:h-50-percent-screen rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create3.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                     <div className="flex justify-center items-end h-full">
                                        <div className="bg-black/40 opacity-60 rounded-xl m-2 p-2">
                                            <ChevronsDown size="36"/>   
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-full px-2">
                                <p className="text-lg md:text-2xl lg:text-3xl  lg:px-0">
                                Innenfor <span className="font-black">musikk</span> bør du beherske minst ett instrument, som gjerne kan være sang eller musikkproduksjon. <span className="font-black">Dans</span> er for deg som er interessert i dans og musikaler. Og velger du <span className="font-black">drama</span> er det naturlig at du er interessert i teater og/eller film.       
                                </p>    
                                <div className="flex justify-center items-center">
                                        <div className="flex w-full  justify-between">
                                            <div className="rounded-xl p-2 my-2 bg-black/40 opacity-60 ">
                                                <ChevronsLeft size="36"/>
                                            </div>
                                            <div className="rounded-xl p-2 my-2 bg-black/40 opacity-60  ">
                                                <ChevronsRight size="36"/>
                                            </div>
                                        </div>
                                    </div>                                
                                <div 
                                    className="w-full h-30-percent-screen md:h-50-percent-screen rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create4.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="flex justify-center items-end h-full">
                                        <div className="bg-black/40 opacity-60 rounded-xl m-2 p-2">
                                            <ChevronsDown size="36"/>   
                                        </div>
                                    </div>
                                </div>                                     
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-full px-2">
                                <p className="text-lg md:text-2xl lg:text-3xl lg:px-0">
                                Programfagene har kompetansemål med fokus på både <b>samarbeid</b> og utvikling av <b>praktiske ferdigheter</b>. Det blir ofte intense arbeidsperioder fram mot visninger, spilleprøver, konserter og forestillinger. 
                                </p>    
                                <div className="flex justify-start items-center">
                                        <div className="bg-black/40 opacity-60 rounded-xl p-2 my-2">
                                            <ChevronsLeft size="36"/>
                                        </div>
                                    </div>      
                                <div 
                                    className="w-full h-30-percent-screen md:h-50-percent-screen rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create1.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="flex justify-center items-end h-full">
                                        <div className="bg-black/40 opacity-60 rounded-xl m-2 p-2">
                                            <ChevronsDown size="36"/>   
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Intro;