'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import GetTextContent from './GetTextContent';
import { Star } from "lucide-react";


const Study: React.FC = () => {    

    const Music0 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736675517/rajesh-kavasseri-490434_yyosga.jpg";
    const Music1 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805178/nymusikk3_zlu67s.png";
    const Music2 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036140/ingvild_bass_pimif6.jpg";
    const Music3 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805181/nymusikk4_v4rv7i.png";
    const Music4 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736522031/storband_bztt4g.png";
    const Music5 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805184/NYmusikk5_izmfkl.png";
    const Music6 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805184/nymusikk9_vnpore.png";
    const Music7 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805184/nymusikk6_wm2jrp.png";
    const Music8 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036157/IMG_3347_xuswfa.jpg";
    const Music9 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036156/IMG_3331_amgcgp.jpg";
    const Music10 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036154/IMG_3137_bkyyej.jpg";
    const Dance0 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506364/dance-background_vv5xbm.jpg";
    const Dance1 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507025/IMG_8432-1_exnjf5.jpg";
    const Dance2 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507028/IMG_8823-2_hhyell.jpg";
    const Dance3 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507027/IMG_9985_3-1_ctadia.jpg";
    const Dance4 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736519501/hopp_cq7cox.png";
    const Dance5 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507024/IMG_7295-1_ltui3m.jpg";
    
    const Dance7 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805156/nydans2_cyfzk9.png";
    const Dance8 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036835/wallin.photo-Imotsetningtil2024-140_ugcqaz.jpg";
    const Dance9 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036834/wallin.photo-Imotsetningtil2024-16_mwkiav.jpg";
    const Dance10 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036834/wallin.photo-Imotsetningtil2024-20_ryfecd.jpg";
    const Dance11 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036835/wallin.photo-Imotsetningtil2024-156_e3pivq.jpg";
    const Drama0 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506365/movie-background_t26tgr.jpg";
    const Drama1 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507030/IMG_8700-2_tk0wt1.jpg";
    const Drama3 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507020/IMG_0328-1_nfaps6.jpg";
    const Drama4 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507021/IMG_1908-1_neuizp.jpg";
    const Drama5 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805174/nydrama6_w4c05e.png";
    const Drama6 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805170/nydrama5_nvflmd.png";
    const Drama7 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805163/Nydrama2_ktxgiz.png";
    const Drama8 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805160/Nydrama3_lxvq8y.png";
    const Drama9 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507021/IMG_0005-1_pbfdyo.jpg";

    return (
        <div 
        className="flex flex-col justify-center items-center w-screen h-full mt-0"
        >
            <div className="w-screen h-full lg:w-[1024px] text-white flex flex-col justify-start items-center box-border ...  no-scrollbar mt-0 overflow-hidden rounded-xl">
                <div className="flex h-[1000px] lg:h[900] flex-col lg:rounded-2xl w-full mt-24 justify-start items-center">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 mt-8 lg:m4-0">
                        Programfagene
                    </h1>
                    
                    <div id="subject_tabs" className="w-full ">
                        <Tabs defaultValue="music_tab" className="w-full flex-col justify-start items-start">
                            <TabsList className="w-full flex flex-row items-center justify-between h-22 gap-4 md:mb-4 rounded-none lg:rounded-xl lg:mb-8">
                                <TabsTrigger value="music_tab" className="opacity-100 p-2 lg:p-4 text-md md:text-2xl"><Star size="12"/>&nbsp;Musikk&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="dance_tab" className="opacity-100 p-2 lg:p-4 text-md md:text-2xl "><Star size="12"/>&nbsp;Dans&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="drama_tab" className="opacity-100 p-2 lg:p-4 text-md md:text-2xl "><Star size="12"/>&nbsp;Drama&nbsp;<Star size="12"/></TabsTrigger>
                            </TabsList> 
                        <TabsContent value="music_tab" className="lg:rounded-2xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col lg:justify-between items-start mb-4 lg:bg-black/60 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-roboto text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-4 lg:px-8">
                                        <GetTextContent contentKey="program_musikk" />
                                    </div>                                   
                                </div>
                                <div className="flex w-full justify-start items-center mt-4 lg:px-8">
                                <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-center items-center mb-4 overflow-hidden no-scrollbar lg:rounded-xl">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music0} alt="" className="h-[24rem] md:h-[20rem] lg:h[42rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music3} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music2} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music1} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>     
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music4} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music5} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music6} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music7} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music8} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music9} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <img src={Music10} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>                                                                                                                                                                                                                                                                                                                                                
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="dance_tab" className="lg:rounded-2xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col lg:justify-between items-start mb-4 lg:bg-black/60 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-roboto text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-4 lg:px-8">
                                        <GetTextContent contentKey="program_dans" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center mt-4 lg:px-8">
                                    <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-start place-items-end mb-4 overflow-hidden no-scrollbar lg:rounded-xl">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance0} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance1} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance2} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance3} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance4} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance5} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance7} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance8} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance9} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance10} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <img src={Dance11} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="drama_tab" className="lg:rounded-2xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col  lg:justify-between items-start mb-4 lg:bg-black/60 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-roboto text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-4 lg:px-8">
                                        <GetTextContent contentKey="program_drama" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center mt-4 lg:px-8">
                                <Carousel autoplay={true} opts={{ loop: true }} className="w-full flex justify-start place-items-end mb-4 overflow-hidden no-scrollbar lg:rounded-xl">
                                        <CarouselContent className="">
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama0} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama1} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama3} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama4} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama5} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama6} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama7} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama8} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <img src={Drama9} alt="" className="h-[24rem] md:h-[28] lg:h[32rem] w-full object-contain object-top lg:object-cover lg:object-center lg:rounded-xl"></img>
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