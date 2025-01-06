'use client'
import React, { useRef, useState, useEffect } from 'react';
import { ChevronsRight, ChevronsDown } from "lucide-react";
import GetTextContent from './GetTextContent';
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

                    <h1 className="font-bahiana uppercase text-4xl lg:text-5xl tracking-widest text-center text-white font-black pt-2 lg:pt-0">
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
                        
                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center h-full">
                            <div className="flex flex-col w-screen md:w-full justify-end items-end md:h-full md:rounded-t-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] md:rounded-xl flex flex-col justify-end items-center h-full"
                                    style={{
                                        backgroundImage: `url(${Create2.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-4xl bg-black/70 py-4 w-full flex justify-center items-end md:rounded-b-xl">
                                        <div className="mx-2 md:m-4">
                                            <GetTextContent contentKey="elev_1" />   
                                        </div>
                                        <div className="flex justify-center items-center ">
                                            <div className="opacity-80 md:hidden rounded-xl">
                                                <ChevronsRight size="56"/>
                                            </div>
                                            <div className="hidden md:block opacity-80 rounded-xl">
                                                <ChevronsRight size="96"/>
                                            </div>
                                        </div>                                         
                                    </div>   
                                </div>
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center h-full">
                            <div className="flex flex-col w-screen md:w-full justify-end items-end md:h-full md:rounded-t-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] md:rounded-xl flex flex-col justify-end items-center h-full"
                                    style={{
                                        backgroundImage: `url(${Create3.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-4xl bg-black/70 py-4 w-full flex justify-center items-end md:rounded-b-xl">
                                        <div className="mx-2 md:m-4">
                                            <GetTextContent contentKey="elev_2" />   
                                        </div>
                                        <div className="flex justify-center items-center ">
                                            <div className="opacity-80 md:hidden rounded-xl">
                                                <ChevronsRight size="56"/>
                                            </div>
                                            <div className="hidden md:block opacity-80 rounded-xl">
                                                <ChevronsRight size="96"/>
                                            </div>
                                        </div>                                         
                                    </div>   
                                </div>
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center h-full">
                            <div className="flex flex-col w-screen md:w-full justify-end items-end md:h-full md:rounded-t-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] md:rounded-xl flex flex-col justify-end items-center h-full"
                                    style={{
                                        backgroundImage: `url(${Create4.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-4xl bg-black/70 py-4 w-full flex justify-center items-end md:rounded-b-xl">
                                        <div className="mx-2 md:m-4">
                                            <GetTextContent contentKey="elev_3" />   
                                        </div>
                                        <div className="flex justify-center items-center ">
                                            <div className="opacity-80 md:hidden rounded-xl">
                                                <ChevronsRight size="56"/>
                                            </div>
                                            <div className="hidden md:block opacity-80 rounded-xl">
                                                <ChevronsRight size="96"/>
                                            </div>
                                        </div>                                         
                                    </div>   
                                </div>
                            </div>
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center h-full">
                            <div className="flex flex-col w-screen md:w-full justify-end items-end md:h-full md:rounded-t-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] md:rounded-xl flex flex-col justify-end items-center h-full"
                                    style={{
                                        backgroundImage: `url(${Create1.src})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-4xl bg-black/70 py-4 w-full flex justify-center items-end md:rounded-b-xl">
                                        <div className="mx-2 md:m-4">
                                            <GetTextContent contentKey="elev_4" />   
                                        </div>
                                        <div className="flex justify-center items-center ">
                                            <div className="opacity-80 md:hidden rounded-xl">
                                                <ChevronsDown size="56"/>
                                            </div>
                                            <div className="hidden md:block opacity-80 rounded-xl">
                                                <ChevronsDown size="96"/>
                                            </div>
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