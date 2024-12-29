'use client'
import React, { useRef, useState, useEffect } from 'react';
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FieldBackground from '../../public/images/field-background.jpg';
import Background2 from '../../public/images/gpt-background2.webp';
import { ChevronRight, ChevronLeft, ChevronDown, ChevronUp, SquareChevronRight, SquareChevronLeft, SquareChevronDown, Columns4 } from "lucide-react";

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
        <div id="front" className="flex flex-col justify-start items-center w-screen h-screen">

   

            <div className="w-full text-white flex flex-col justify-start items-center box-border ...  no-scrollbar  relative">

                <div className="h-12-percent-screen md:h-10-percent-screen w-full"></div>
                <div className="">

                    <h1 className="font-bahiana uppercase text-5xl md:text-5xl lg:text-7xl tracking-widest text-center text-white font-black">
                        Musikk, dans og drama
                    </h1>

                    {/*scroll-indikator*/}
                    <div className="w-full h-2 bg-slate-400 mt-4 md:mb-6">
                    <div 
                            className="h-full bg-pinky w-10"
                            style={{ width: `${scrollPosition}%` }}
                        />
                    </div>

                    <div ref={scrollContainerRef} className="flex flex-row max-w-screen-lg w-screen snap-x snap-mandatory no-scrollbar overflow-x-scroll overflow-y-scroll scroll-smooth h-75-percent-screen pt-8 lg:pt-0">
                        
                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-screen md:w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0 pb-10">
                                    På CREATE kan du velge fordypning i <span className="font-black">musikk</span>, <span className="font-black">dans</span> eller <span className="font-black">drama</span>. I tillegg har vi vårt eget fag <span className="font-black">kulturentreprenørskap</span>, og jobber med vanlige fag, slik at du får generell studiekompetanse. 
                                </p>   
                                
                                <div 
                                    className="w-full h-96 md:h-50-percent-screen md:rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create2.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                    >
                                        <div className="w-full flex items-start justify-end h-full opacity-60 pr-2"> 
                                                <ChevronRight size="96" strokeWidth={1.0} color="white"/>
                                        </div>       
                                </div>
                              
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0 pb-10">
                                Velger du musikk, dans og drama må du like å arbeide med vanlige skolefag. I tillegg bør du ha en sterk interesse for det fagområdet du velger.           
                                </p>    
                                <div 
                                    className="w-full h-96 md:h-50-percent-screen md:rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create3.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                    >
                                        <div className="w-full flex items-start justify-between h-full opacity-60 pt-2"> 
                                                <ChevronLeft size="96" strokeWidth={1.0} color="white"/>
                                                <ChevronRight size="96" strokeWidth={1.0} color="white"/>
                                        </div>       
                                </div>
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0 pb-10">
                                Innenfor <span className="font-black">musikk</span> bør du beherske minst ett instrument, som gjerne kan være sang eller musikkproduksjon. <span className="font-black">Dans</span> er for deg som er interessert i dans og musikaler. Og velger du <span className="font-black">drama</span> er det naturlig at du er interessert i teater og/eller film.       
                                </p>    
                                <div 
                                    className="w-full h-96 md:h-50-percent-screen md:rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create4.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                    >
                                        <div className="w-full flex items-start justify-between h-full opacity-80 pt-2"> 
                                                <ChevronLeft size="96" strokeWidth={1.0} color="white"/>
                                                <ChevronRight size="96" strokeWidth={1.0} color="white"/>
                                        </div>       
                                </div>                                     
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12">
                            <div className="flex flex-col w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0 pb-10">
                                Programfagene har kompetansemål med fokus på både <span className="font-black">samarbeid</span> og utvikling av <span className="font-black">praktiske ferdigheter</span>. <br/><br/>Det blir ofte intense arbeidsperioder fram mot visninger, spilleprøver, konserter og forestillinger. 
                                </p>    
                                <div 
                                    className="w-full h-96 md:h-50-percent-screen md:rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create1.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                    >
                                        <div className="w-full flex flex-col justify-between h-full opacity-60"> 
                                                <ChevronLeft size="96" strokeWidth={1.0} color="white"/>  
                                                <div className="flex items-center justify-center w-full ">
                                                    <ChevronDown size="96" strokeWidth={2.0} color="white"/>
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