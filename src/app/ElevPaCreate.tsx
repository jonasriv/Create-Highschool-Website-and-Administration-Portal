'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import React from 'react';
import GetTextContent from './GetTextContent';



const ElevPaCreate: React.FC = () => {
    const Create1 = 'images/Edit_863_en40np.jpg';
    const Create2 = 'images/IMG_9715-1_h6bj7f.jpg';

    return (
        <div className="flex flex-col justify-center items-center w-screen h-full mt-12 mb-8 rounded-xl">
            <div className="w-screen h-full xl:w-[1024px] text-white flex flex-col justify-center items-center box-border ...  no-scrollbar mt-0 ">
                <div className="flex h-full flex-col lg:rounded-2xl w-full justify-center items-center gap-8">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 mt-8">
                        Elev på Create
                    </h1>
                    <div className="flex flex-col justify-end items-center xl:rounded-xl w-full xl:w-[1024px] h-[480px] md:h-[600px] lg:h-[600px]"
                                    style={{
                                        backgroundColor: 'black',
                                        backgroundImage: `url(${Create1})`, 
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                    >                   

                        <div className="w-full justify-center xl:rounded-xl h-auto bg-black/60 flex items-center px-2">
                            
                            <Carousel autoplay={true} autoplayDelay={9000} opts={{ loop: false }} showButtons={true} buttonsPosition={"top-8"} className="flex flex-row w-full justify-center xl:rounded-b-xl h-auto text-white pt-4 pb-2 md:pb-8 max-w-screen-md overflow-hidden cursor-grab">
                                <CarouselContent className="w-full flex flex-row mt-2 pt-0">
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-lg md:text-2xl text-white pt-4">
                                    
                                        <div className="w-full h-auto pt-6">
                                            <p>
                                            På Create kan du velge fordypning i musikk, dans eller drama. I tillegg til de vanlige programfagene har vi vårt eget fag kulturentreprenørskap, og jobber med vanlige fag, slik at du får generell studiekompetanse. 
                                            </p>
                                        </div>

                                    </CarouselItem>
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-lg md:text-2xl text-white pt-4">
                                        <div className="w-full h-auto pt-6">
                                            <p>
                                            Programfagene har kompetansemål med fokus på både samarbeid og utvikling av praktiske ferdigheter. Det blir ofte intense arbeidsperioder fram mot visninger, konserter og forestillinger. 
                                            </p>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>                            
                            </Carousel>
                        </div>
                    </div>
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 mt-8">
                        Musikk, dans og drama
                    </h1>                    
                    <div className="flex flex-col justify-between items-center xl:rounded-xl w-full xl:w-[1024px] h-[480px] md:h-[600px] lg:h-[600px]"
                                    style={{
                                        backgroundColor: 'black',
                                        backgroundImage: `url(${Create2})`, 
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                    >                   
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest xl:rounded-b-xl text-center text-black font-black mb-4 mt-4">
                        
                    </h1>
                    <div className="w-full justify-center xl:rounded-b-xl h-auto bg-black/60 flex items center px-2">
                            <Carousel autoplay={true} autoplayDelay={10000} opts={{ loop: false }} showButtons={true} buttonsPosition={"top-8"} className="flex flex-row w-full justify-center xl:rounded-b-xl h-auto text-white pt-4 pb-2 md:pb-8 max-w-screen-md overflow-hidden cursor-grab">
                                <CarouselContent className="w-full flex flex-row mt-2 pt-0">
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-lg md:text-2xl pt-4">
                                        <div className="w-full h-auto pt-6">
                                            <p>
                                            Velger du musikk, dans og drama bør du også like å arbeide med vanlige skolefag. I tillegg bør du ha en sterk interesse for det fagområdet du velger.           
                                            </p>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem className="w-full min-w-full flex flex-row justify-center items-center text-lg md:text-2xl pt-4">
                                        <div className="w-full h-auto pt-6">
                                            <p>
                                            Innenfor musikk skal du velge deg et hovedinstrument, som gjerne kan være sang eller musikkproduksjon. Dans er for deg som er interessert i dans og musikaler. Og velger du drama er det naturlig at du er interessert i teater og/eller film.       
                                            </p>
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
