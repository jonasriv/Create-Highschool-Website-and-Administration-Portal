'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import React from 'react';
import GetTextContent from './GetTextContent';


const ElevPaCreate: React.FC = () => {
    const Create1 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1737651744/Edit_863_en40np.jpg';
    const Create2 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507028/IMG_9715-1_h6bj7f.jpg';

    return (
        <div className="flex flex-col justify-center items-center w-screen h-full mt-12 mb-8 rounded-xl">
            <div className="w-screen h-full lg:w-[1024px] text-white flex flex-col justify-center items-center box-border ...  no-scrollbar mt-0 ">
                <div className="flex h-full flex-col lg:rounded-2xl w-full justify-center items-center gap-8">

                    <div className="flex flex-col justify-between items-center md:rounded-xl w-full md:w-[600px] lg:w-[1024px] h-[480px] md:h-[600px] lg:h-[600px]"
                                    style={{
                                        backgroundImage: `url(${Create1})`, 
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                    >                   
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 mt-8">
                        Elev på Create
                    </h1>
                        <div className="w-full justify-center md:rounded-b-xl h-auto bg-black/90 flex items-center">
                            
                            <Carousel autoplay={true} autoplayDelay={9000} opts={{ loop: true }} className="flex flex-row w-11/12 justify-center md:rounded-b-xl h-auto text-white pt-4 pb-2 max-w-screen-md overflow-hidden cursor-grab">
                                <CarouselContent className="w-full flex flex-row mt-4">
                                    <CarouselItem className="w-full min-w-full flex flex-col justify-end items-center text-xl md:text-2xl px-4 pb-2">
                                        <GetTextContent contentKey="elev_4" />   
                                    </CarouselItem>
                                    <CarouselItem className="w-full min-w-full flex flex-col justify-end items-center text-xl md:text-2xl px-4 pb-2">
                                        <GetTextContent contentKey="elev_1" />   
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
                            <Carousel autoplay={true} autoplayDelay={10000} opts={{ loop: true }} className="flex flex-row w-full justify-center md:rounded-b-xl h-auto text-white pt-4 pb-8 max-w-screen-md overflow-hidden cursor-grab">
                                <CarouselContent className="w-full flex flex-row mt-4">
                                    <CarouselItem className="w-full min-w-full flex flex-col justify-end items-center text-xl md:text-2xl px-4 ">
                                        <GetTextContent contentKey="elev_2" />   
                                    </CarouselItem>
                                    <CarouselItem className="w-full min-w-full flex flex-col justify-end items-center text-xl md:text-2xl px-4 ">
                                        <GetTextContent contentKey="elev_3" />   
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
