import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dramaicon from '../../public/images/drama-icon.svg';
import Musicicon from '../../public/images/music-icon.svg';
import Danceicon from '../../public/images/dance-icon.svg';
import Dancebackground from '../../public/images/movie-background.jpg';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
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

import { StepForward } from "lucide-react";


const Study = () => {    

    return (
        <div 
        id="front"
        className="flex flex-col justify-center items-center w-full h-screen"
        style={{
            backgroundImage: `url(${Dancebackground.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            //filter: 'brightness(80%)',
        }}
    >
        <div 
            className="bg-black/80 w-screen text-redpink flex flex-col justify-start h-screen box-border ... items-center"
        >
            <h1 className="font-bungee font-black uppercase text-6xl text-center text-pinky  pt-36">
                Musikk, dans og drama
            </h1>
            <div className="w-full max-w-screen-lg relative flex flex-col justify-center items-start h-auto px-2">
                <h2 className="text-slate-300 text-4xl font-mina pb-10 leading-snug">
                    På CREATE kan du velge mellom musikk, dans og drama. I tillegg har vi vårt eget fag - kulturentreprenørskap - og jobber med vanlige fag, slik at du får generell studiekompetanse. Søknadsfristen er 1. mars!
                </h2>
                <div id="subject_tabs" className="w-full flex flex-col justify-center items-center">
                    <Tabs defaultValue="music_tab" className="w-full max-w-screen-lg pb-10">
                        <TabsList className="bg-slate-800 rounded-2xl mt-4 flex flex-row items-center justify-around h-22 opacity-80">
                            <TabsTrigger value="music_tab" className="text-2xl text- uppercase">Create Musikk</TabsTrigger>
                            <TabsTrigger value="dance_tab" className="text-2xl text- uppercase">Create Dans</TabsTrigger>
                            <TabsTrigger value="drama_tab" className="text-2xl text- uppercase">Create Drama</TabsTrigger>
                        </TabsList> 

                    <TabsContent value="music_tab" className="bg-black/50 p-10 rounded-2xl">
                        <h1 className="font-mina font-black text-slate-300 uppercase text-center text-5xl pb-8">Create Musikk</h1>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-1/2 pr-4">
                                <p className="font-mina text-3xl text-slate-300 leading-normal">
                                    På Create Musikk er vi åpne for alle former for musikk: klassisk, jazz og popmusikk. Noen spiller klassisk klarinett, andre bruker Mac'en til å produsere musikk og noen spiller dårlig gitar men skriver fantastiske låter.<br/><br/> Alle slags musikkutøvere hører hjemme på Create. 
                                </p>                                   
                            </div>
                            <div className="w-1/2">
                                <Carousel className="max-w-lg flex justify-self-center place-items-end mb-4 relative overflow-auto rounded-2xl">
                                    <CarouselContent className="h-auto w-auto ">
                                        <CarouselItem className="flex justify-center opacity-100">
                                                <Image src={Music1} alt="" className="h-[32rem] w-auto object-cover opacity-100"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Music2} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Music3} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>                            
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
                        
                    </TabsContent>    

                    <TabsContent value="dance_tab">
                        <h1 className="font-mina font-black text-slate-300 text-center uppercase text-5xl pb-8">Create Dans</h1>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-1/2 pr-4">
                                <p className="font-mina text-3xl text-slate-300 leading-normal">
                                På Create Dans er vi åpne for alle former for dans. Noen liker klassisk ballett, andre hip hop, og noen elsker musikaler. <br/><br/>Alle typer dansere hører hjemme på Create.
                                </p>                                   
                            </div>
                            <div className="w-1/2">
                                <Carousel className="max-w-lg flex justify-self-center place-items-end mb-4 relative overflow-auto rounded-2xl">
                                    <CarouselContent className="h-auto w-auto ">
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Dance1} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Dance2} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Dance3} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>                            
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
                        
                    </TabsContent>  

                    <TabsContent value="drama_tab">
                        <h1 className="font-mina font-black text-slate-300 uppercase text-center text-5xl pb-8">Create Drama</h1>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-1/2 pr-4">
                                <p className="font-mina text-3xl text-slate-300 leading-normal">
                                    På Create Drama arbeider vi både med scenisk teater og film. I tillegg samarbeider vi med elevene på musikk og dans innen musikal. <br/><br/> Både innen teater og film arbeider vi med hele spekteret av en produksjon. Tekst og manus, scenografi, regi og lyddesign, og ikke minst rollen som skuespiller — enten det er på scenen eller foran kamera. 
                                </p>                                   
                            </div>
                            <div className="w-1/2">
                                <Carousel className="max-w-lg max-h-[32rem] flex justify-self-center place-items-end mb-4 relative overflow-auto rounded-2xl">
                                    <CarouselContent className="h-auto w-auto ">
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Drama1} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Drama2} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Drama3} alt="" className="h-[32rem] w-auto object-cover"></Image>
                                        </CarouselItem>                            
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
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