'use client'
import React, { useRef, useState, useEffect } from 'react';
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FieldBackground from '../../public/images/field-background.jpg';
import Background2 from '../../public/images/gpt-background2.webp';
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { GalleryHorizontal } from "lucide-react";
import { MoveRight } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";

import Create1 from '../../public/images/foto/create1.png';
import Create2 from '../../public/images/foto/create2.png';
import Create3 from '../../public/images/foto/create3.png';
import Create4 from '../../public/images/foto/create4.png';

const Intro: React.FC = () => {
        const scrollContainer = useRef<HTMLDivElement | null>(null);
        const [activeIndex, setActiveIndex] = useState(0);
        const totalSections = 4;
      
        const handleScroll = () => {
            const container = scrollContainer.current;
            if (container) {
                const sectionWidth = container.scrollWidth / totalSections;
                const currentIndex = Math.round(container.scrollLeft / sectionWidth);
                setActiveIndex(currentIndex);
            }
        };

    return (
        <div id="front" className="flex flex-col justify-center items-center w-screen h-screen">
            <div className="w-screen text-white flex flex-col justify-start items-center box-border ...  no-scrollbar  relative">
                
                <div className="lg:bg-black/60 lg:backdrop-blur-sm lg:border-4 lg:border-black lg:rounded-3xl h-three-quarter-screen">

                    <h1 className="font-bahiana uppercase text-5xl md:text-5xl lg:text-7xl tracking-widest text-center text-white font-black px-4 pt-8">
                        Musikk, dans og drama
                    </h1>
                    
                    <div className="flex flex-row pt-4 max-w-screen-lg w-screen snap-x snap-mandatory no-scrollbar overflow-x-scroll overflow-y-scroll scroll-smooth">
                        
                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center p-4">
                            <div className="flex flex-col w-screen md:w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0">
                                    På CREATE kan du velge fordypning i <span className="font-black">musikk</span>, <span className="font-black">dans</span> eller <span className="font-black">drama</span>. I tillegg har vi vårt eget fag <span className="font-black">kulturentreprenørskap</span>, og jobber med vanlige fag, slik at du får generell studiekompetanse. Søknadsfristen er 1. mars!            
                                </p>   
                                <div className="w-full flex items-center justify-center p-3"> 
                                    <div className="bg-white/20 flex justify-end items-center rounded-full">
                                            &nbsp;<ChevronRight size="72" strokeWidth={3.5} color="white"/>
                                    </div>
                                </div>  
                                <Image alt="image" src={Create2} className="w-full object-cover lg:h-35-percent-screen lg:rounded-md"></Image> 
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12 p-4 lg:pt-8 lg:rounded-3xl">
                            <div className="flex flex-col w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0">
                                Velger du musikk, dans og drama må du like å arbeide med vanlige skolefag. I tillegg bør du ha en sterk interesse for det fagområdet du velger.           
                                </p>    
                                
                                <div className="flex flex-row justify-between p-3 rounded-3xl hover:opacity-70">
                                    <div className="bg-white/20 flex justify-start items-center rounded-full">
                                        <ChevronLeft size="72" strokeWidth={3.5} color="white"/>&nbsp;
                                    </div>
                                    <div className="bg-white/20 flex justify-start items-center rounded-full">
                                        &nbsp;<ChevronRight size="72" strokeWidth={3.5} color="white"/>
                                    </div>
                                </div>      
                                <Image alt="image" src={Create3} className="w-full object-cover lg:h-35-percent-screen lg:rounded-lg lg:pb-4 object-center"></Image> 
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12 p-4 lg:pt-8 lg:rounded-3xl">
                            <div className="flex flex-col w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0">
                                Innenfor <span className="font-black">musikk</span> bør du beherske minst ett instrument, som gjerne kan være sang eller musikkproduksjon. <span className="font-black">Dans</span> er for deg som er interessert i dans og musikaler. Og velger du <span className="font-black">drama</span> er det naturlig at du er interessert i teater og/eller film.       
                                </p>    
                                <div className="flex flex-row justify-between p-3 rounded-3xl hover:opacity-70">
                                    <div className="bg-white/20 flex justify-start items-center rounded-full">
                                        <ChevronLeft size="72" strokeWidth={3.5} color="white"/>&nbsp;
                                    </div>
                                    <div className="bg-white/20 flex justify-start items-center rounded-full">
                                        &nbsp;<ChevronRight size="72" strokeWidth={3.5} color="white"/>
                                    </div>
                                </div>                                     
                                <Image alt="image" src={Create4} className="w-full object-cover h-full lg:h-35-percent-screen lg:rounded-md lg:pb-4 object-center"></Image> 
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-start items-center gap-12 p-4 pt-8 lg:rounded-md">
                            <div className="flex flex-col w-full">
                                <p className="text-2xl md:text-3xl lg:text-4xl px-2 lg:px-0">
                                Programfagene har kompetansemål med fokus på både <span className="font-black">samarbeid</span> og utvikling av <span className="font-black">praktiske ferdigheter</span>. <br/><br/>Det blir ofte intense arbeidsperioder fram mot visninger, spilleprøver, konserter og forestillinger. 
                                </p>    
                                <Image alt="image" src={Create1} className="w-full object-cover h-64 lg:h-35-percent-screen rounded-lg mt-4 object-center"></Image> 
                                <div className="flex flex-row justify-center p-3 rounded-md hover:opacity-70 items-center ">
                                    <div className="bg-white/20 rounded-full">
                                        <ChevronDown size="64" strokeWidth={3.5} color="white"/>
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