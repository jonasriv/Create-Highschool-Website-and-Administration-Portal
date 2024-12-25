'use client'
import React, { useRef } from 'react';
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FieldBackground from '../../public/images/field-background.jpg';
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronDown } from "lucide-react";
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


const Intro = () => {

    return (
        <div 
        id="front"
        className="flex flex-col justify-center items-center w-full h-screen"
        style={{
            backgroundImage: `url(${FieldBackground.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}
        >
            <div 
                className="bg-black/70 w-screen text-white flex flex-col justify-start items-center h-screen max-h-screen box-border ... pt-36 md:pt-36 no-scrollbar"   
            >
                <h1 className="font-roboto uppercase text-2xl text-center text-pinky font-black">
                    Musikk, dans og drama med profesjonelle mentorer
                </h1>
                    
                <div className="flex flex-row mt-12 max-w-screen-lg md:rounded-b-xl w-full snap-x h-screen max-h-fit overflow-x-auto snap-mandatory left-auto right-auto no-scrollbar">
                    <div className="snap-start font-mina text-lg md:text-4xl text-white w-full h-full max-h-full min-w-full flex flex-row no-scrollbar">
                        <div className="">
                            <p className="text-2xl px-4">
                                Velger du musikk, dans og drama må du like å arbeide med vanlige skolefag. I tillegg bør du ha en sterk interesse for det fagområdet du velger.  
                            </p>             
                            <div className="text-end flex flex-row justify-end">
                                <ChevronRight size="72"/>  
                            </div>
                            <Image src={Create2} alt="" className="object-cover w-full md:rounded-xl pt-8"></Image>
                        </div>
                    </div>
                    <div className="snap-start font-mina text-2xl md:text-4xl text-white w-full min-w-full justify-center flex flex-row">
                        <div className="w-1/5 flex justify-start px-6 items-center ">    
                            <ChevronLeft size="72"/>
                        </div>                    
                        <div className="w-4/5">
                            <h1>Hva må jeg kunne?</h1>
                            <Image src={Create3} alt="" className="h-full object-cover rounded-xl"></Image>
                            <p>
                            Innenfor musikk bør du beherske minst ett instrument, som gjerne kan være sang eller musikkproduksjon. Dans er for deg som er interessert i dans og musikaler. Og velger du drama er det naturlig at du er interessert i teater og/eller film. <br/><br/>
                            </p>                                  
                        </div>
                        <div className="w-1/5 flex items-center justify-end px-6">
                            <ChevronRight size="72"/>
                        </div>
                    </div>
                    <div className="snap-start font-mina text-2xl md:text-4xl text-white w-full min-w-full justify-center flex flex-row">
                        <div className="w-1/5 flex justify-start px-6 items-center ">    
                            <ChevronLeft size="72"/>
                        </div>                    
                        <div className="w-4/5">
                            <h1>Hva må jeg kunne?</h1>
                            <Image src={Create4} alt="" className="h-full object-cover rounded-xl"></Image>
                            <p>
                            Innenfor musikk bør du beherske minst ett instrument, som gjerne kan være sang eller musikkproduksjon. Dans er for deg som er interessert i dans og musikaler. Og velger du drama er det naturlig at du er interessert i teater og/eller film. <br/><br/>
                            </p>                                  
                        </div>
                        <div className="w-1/5 flex items-center justify-end px-6">
                            <ChevronRight size="72"/>
                        </div>
                    </div>                
                    <div className="snap-start font-mina text-2xl md:text-4xl text-white w-full min-w-full justify-center flex flex-row">
                        <div className="w-1/5 flex justify-start px-6 items-center ">    
                            <ChevronLeft size="72" className="rounded-3xl hover:bg-slate-700"/>
                        </div>     
                                    
                        <div className="w-4/5">
                            <h1>Skolehverdagen</h1>
                            <Image src={Create1} alt="" className="h-full object-cover rounded-xl"></Image>
                            <p>
                                Programfagene har kompetansemål med fokus på både samarbeid og utvikling av praktiske ferdigheter. <br/><br/>Det blir ofte intense arbeidsperioder fram mot visninger, spilleprøver, konserter og forestillinger.<br/><br/>
                            </p>                                  
                        </div>
                        <div className="w-1/5"></div>
                    </div>                
                </div>
                <ChevronDown className="size-40 color-white"/>
            </div>
        </div>
    )
}

export default Intro;