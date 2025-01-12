'use client';
import { useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import GetTextContent from './GetTextContent';
import { Star } from "lucide-react";


const Study: React.FC = () => {    

    const Music0 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506364/field-background_z3hrk2.jpg";
    const Music1 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507022/IMG_3025-2_vrqnhx.jpg";
    const Music2 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507021/IMG_1739-1_mnwwrh.jpg";
    const Music3 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736508598/choir_bvha8m.jpg";
    const Music4 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736522031/storband_bztt4g.png";
    const Dance0 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506364/dance-background_vv5xbm.jpg";
    const Dance1 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507025/IMG_8432-1_exnjf5.jpg";
    const Dance2 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507028/IMG_8823-2_hhyell.jpg";
    const Dance3 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507027/IMG_9985_3-1_ctadia.jpg";
    const Dance4 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736519501/hopp_cq7cox.png";
    const Drama0 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506365/movie-background_t26tgr.jpg";
    const Drama1 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507030/IMG_8700-2_tk0wt1.jpg";
    const Drama2 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507023/IMG_2491-2_b8upxb.jpg";
    const Drama3 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507020/IMG_0328-1_nfaps6.jpg";

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
        className="flex flex-col justify-center items-center w-screen h-screen mt-0"
        >
            <div className="w-screen h-screen lg:w-[1024px] text-white flex flex-col justify-start items-center box-border ...  no-scrollbar mt-0 overflow-hidden">
                <div className="flex h-[1000px] lg:h[900] flex-col lg:rounded-2xl w-full mt-24 justify-start items-center">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-5xl tracking-widest text-center text-white font-black mb-4 mt-8 lg:m4-0">
                        Programfagene
                    </h1>
                    
                    <div id="subject_tabs" className="w-full">
                        <Tabs defaultValue="music_tab" className="w-full flex-col justify-start items-start">
                            <TabsList className="w-full flex flex-row items-center justify-between h-22 gap-4 md:mb-4 rounded-none lg:rounded-xl lg:mb-8">
                                <TabsTrigger value="music_tab" className="opacity-100 p-2 lg:p-4 animate-flash-border1 text-md md:text-2xl "><span className="hidden md:block">Create&nbsp;</span>Musikk&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="dance_tab" className="opacity-100 p-2 lg:p-4 animate-flash-border2 text-md md:text-2xl "><span className="hidden md:block">Create&nbsp;</span>Dans&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="drama_tab" className="opacity-100 p-2 lg:p-4 animate-flash-border3 text-md md:text-2xl "><span className="hidden md:block">Create&nbsp;</span> Drama&nbsp;<Star size="12"/></TabsTrigger>
                            </TabsList> 
                        <TabsContent value="music_tab" className="lg:rounded-2xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col lg:justify-between items-start mb-4 lg:bg-black/60 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-mina text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-2">
                                        <GetTextContent contentKey="program_musikk" />
                                    </div>                                   
                                </div>
                                <div className="flex w-full justify-start items-center mt-4">
                                <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-center items-center mb-4 overflow-hidden no-scrollbar object-cover object-top">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music0} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music1} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music2} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music3} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>     
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music4} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>                                                                        
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="dance_tab" className="lg:rounded-2xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col lg:justify-between items-start mb-4 lg:bg-black/60 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-mina text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-2">
                                        <GetTextContent contentKey="program_dans" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center mt-4">
                                    <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-start place-items-end mb-4 overflow-hidden no-scrollbar object-cover object-top">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance0} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance1} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance2} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance3} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance4} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>                                                                        
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="drama_tab" className="lg:rounded-2xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col  lg:justify-between items-start mb-4 lg:bg-black/60 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-mina text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-2">
                                        <GetTextContent contentKey="program_drama" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center lg:px-4 mt-4">
                                <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-start place-items-end mb-4 overflow-hidden no-scrollbar object-cover object-top">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama0} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama1} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama2} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama3} alt="" className="h-[24rem] md:h-[32rem] w-full object-contain object-top"></img>
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