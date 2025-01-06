'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetTextContent from "./GetTextContent";
import Link from "next/link";
const Admission = () => {
    return (
        <div 
        className="flex flex-col justify-center items-center w-screen h-full overflow-y-clip"
        >
            <div className="w-full md:w-11/12 text-white flex flex-col justify-start items-center box-border ... h-full">
                <div className="flex flex-col md:bg-black/50 md:rounded-xl w-full overflow-hidden md:mt-8 min-h-[80%] md:mx-2">
                    <h1 className="font-bahiana uppercase text-4xl md:text-5xl lg:text-6xl tracking-widest text-center text-white font-black">
                        Opptak og info
                    </h1>
                    <div id="subject_tabs" className="w-full flex flex-row pb-12 md:pb-14 lg:pb-16 overflow-y-hidden">
                        <Tabs defaultValue="admission_tab" className="w-full">
                            <TabsList className="w-full rounded-none mt-4 md:mt-0 flex flex-row items-center justify-around h-22 gap-0 md:gap-8 bg-fuchsia-950 md:mb-12">
                                <TabsTrigger value="admission_tab" className="opacity-100 p-2 md:p-4 animate-flash-border2 text-md md:text-2xl uppercase">Opptak</TabsTrigger>                                
                                <TabsTrigger value="future_tab" className="opacity-100 p-2 md:p-4 animate-flash-border1 text-md md:text-2xl uppercase">Hva blir jeg?</TabsTrigger>
                                <TabsTrigger value="about_tab" className="opacity-100 p-2 md:p-4 animate-flash-border2 text-md md:text-2xl uppercase">Om Create</TabsTrigger>
                            </TabsList> 

                            <TabsContent value="admission_tab" className="md:rounded-2xl w-full h-auto overflow-y-scroll">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                    <div className="w-full pr-4">
                                        <div className="font-mina text-lg md:text-2xl lg:text-3xl text-slate-300 leading-normal px-4 pb-12">
                                            <GetTextContent contentKey="opptak" />
                                            <div className="w-full flex items-center justify-center pt-8">
                                                <Link href="/soknad">
                                                    <button className=" bg-pinky w-52 md:w-72 h-14 flex justify-center items-center text-2xl md:text-4xl p-6 md:p-10 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">
                                                        Søk nå
                                                    </button>
                                                </Link>
                                            </div>                                                 
                                        </div>                                   
                                    </div>
                                </div>
                            </TabsContent>    

                            <TabsContent value="future_tab" className="md:rounded-2xl w-full h-full overflow-y-scroll pb-12">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                    <div className="w-full pr-4">
                                        <div className="font-mina text-lg md:text-2xl lg:text-3xl text-slate-300 leading-normal px-4 pb-12">
                                            <GetTextContent contentKey="hva_blir_jeg" />
                                            <div className="w-full flex items-center justify-center pt-8">
                                                <Link href="/soknad">
                                                    <button className=" bg-pinky w-52 md:w-72 h-14 flex justify-center items-center text-2xl md:text-4xl p-6 md:p-10 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">
                                                        Søk nå
                                                    </button>
                                                </Link>
                                            </div>                                            
                                        </div>                                   
                                    </div>
                                </div>
                            </TabsContent>    

                            <TabsContent value="about_tab" className="md:rounded-2xl w-full h-full overflow-y-scroll pb-12">
                                <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 ">
                                    <div className="w-full pr-4">
                                        <div className="font-mina text-lg md:text-2xl lg:text-3xl text-slate-300 leading-normal px-4 pb-12">
                                            <GetTextContent contentKey="om_create" />
                                            <div className="w-full flex items-center justify-center pt-8">
                                                <Link href="/soknad">
                                                    <button className=" bg-pinky w-52 md:w-72 h-14 flex justify-center items-center text-2xl md:text-4xl p-6 md:p-10 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">
                                                        Søk nå
                                                    </button>
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