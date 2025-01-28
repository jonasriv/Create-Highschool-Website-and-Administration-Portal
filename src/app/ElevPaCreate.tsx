'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import React from 'react';
import GetTextContent from './GetTextContent';
import { ChevronRight, ChevronLeft } from 'lucide-react';


const ElevPaCreate: React.FC = () => {
    const Create1 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1737651744/Edit_863_en40np.jpg';
    const Create2 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507028/IMG_9715-1_h6bj7f.jpg';

    return (
        <div className="flex flex-col justify-center items-center w-screen h-full mt-12 mb-8 rounded-xl">
            <div className="w-screen h-full lg:w-[1024px] text-white flex flex-col justify-center items-center box-border ...  no-scrollbar mt-0 ">
                <div className="flex h-full flex-col lg:rounded-2xl w-full justify-center items-center gap-8">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 mt-8">
                        Elev på Create
                    </h1>
                    <div className="flex flex-col justify-end items-center md:rounded-xl w-full md:w-[600px] lg:w-[1024px] h-[480px] md:h-[600px] lg:h-[600px]"
                                    style={{
                                        backgroundImage: `url(${Create1})`, 
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                    >                   

                        <div className="w-full justify-center md:rounded-xl h-auto bg-black/90 flex items-center">
                            
                            <Carousel autoplay={true} autoplayDelay={9000} opts={{ loop: true }} className="flex flex-row w-11/12 justify-center md:rounded-b-xl h-auto text-white pt-4 pb-2 md:pb-8 max-w-screen-md overflow-hidden cursor-grab">
                                <CarouselContent className="w-full flex flex-row mt-2 pt-0">
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-xl md:text-2xl">
                                        <div className="w-1/12 text-left h-full flex items-center justify-start">
                                            <ChevronLeft/>
                                        </div>                                       
                                        <div className="w-10/12 h-full pt-4">
                                            <GetTextContent contentKey="elev_4"/>   
                                        </div>
                                        <div className="w-1/12 text-end h-full flex items-center justify-end">
                                            <ChevronRight/>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-xl md:text-2xl">
                                        <div className="w-1/12 text-left h-full flex items-center justify-start">
                                            <ChevronLeft/>
                                        </div>                                       
                                        <div className="w-10/12 h-full pt-4">
                                            <GetTextContent contentKey="elev_1"/>   
                                        </div>
                                        <div className="w-1/12 text-end h-full flex items-center justify-end">
                                            <ChevronRight/>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>                            
                            </Carousel>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-center md:rounded-xl w-full md:w-[600px] lg:w-[1024px] h-[480px] md:h-[600px] lg:h-[600px]"
                                    style={{
                                        backgroundImage: `url(${Create2})`, 
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                    >                   
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest md:rounded-b-xl text-center text-black font-black mb-4 mt-4">
                        
                    </h1>
                    <div className="w-full justify-center md:rounded-b-xl h-auto bg-black/90 flex jstify-center items center">
                            <Carousel autoplay={true} autoplayDelay={10000} opts={{ loop: true }} className="flex flex-row w-full justify-center md:rounded-b-xl h-auto text-white pt-4 pb-2 md:pb-8 max-w-screen-md overflow-hidden cursor-grab">
                                <CarouselContent className="w-full flex flex-row mt-2 pt-0">
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-xl md:text-2xl">
                                        <div className="w-1/12 text-left h-full flex items-center justify-start">
                                            <ChevronLeft/>
                                        </div>                                       
                                        <div className="w-10/12 h-full pt-4">
                                            <GetTextContent contentKey="elev_2"/>   
                                        </div>
                                        <div className="w-1/12 text-end h-full flex items-center justify-end">
                                            <ChevronRight/>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-xl md:text-2xl">
                                        <div className="w-1/12 text-left h-full flex items-center justify-start">
                                            <ChevronLeft/>
                                        </div>                                       
                                        <div className="w-10/12 h-full pt-4">
                                            <GetTextContent contentKey="elev_3"/>   
                                        </div>
                                        <div className="w-1/12 text-end h-full flex items-center justify-end">
                                            <ChevronRight/>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>   
                            </Carousel>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    );
};

export default ElevPaCreate;
