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
import GetTextContent from './GetTextContent';
import { Star } from "lucide-react";


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
        className="flex flex-col justify-center items-center w-screen h-screen mt-0 pt-36 md:pt-16 lg:pt-0"
        >
            <div className="w-screen lg:w-[1024px] text-white flex flex-col justify-start items-center box-border ...  no-scrollbar mt-0 pt-0">
                <div className="flex flex-col lg:rounded-xl md:h-full lg:h-75-percent-screen w-full mt-0">
                    <h1 className="font-bahiana uppercase text-4xl md:text-5xl lg:text-6xl tracking-widest text-center text-white font-black mb-4 mt-4">
                        Programfagene
                    </h1>
                    <div id="subject_tabs" className="w-full">
                        <Tabs defaultValue="music_tab" className="w-full flex-col justify-start items-start">
                            <TabsList className="w-full flex flex-row items-center justify-between h-22 gap-4 bg-black/60 md:mb-4 rounded-none lg:rounded-xl lg:mb-8">
                                <TabsTrigger value="music_tab" className="opacity-100 p-2 lg:p-4 animate-flash-border1 text-md md:text-2xl uppercase"><span className="hidden md:block">Create&nbsp;</span>Musikk&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="dance_tab" className="opacity-100 p-2 lg:p-4 animate-flash-border2 text-md md:text-2xl uppercase"><span className="hidden md:block">Create&nbsp;</span>Dans&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="drama_tab" className="opacity-100 p-2 lg:p-4 animate-flash-border3 text-md md:text-2xl uppercase"><span className="hidden md:block">Create&nbsp;</span> Drama&nbsp;<Star size="12"/></TabsTrigger>
                            </TabsList> 

                        <TabsContent value="music_tab" className="lg:rounded-2xl w-full h-75-percent-screen overflow-hidden">
                            <div className="flex flex-col  md:justify-between items-start mb-4 ">
                                <div className="w-full">
                                    <div className="font-mina text-lg md:text-3xl text-slate-300 leading-normal px-2">
                                        <GetTextContent contentKey="program_musikk" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center lg:px-4 mt-4">
                                <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-self-center place-items-end mb-4 relative overflow-hidden no-scrollbar lg:rounded-lg object-cover object-top">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music1} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music2} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music3} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>                            
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="dance_tab" className="lg:rounded-2xl w-full h-75-percent-screen overflow-hidden">
                            <div className="flex flex-col  md:justify-between items-start mb-4 ">
                                <div className="w-full">
                                    <div className="font-mina text-lg md:text-3xl text-slate-300 leading-normal px-2">
                                        <GetTextContent contentKey="program_dans" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center mt-4">
                                    <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-self-center place-items-end mb-4 relative overflow-hidden no-scrollbar lg:rounded-lg object-cover object-top">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance1} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance2} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance3} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>                            
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="drama_tab" className="lg:rounded-2xl w-full h-75-percent-screen overflow-hidden">
                            <div className="flex flex-col  md:justify-between items-start mb-4 ">
                                <div className="w-full">
                                    <div className="font-mina text-lg md:text-3xl text-slate-300 leading-normal px-2">
                                        <GetTextContent contentKey="program_drama" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center lg:px-4 mt-4">
                                <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-self-center place-items-end mb-4 relative overflow-hidden no-scrollbar lg:rounded-lg object-cover object-top">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama1} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama2} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama3} alt="" className="lg:rounded-lg h-[24rem] md:h-[46rem] w-full object-cover object-center"></Image>
                                            </CarouselItem>                            
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