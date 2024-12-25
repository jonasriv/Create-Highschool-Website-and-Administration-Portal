import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dramaicon from '../../public/images/drama-icon.svg';
import Musicicon from '../../public/images/music-icon.svg';
import Danceicon from '../../public/images/dance-icon.svg';
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
import Create1 from '../../public/images/foto/create1.png';
import Create2 from '../../public/images/foto/create2.png';
import Create3 from '../../public/images/foto/create3.png';
import Create4 from '../../public/images/foto/create4.png';
import { StepForward } from "lucide-react";



const Intro = () => {
    return (
        <div 
            className="bg-gradient-to-r from-slate-950 to-slate-900 w-screen text-redpink flex flex-col justify-center items-center h-screen box-border ..."   
        >
                <Carousel className="w-full flex justify-self-center mb-4 relative overflow-auto rounded-2xl max-h-screen-sm">
                    <CarouselContent className="h-full w-auto ">
                        <CarouselItem className="flex justify-center">
                            <Image src={Create2} alt="" className="w-full object-cover shadow-white shadow-xl"></Image>
                        </CarouselItem>
                        <CarouselItem className="flex justify-center">
                            <Image src={Create3} alt="" className="w-full object-cover"></Image>
                        </CarouselItem>
                        <CarouselItem className="flex justify-center">
                            <Image src={Create1} alt="" className="w-full object-cover"></Image>
                        </CarouselItem>
                        <CarouselItem className="flex justify-center">
                            <Image src={Create4} alt="" className="w-full object-cover"></Image>
                        </CarouselItem>                                    
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <h1 className="font-roboto uppercase text-4xl text-center text-redpink">
                    Videregående skole med musikk, dans og drama – med profesjonelle mentorer
                </h1>

                                <div className="">
                                <p className="font-mina text-2xl text-slate-200">
                                    Velger du musikk, dans og drama må du like å arbeide med vanlige skolefag. I tillegg bør du ha en sterkt interesse innen det fagområdet du velger.
                                    Innenfor musikk bør du beherske minst ett instrument. På Create kan instrumentet ditt gjerne være sang eller musikkproduksjon. Dans er for deg som er interessert i dans og musikaler. Og velger du drama er det naturlig at du er interessert i teater og/eller film. <br/><br/>
                                    Programfagene har kompetansemål med fokus på både samarbeid og utvikling av praktiske ferdigheter. Det blir ofte intense arbeidsperioder fram mot visninger, spilleprøver, konserter og forestillinger.<br/><br/>
                                </p>                                  
                            </div>
                <Tabs defaultValue="common_tab" className="w-full max-w-screen-lg pb-10">
                        <TabsList className="bg-gradient-to-r from-gray-800 to-slate-800 rounded-2xl mt-4 flex flex-row items-center justify-around text-redpink h-22">
                            <TabsTrigger value="common_tab">Elev på Create?</TabsTrigger>
                            <TabsTrigger value="future_tab">Hva kan du bli?</TabsTrigger>
                        </TabsList>

                        <TabsContent value="common_tab">
                        <h1 className="font-mina font-black text-slate-300 text-center uppercase">Elev på Create?</h1>
                        <div className="flex justify-between items-start mb-4">

                            <div className="w-1/2">

                            </div>
                        </div>
                        <p className="w-full border-b-2 border-redpink mb-4"></p>
                        <p className="font-mina text-2xl text-slate-200">
                            Å være elev på Create krever at du har evne til å planlegge ditt eget arbeid og at du er strukturert. Arbeidsmengden er den samme som på andre studieforberedende utdanningsprogram, og når vi jobber med konserter, forestillinger og produksjoner må du regne med å bruke noe tid utover ordinær skoletid. Samtidig vil du oppleve et kreativt, utviklende og inkluderende læringsmiljø.<br/><br/>
                        </p>
                    </TabsContent>

                    <TabsContent value="future_tab">
                        <h1 className="font-mina font-black text-slate-300 text-center uppercase">Hva kan du bli?</h1>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-1/2 pr-4">
                                <p className="font-mina text-2xl text-slate-300">
                                Etter tre år på musikk- dans-, eller drama kan du søke deg videre til alle studier som krever generell studiekompetanse. MDD er derfor ikke bare for deg som ønsker å videreutdanne deg innen musikk, dans eller drama, eller ønsker en profesjonell karriere innen disse bransjene. Mange velger andre studier på høgskole eller universitet. Uansett har elevene som har gått MDD akkurat de samme rettighetene og mulighetene som alle andre elever som velger et studieforberedende utdanningsprogram. Dermed har du full frihet til å velge de aller fleste studier.
                                <br/><br/>
                                Enkelte studier, som f.eks. lege, tannlege, veterinær, ingeniør krever spesiell studiekompetanse. Dette betyr at elever ved MDD må ta opp noen få fag for å være kvalifisert for disse studiene.
                                </p>                                   
                            </div>
                            <div className="w-1/2">
                                <Carousel className="max-w-lg flex justify-self-center place-items-end mb-4 relative overflow-auto rounded-2xl">
                                    <CarouselContent className="h-auto w-auto ">
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Create2} alt="" className="max-w-lg w-full object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Create3} alt="" className="max-w-lg  object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Create1} alt="" className="max-w-lg  object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Create4} alt="" className="max-w-lg  object-cover"></Image>
                                        </CarouselItem>                                    
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
                        <p className="w-full border-b-2 border-redpink mb-4"></p>
                    </TabsContent>    


                </Tabs>
                <h2 className="text-slate-300 text-2xl font-mina">
                    På CREATE kan du velge mellom musikk, dans og drama. Vi introduserer vårt eget fag kulturentreprenørskap i tillegg til at vi jobber med vanlige fag slik at du får generell studiekompetanse. Søknadsfristen er 1. mars!
                </h2>
            
        </div>
    )
}

export default Intro;