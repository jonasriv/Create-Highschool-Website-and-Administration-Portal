'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Admission = () => {
    return (
        <div 
        id="front"
        className="flex flex-col justify-center items-center w-screen h-full overflow-y-clip"

    >
            <div className="w-full text-white flex flex-col justify-start items-center box-border ... h-full">
                <div className="flex flex-col md:bg-black/50 md:rounded-xl max-w-screen-lg overflow-hidden md:mt-8 min-h-[80%] md:mx-2">
                    <h1 className="font-bahiana uppercase text-4xl md:text-5xl lg:text-6xl tracking-widest text-center text-white font-black">
                        Opptak og info
                    </h1>
                    <div id="subject_tabs" className="w-full flex flex-row pb-12 md:pb-14 lg:pb-16 overflow-y-hidden">
                        <Tabs defaultValue="admission_tab">
                            <TabsList className="w-full rounded-none mt-4 md:mt-0 flex flex-row items-center justify-around h-22 gap-0 md:gap-8 bg-fuchsia-950 md:mb-12">
                                <TabsTrigger value="admission_tab" className="opacity-100 p-2 md:p-4 animate-flash-border2 text-md md:text-2xl uppercase">Opptak</TabsTrigger>                                
                                <TabsTrigger value="future_tab" className="opacity-100 p-2 md:p-4 animate-flash-border1 text-md md:text-2xl uppercase">Hva blir jeg?</TabsTrigger>
                                <TabsTrigger value="about_tab" className="opacity-100 p-2 md:p-4 animate-flash-border2 text-md md:text-2xl uppercase">Om Create</TabsTrigger>
                            </TabsList> 

                            <TabsContent value="admission_tab" className="md:rounded-2xl w-full h-auto overflow-y-scroll">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                    <div className="w-full pr-4">
                                        <p className="font-mina text-lg md:text-2xl lg:text-3xl text-slate-300 leading-normal px-4 pb-12">
                                        Create tar imot søkere fra hele landet. I 2024 tar vi hovedsaklig inn elever til vg1. Det er også mulig å søke på vg2 og vg3, der vi vil ta inn elever etter ledig kapasitet. Det går fint å søke på flere forskjellige skoler. Du bestemmer selv hvilken skole du vil gå på etter at du har fått tilbud om skoleplass. Opptaket starter 15. mars. Det koster 22.500 kr per skoleår å gå på CREATE.
                                        </p>                                   
                                    </div>
                                </div>
                            </TabsContent>    

                            <TabsContent value="future_tab" className="md:rounded-2xl w-full h-full overflow-y-scroll pb-12">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                    <div className="w-full pr-4">
                                        <p className="font-mina text-lg md:text-2xl lg:text-3xl text-slate-300 leading-normal px-4 pb-12">
                                        Etter tre år på musikk- dans-, eller drama kan du søke deg videre til alle studier som krever generell studiekompetanse. MDD er derfor ikke bare for deg som ønsker å videreutdanne deg innen musikk, dans eller drama, eller ønsker en profesjonell karriere innen disse bransjene. Mange velger andre studier på høgskole eller universitet. <br/><br/>Uansett har elevene som har gått MDD akkurat de samme rettighetene og mulighetene som alle andre elever som velger et studieforberedende utdanningsprogram. Dermed har du full frihet til å velge de aller fleste studier. Enkelte studier, som f.eks. lege, tannlege, veterinær, ingeniør krever spesiell studiekompetanse. Dette betyr at elever ved MDD må ta opp noen få fag for å være kvalifisert for disse studiene.
                                        </p>                                   
                                    </div>
                                </div>
                            </TabsContent>    

                            <TabsContent value="about_tab" className="md:rounded-2xl w-full h-full overflow-y-scroll pb-12">
                                <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 ">
                                    <div className="w-full pr-4">
                                        <p className="font-mina text-lg md:text-2xl lg:text-3xl text-slate-300 leading-normal px-4 pb-12">
                                            Vi skapte Create fordi vi tror på kombinasjonen av kreativitet og læring. Vi ønsker at flere ungdommer i større grad skal få mulighet til å bruke sine skapende evner på skolen — både for å utvikle sine kreative talenter, og for å bli et helere menneske. Vi tror at kreativitet og trivsel har en positiv innvirkning på arbeidet med andre fag, dette underbygges av stadig mer forskning.
                                            <br /><br />
                                            Create tilbyr musikk, dans og drama. Vi dykker inn i historien om musikken, dansen og teaterets utvikling. I tillegg ønsker vi å fordype oss i dagens ungdomskultur. Derfor åpner vi for arbeid med låtskriving og musikkproduksjon, musikaler og filmproduksjon. Create vil samarbeide om kompetanseutveksling med LIMPI og Den norske filmskolen.
                                            <br /><br />
                                            På Create er vi opptatt av å se på hvordan man kan livnære seg innenfor musikk, dans, teater og film. Vi introduserer vårt eget profilfag Kulturentrprenørskap og den kreative næringen. Her ser vi på de hvilke muligheter som finnes for skapende unge mennesker i dagens samfunn. Hvordan kan jeg bruke mine kreative evner til å skape verdier i samfunnet, og hva kjennetegner de som lykkes i den bransjen jeg kunne tenke meg å jobbe i? Også om du skulle velge å jobbe med noe helt annet i fremtiden, så er vår visjon å gi deg et best mulig lærings- og utviklingsmiljø på Create, og evne til å tenke utenfor boksen, se etter muligheter, og bli en positiv lagspiller med kreativ kraft. Velkommen til CREATE!
                                            <br /><br />
                                            CREATE - Lillehammer kreative videregående skole er godkjent etter Friskoleloven.
                                        </p>                                   
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