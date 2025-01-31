'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetTextContent from "./GetTextContent";
import Link from "next/link";
const Admission = () => {
    const cityLife = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736805160/create_dolajazz_qzbnpl.png";
    return (
        <div 
        className="flex flex-col justify-center items-center w-screen h-full overflow-y-scroll"
        >
            <div className="w-full max-w-screen-xl text-white flex flex-col justify-start items-center box-border ... h-full">
                <div className="flex flex-col xl:bg-black/50 xl:rounded-xl w-full overflow-hidden md:mt-8 min-h-[80%] md:mx-2">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black md:py-8">
                        Opptak og info
                    </h1>
                    <div id="subject_tabs" className="w-full flex flex-row pb-6 md:pb-14 lg:pb-16">
                        <Tabs defaultValue="admission_tab" className="w-full">
                            <div className="w-full bg-black/60 flex justify-center items-center">
                                <TabsList className="w-full max-w-[1150px] rounded-none mt-4 md:mt-0 flex flex-row items-center justify-around h-22 gap-0 md:gap-8 md:mb-12">
                                    <TabsTrigger value="admission_tab" className="font-mina opacity-100 p-2 md:p-4 text-md md:text-2xl">Opptak</TabsTrigger>                                
                                    <TabsTrigger value="future_tab" className="font-mina opacity-100 p-2 md:p-4 text-md md:text-2xl">Hva blir jeg?</TabsTrigger>
                                    <TabsTrigger value="about_tab" className="font-mina opacity-100 p-2 md:p-4 text-md md:text-2xl">Om Create</TabsTrigger>
                                </TabsList> 
                            </div>

                            <TabsContent value="admission_tab" className="md:rounded-2xl w-full h-auto overflow-y-scroll">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:pt-4">
                                    <div className="w-full pr-4 font-roboto-mono flex justify-center">
                                        <div className="font-roboto text-lg md:text-2xl text-slate-300 leading-normal px-6 lg:px-16 pb-12 flex flex-col justify-center items-center max-w-[1024px]">
                                            <GetTextContent contentKey="opptak" className="font-roboto-mono"/>
                                            <div className="w-full flex items-center justify-center pt-8 flex-col">
                                                <img src={cityLife} alt="" className="w-full flex text-center h-56 md:h-80 object-cover mb-8 rounded-xl"></img>
                                                <Link href="/soknad">
                                                <button className="bg-pinky w-36 h-14 flex justify-center items-center text-xl px-4 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
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
                                            <GetTextContent contentKey="hva_blir_jeg" />
                                            <div className="w-full flex items-center justify-center pt-8">
                                                <Link href="/soknad">
                                                <button className="bg-pinky w-36 h-14 flex justify-center items-center text-xl px-4 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
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
                                            <GetTextContent contentKey="om_create" />
                                            <div className="w-full flex items-center justify-center pt-8">
                                                <Link href="/soknad">
                                                <button className="bg-pinky w-36 h-14 flex justify-center items-center text-xl px-4 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
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