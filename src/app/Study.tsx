'use client';
import { useEffect, useRef } from 'react';
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import Music1 from '../../public/images/foto/music1.png';
import Music2 from '../../public/images/foto/music2.png';
import Music3 from '../../public/images/foto/music3.png';
import Dance1 from '../../public/images/foto/dance1.png';
import Dance2 from '../../public/images/foto/dance2.png';
import Dance3 from '../../public/images/foto/dance3.png';
import Drama1 from '../../public/images/foto/drama1.png';
import Drama2 from '../../public/images/foto/drama2.png';
import Drama3 from '../../public/images/foto/drama3.png';

import { ChevronRight } from "lucide-react";


const Study: React.FC = () => {    

    const scrollPositionRef = useRef(0);
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
                scrollPositionRef.current = (scrollPercentage);
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
        <div 
        id="front"
        className="flex flex-col justify-center items-center w-screen h-screen"

    >
            <div className="w-full text-white flex flex-col justify-start items-center box-border ...  no-scrollbar">
                <div className="flex flex-col md:bg-black/50 md:rounded-xl max-w-screen-lg h-70-percent-screen">
                    <h1 className="font-bahiana uppercase text-4xl md:text-5xl lg:text-6xl tracking-widest text-center text-white font-black">
                        Programfagene
                    </h1>
                    <div id="subject_tabs" className="w-full flex flex-row pb-12 md:pb-14 lg:pb-16">
                        <Tabs defaultValue="music_tab" className="">
                            <TabsList className="md:rounded-2xl mt-4 flex flex-row items-center justify-around h-22 gap-0 md:gap-8">
                                <TabsTrigger value="music_tab" className="text-md md:text-2xl uppercase"><span className="hidden md:block">Create&nbsp;</span>Musikk</TabsTrigger>
                                <ChevronRight/>
                                <TabsTrigger value="dance_tab" className="text-md md:text-2xl uppercase"><span className="hidden md:block">Create&nbsp;</span>Dans</TabsTrigger>
                                <ChevronRight/>
                                <TabsTrigger value="drama_tab" className="text-md md:text-2xl uppercase"><span className="hidden md:block">Create&nbsp;</span> Drama</TabsTrigger>
                            </TabsList> 

                        <TabsContent value="music_tab" className="md:rounded-2xl w-full h-75-percent-screen overflow-hidden no-scrollbar">
                            <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                <div className="w-full md:w-1/2 pr-4">
                                    <p className="font-mina text-xl md:text-3xl text-slate-300 leading-normal px-4">
                                        På Create Musikk er vi åpne for alle former for musikk: klassisk, jazz og popmusikk. Noen spiller klassisk klarinett, andre bruker Mac&apos;en til å produsere musikk og noen spiller dårlig gitar men skriver fantastiske låter.<br/><br/> Alle slags musikkutøvere hører hjemme på Create. 
                                    </p>                                   
                                </div>
                                <div className="w-full justify-center items-center md:w-1/2 md:pr-4">
                                    <Carousel autoplay={true} opts={{ loop: true }} className="md:max-w-lg flex justify-self-center place-items-end relative overflow-auto rounded-lg md:rounded-2xl h-30-percent-screen no-scrollbar">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music1} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music2} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music3} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                            </CarouselItem>                            
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="dance_tab" className="md:rounded-2xl w-full h-75-percent-screen overflow-hidden">
                            <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 ">
                                <div className="w-full md:w-1/2 pr-4">
                                    <p className="font-mina text-xl md:text-3xl text-slate-300 leading-normal px-4">
                                    På Create Dans er vi åpne for alle former for dans. Noen liker klassisk ballett, andre hip hop, og noen elsker musikaler. <br/><br/>Alle typer dansere hører hjemme på Create.
                                    </p>                                   
                                </div>
                                <div className="w-full justify-center items-center md:w-1/2 md:pr-4">
                                    <Carousel autoplay={true} opts={{ loop: true }} className="md:max-w-lg flex justify-self-center place-items-end mb-4 relative overflow-auto rounded-lg md:rounded-2xl h-30-percent-screen no-scrollbar">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center opacity-100">
                                                <Image src={Dance1} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance2} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                            </CarouselItem>
                                                <Image src={Dance3} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>  
                        
                        <TabsContent value="drama_tab" className="md:rounded-2xl w-full h-75-percent-screen overflow-hidden">
                            <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 ">
                                <div className="w-full md:w-1/2 pr-4">
                                    <p className="font-mina text-xl md:text-3xl text-slate-300 leading-normal px-4">
                                    På Create Drama arbeider vi både med scenisk teater og film og musikal. <br/><br/> Både innen teater og film arbeider vi med hele spekteret av en produksjon. Tekst og manus, scenografi, regi og lyddesign, og ikke minst rollen som skuespiller. 
                                    </p>                                   
                                </div>
                                <div className="w-full justify-center items-center md:w-1/2 md:pr-4">
                                    <Carousel autoplay={true} opts={{ loop: true }} className="md:max-w-lg flex justify-self-center place-items-end mb-4 relative overflow-auto rounded-lg md:rounded-2xl h-30-percent-screen no-scrollbar">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center opacity-100">
                                                <Image src={Drama1} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama2} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                            </CarouselItem>
                                                <Image src={Drama3} alt="" className="h-[16rem] md:h-[32rem] w-full object-cover object-top"></Image>
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                            
                        </TabsContent>  

                    </Tabs>
                    </div>
                </div>    
            </div>
        </div>
    )
}

export default Study;