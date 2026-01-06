'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
const Admission = () => {
    const cityLife = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805160/create_dolajazz_qzbnpl.png";
    return (
        <div 
        className="flex flex-col justify-center items-center w-screen h-full overflow-y-scroll"
        >
            <div className="w-full max-w-screen-lg text-white flex flex-col justify-start items-center box-border ... h-full">
                <div className="flex flex-col xl:bg-black/50 xl:rounded-xl w-full overflow-hidden md:mt-8 min-h-[80%] md:mx-2">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black pb-4 md:py-8">
                        Opptak og info
                    </h1>
                    <div id="subject_tabs" className="w-full flex flex-row pb-6 md:pb-14 lg:pb-16">
                        <Tabs defaultValue="admission_tab" className="w-full">
                            <div className="w-full bg-black/40 flex justify-center h-22 items-center md:mb-12">
                                <TabsList className="w-full max-w-[1150px] rounded-none flex flex-row items-center justify-around h-full gap-0 md:gap-8 ">
                                    <TabsTrigger value="admission_tab" className="font-mina opacity-100 p-2 md:p-4 text-md md:text-2xl ">Opptak</TabsTrigger>                                
                                    <TabsTrigger value="future_tab" className="font-mina opacity-100 p-2 md:p-4 text-md md:text-2xl">Etter create</TabsTrigger>
                                    <TabsTrigger value="about_tab" className="font-mina opacity-100 p-2 md:p-4 text-md md:text-2xl">Om Create</TabsTrigger>
                                </TabsList> 
                            </div>

                            <TabsContent value="admission_tab" className="md:rounded-2xl w-full h-auto overflow-y-scroll">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                    <div className="w-full pr-4 font-roboto-mono flex justify-center">
                                        <div className="font-roboto text-lg md:text-2xl text-slate-300 leading-normal px-6 lg:px-16 pb-12 flex flex-col justify-center items-center max-w-[1024px]">
                                            <p>
                                                Create tar imot søkere fra hele landet. I 2026 tar vi hovedsaklig inn elever til VG1. Det er også mulig å søke på VG2 og VG3, der vi vil ta inn elever etter ledig kapasitet. Det går fint å søke på flere forskjellige skoler. Du bestemmer selv hvilken skole du vil gå på etter at du har fått tilbud om skoleplass. Opptaket starter 15. mars. Det koster 28.000 kr per skoleår å gå på Create.
                                            </p>
                                            <div className="w-full flex items-center justify-center pt-8 flex-col">
                                                <img src={cityLife} alt="" className="w-full flex text-center h-56 md:h-80 object-cover mb-8 rounded-xl"></img>
                                                <Link href="/soknad">
                                                <button className="bg-white/30 w-36 h-14 flex justify-center items-center text-xl px-4 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                                                </Link>
                                            </div>    
                                                                                    
                                        </div>                                   
                                    </div>
                                </div>
                            </TabsContent>    

                            <TabsContent value="future_tab" className="md:rounded-2xl w-full h-auto overflow-y-scroll pb-12">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                    <div className="w-full pr-4 flex justify-center">
                                        <div className="font-roboto text-lg md:text-2xl text-slate-300 leading-normal px-6 lg:px-16 pb-12 max-w-[1024px]">
                                            <p>
                                            Etter tre år på musikk- dans-, eller drama (MDD) kan du søke deg videre til alle studier som krever generell studiekompetanse. MDD er derfor ikke bare for deg som ønsker å videreutdanne deg innen musikk, dans eller drama, eller ønsker en profesjonell karriere innen disse bransjene. Mange velger andre studier på høgskole eller universitet. <br/><br/>Uansett har elevene som har gått MDD akkurat de samme rettighetene og mulighetene som alle andre elever som velger et studieforberedende utdanningsprogram. Dermed har du full frihet til å velge de aller fleste studier. Enkelte studier, som f.eks. lege, tannlege, veterinær, ingeniør krever spesiell studiekompetanse. Dette betyr at elever ved MDD må ta opp noen få fag for å være kvalifisert for disse studiene.
                                            </p>
                                            <div className="w-full flex items-center justify-center pt-8">
                                                <Link href="/soknad">
                                                <button className="bg-white/30 w-36 h-14 flex justify-center items-center text-xl px-4 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                                                </Link>
                                            </div>                                            
                                        </div>                                   
                                    </div>
                                </div>
                            </TabsContent>    

                            <TabsContent value="about_tab" className="md:rounded-2xl w-full h-auto overflow-y-scroll">
                                <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 ">
                                    <div className="w-full pr-4 flex justify-center">
                                        <div className="font-roboto text-lg md:text-2xl text-slate-300 leading-normal px-6 lg:px-16 max-w-[1024px]">
                                            <p>
                                            Vi skapte Create fordi vi tror på kombinasjonen av kreativitet og læring. Vi ønsker at flere ungdommer i større grad skal få mulighet til å bruke sine skapende evner på skolen — både for å utvikle sine kreative talenter, og for å bli et helere menneske. Vi tror at kreativitet og trivsel har en positiv innvirkning på arbeidet med andre fag, dette underbygges av stadig mer forskning.
                                            <br /><br />
                                            Create tilbyr musikk, dans og drama. Vi dykker inn i historien om musikken, dansen og teaterets utvikling. I tillegg ønsker vi å fordype oss i dagens ungdomskultur. Derfor åpner vi for arbeid med låtskriving og musikkproduksjon, musikaler og filmproduksjon. Create vil samarbeide om kompetanseutveksling med LIMPI og Den norske filmskolen.
                                            <br /><br />
                                            På Create er vi opptatt av å se på hvordan man kan livnære seg innenfor musikk, dans, teater og film. Vi introduserer vårt eget profilfag Kulturentrprenørskap og den kreative næringen. Her ser vi på de hvilke muligheter som finnes for skapende unge mennesker i dagens samfunn. Hvordan kan jeg bruke mine kreative evner til å skape verdier i samfunnet, og hva kjennetegner de som lykkes i den bransjen jeg kunne tenke meg å jobbe i? Også om du skulle velge å jobbe med noe helt annet i fremtiden, så er vår visjon å gi deg et best mulig lærings- og utviklingsmiljø på Create, og evne til å tenke utenfor boksen, se etter muligheter, og bli en positiv lagspiller med kreativ kraft. Velkommen til Create!
                                            <br /><br />
                                            Create - Lillehammer kreative videregående skole er godkjent etter Friskoleloven.
                                            </p>
                                            <div className="w-full flex items-center justify-center pt-8">
                                                <Link href="/soknad">
                                                <button className="bg-white/30 w-36 h-14 flex justify-center items-center text-xl px-4 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                                                </Link>
                                            </div>
                                        </div>                                   
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


export default Admission;