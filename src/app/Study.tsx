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


const Study = () => {
    return (
        <div className="bg-gradient-to-r from-slate-950 to-slate-900 w-full text-pinky flex flex-col justify-center items-center h-auto box-border ...">
            <div className="w-full max-w-screen-lg relative flex flex-col justify-center items-center h-auto px-2">
                <h1 className="font-mina text-4xl text-center">
                    Videregående skole med musikk, dans og drama – med profesjonelle mentorer
                </h1>
                <h2 className="text-blue-500 text-2xl font-mina">
                    På CREATE kan du velge mellom musikk, dans og drama. Vi introduserer vårt eget fag kulturentreprenørskap i tillegg til at vi jobber med vanlige fag slik at du får generell studiekompetanse. Søknadsfristen er 1. mars!
                </h2>
                <div id="subject_tabs" className="w-full flex flex-col justify-center items-center">
                    <Tabs defaultValue="common_tab" className="w-full max-w-screen-lg pb-10">
                        <TabsList className="bg-gradient-to-r from-gray-800 to-slate-800 rounded-2xl mt-4 flex flex-row items-center justify-around text-redpink h-22">
                            <TabsTrigger value="common_tab">Elev på Create?</TabsTrigger>
                            <TabsTrigger value="future_tab">Hva kan du bli?</TabsTrigger>
                            <TabsTrigger value="music_tab">Musikk</TabsTrigger>
                            <TabsTrigger value="dance_tab">Dans</TabsTrigger>
                            <TabsTrigger value="drama_tab">Drama</TabsTrigger>
                        </TabsList>
                        <TabsContent value="common_tab">
                        <h1 className="font-mina font-black text-pinky text-center">Elev på Create?</h1>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-1/2 pr-4">
                                <p className="font-mina text-2xl text-blue-500">
                                    Velger du musikk, dans og drama må du like å arbeide med vanlige skolefag. I tillegg bør du ha en sterkt interesse innen det fagområdet du velger.
                                    Innenfor musikk bør du beherske minst ett instrument. På Create kan instrumentet ditt gjerne være sang eller musikkproduksjon. Dans er for deg som er interessert i dans og musikaler. Og velger du drama er det naturlig at du er interessert i teater og/eller film. <br/><br/>
                                    Programfagene har kompetansemål med fokus på både samarbeid og utvikling av praktiske ferdigheter. Det blir ofte intense arbeidsperioder fram mot visninger, spilleprøver, konserter og forestillinger.<br/><br/>
                                    
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
                        <p className="w-full border-b-2 border-pinky mb-4"></p>
                        <p className="font-mina text-2xl text-blue-500">
                            Å være elev på Create krever at du har evne til å planlegge ditt eget arbeid og at du er strukturert. Arbeidsmengden er den samme som på andre studieforberedende utdanningsprogram, og når vi jobber med konserter, forestillinger og produksjoner må du regne med å bruke noe tid utover ordinær skoletid. Samtidig vil du oppleve et kreativt, utviklende og inkluderende læringsmiljø.<br/><br/>
                        </p>
                    </TabsContent>
                    <TabsContent value="future_tab">
                        <h1 className="font-mina font-black text-pinky text-center">Hva kan du bli?</h1>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-1/2 pr-4">
                                <p className="font-mina text-2xl text-blue-500">
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
                        <p className="w-full border-b-2 border-pinky mb-4"></p>
                    </TabsContent>     
                    <TabsContent value="music_tab">
                        <h1 className="font-mina font-black text-pinky text-center">Create Musikk</h1>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-1/2 pr-4">
                                <p className="font-mina text-2xl text-blue-500">
                                    På Create Musikk er vi åpne for alle former for musikk: klassisk, jazz og popmusikk. Noen spiller klassisk klarinett, andre bruker Mac'en til å produsere musikk og noen spiller dårlig gitar men skriver fantastiske låter. Alle slags musikkutøvere hører hjemme på Create.
                                </p>                                   
                            </div>
                            <div className="w-1/2">
                                <Carousel className="max-w-lg flex justify-self-center place-items-end mb-4 relative overflow-auto rounded-2xl">
                                    <CarouselContent className="h-auto w-auto ">
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Music1} alt="" className="max-w-lg w-full object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Music2} alt="" className="max-w-lg  object-cover"></Image>
                                        </CarouselItem>
                                        <CarouselItem className="flex justify-center">
                                            <Image src={Music3} alt="" className="max-w-lg  object-cover"></Image>
                                        </CarouselItem>                            
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
                        <p className="w-full border-b-2 border-pinky mb-4"></p>
                    </TabsContent>                                     
                    <TabsContent value="dance_tab">
                            <h1 className="font-mina font-black text-pinky text-center">CREATE Dans</h1>
                            <p className="font-mina text-2xl text-blue-500">På Create Dans er vi åpne for alle former for dans. Noen liker klassisk ballett, andre hip hop, og noen elsker musikaler. Alle typer dansere hører hjemme på Create.</p>
                    </TabsContent>
                    <TabsContent value="drama_tab">
                            <h1 className="font-mina font-black text-pinky text-center">CREATE Drama</h1>
                            <p className="font-mina text-2xl text-blue-500">På Create Drama arbeider vi både med scenisk teater og film. I tillegg samarbeider vi med elevene på musikk og dans innen musikal. Både innen teater og film arbeider vi med hele spekteret av en produksjon. Tekst og manus, scenografi, regi og lyddesign, og ikke minst rollen som skuespiller — enten det er på scenen eller foran kamera.</p>
                    </TabsContent>
                </Tabs>
                </div>
            </div>    
        </div>
    )
}

export default Study;