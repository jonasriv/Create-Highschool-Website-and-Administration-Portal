'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel";
import Image from "next/image";
import GetTextContent from './GetTextContent';
import { Star } from "lucide-react";


const Study: React.FC = () => {    

    const Music0 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737621589/studioMag1_gp0nw6.jpg";
    const Music1 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805178/nymusikk3_zlu67s.png";
    const Music2 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737036140/ingvild_bass_pimif6.jpg";
    const Music3 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805181/nymusikk4_v4rv7i.png";
    const Music4 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736522031/storband_bztt4g.png";
    const Music5 = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1737621589/StudioMag2_ps3039.jpg";
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
        className="flex flex-col justify-center items-center w-screen h-auto mt-0 pb-8"
        >
            <div className="w-screen h-auto lg:w-[1024px] text-white flex flex-col justify-start items-center box-border ...  no-scrollbar mt-0 overflow-hidden">
                <div className="lg:bg-black/50 flex h-auto flex-col lg:rounded-xl w-full mt-16 md:mt-24 justify-start items-center md:gap-4">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 md:mb-8 md:pt-4">
                        Programfagene
                    </h1>
                    
                    <div id="subject_tabs" className="w-full">
                        <Tabs defaultValue="music_tab" className="w-full flex-col justify-center items-center ">
                            <TabsList className="w-full md:bg-black/60 flex flex-row items-center justify-around h-22 md:mb-4 rounded-none gap-2 md:gap-4 lg:gap-8">
                                <TabsTrigger value="music_tab" className="opacity-100 p-2 lg:p-4 text-md md:text-xl lg:text-2xl"><Star size="12"/>&nbsp;Musikk&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="dance_tab" className="opacity-100 p-2 lg:p-4 text-md md:text-xl lg:text-2xl "><Star size="12"/>&nbsp;Dans&nbsp;<Star size="12"/></TabsTrigger>
                                <TabsTrigger value="drama_tab" className="opacity-100 p-2 lg:p-4 text-md md:text-xl lg:text-2xl "><Star size="12"/>&nbsp;Drama&nbsp;<Star size="12"/></TabsTrigger>
                            </TabsList> 
                        <TabsContent value="music_tab" className="lg:rounded-xl w-full max-h-[800px] overflow-hidden">
                            <div className="flex flex-col lg:justify-between items-start mb-4 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-roboto text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-4 md:px-20 lg:px-24">
                                        <GetTextContent contentKey="program_musikk" />
                                    </div>                                   
                                </div>
                                <div className="flex w-full justify-start items-center mt-4 lg:px-8 overflow-hidden">
                                <Carousel autoplay={true} showButtons={true} opts={{ loop: true }} className="w-full flex justify-center items-center mb-4 no-scrollbar overflow-hidden">
                                        <CarouselContent className="max-h-72 md:max-h-96">
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music0} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top "></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center ">
                                                <Image src={Music3} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music2} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music1} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>     
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music4} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music5} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music6} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music7} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music8} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music9} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Music10} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full md:w-auto object-contain object-top"></Image>
                                            </CarouselItem>                                                                                                                                                                                                                                                                                                                                                
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="dance_tab" className="lg:rounded-xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col lg:justify-between items-start mb-4  lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-roboto text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-4  md:px-20 lg:px-24">
                                        <GetTextContent contentKey="program_dans" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center mt-4 lg:px-8">
                                    <Carousel autoplay={true} showButtons={true} opts={{ loop: true }} className="w-full flex justify-center items-center mb-4 no-scrollbar pb-4 overflow-hidden">
                                        <CarouselContent className="max-h-96">
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance0} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance1} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance2} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance3} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>      
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance4} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance5} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance7} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance8} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance9} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance10} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>    
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Dance11} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>                                                                                                                                                                                                                                                                                                                                                                                                                                        
                                        </CarouselContent>
                                    </Carousel>
                                </div>
                            </div>
                        </TabsContent>    

                        <TabsContent value="drama_tab" className="lg:rounded-xl w-full h-[800px] overflow-hidden">
                            <div className="flex flex-col lg:justify-between items-start mb-4 lg:p-4 lg:rounded-xl">
                                <div className="w-full">
                                    <div className="font-roboto text-lg md:text-xl lg:text-2xl text-slate-300 leading-normal px-4 md:px-20 lg:px-24">
                                        <GetTextContent contentKey="program_drama" />
                                    </div>                                   
                                </div>
                                <div className="w-full justify-center items-center mt-4 lg:px-8 mb-0 pb-0">
                                <Carousel autoplay={true} showButtons={true} opts={{ loop: true }} className="w-full flex justify-center items-center mb-4 no-scrollbar pb-4 overflow-hidden">
                                        <CarouselContent className="max-h-96">
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama0} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama1} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>                                            
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama3} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama4} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama5} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama6} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>  
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama7} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama8} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
                                            </CarouselItem>   
                                            <CarouselItem className="flex justify-center">
                                                <Image src={Drama9} width={500} height={500} alt="" className="h-[24rem] md:h-[28rem] lg:h-[32rem] w-full object-contain object-top"></Image>
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