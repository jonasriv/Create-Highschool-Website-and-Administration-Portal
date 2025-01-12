'use client'
import React from 'react';
import { ChevronsDown } from "lucide-react";
import GetTextContent from './GetTextContent';

const Intro: React.FC = () => {
    const Create1 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507028/IMG_9715-1_h6bj7f.jpg';
    const Create2 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507020/IMG_0104_3_oxqa1u.jpg';
    const Create3 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507024/IMG_8533-1_cuqh4v.jpg';
    const Create4 = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1736507023/IMG_7018-1_uqzmsn.jpg';

    return (
        <div className="flex flex-col justify-start items-center w-screen pt-20 border-b-2 border-t-2 border-pinky">
            <div className="w-full h-auto text-white flex flex-col justify-start items-center box-border ...  no-scrollbar relative overflow-hidden">
                    <h1 className="w-auto font-mina text-2xl lg:text-3xl lg:mt-4 tracking-widest text-center text-white font-black p-2 z-50">
                        Elev på Create
                    </h1>

                    <div className="lg:max-w-screen-lg flex flex-col justify-around items-center w-screen snap-y snap-proximity scroll-smooth no-scrollbar overflow-y-scroll gap-6">
                    <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center rounded-xl">
                            <div className="flex flex-col w-screen lg:w-full justify-start items-center h-full md:rounded-t-xl px-2 rounded-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] lg:rounded-xl flex flex-col justify-end items-center h-full rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create3})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-3xl bg-black/70 py-4 w-full flex justify-center items-end rounded-b-xl">
                                        <div className="mx-2 md:m-4 px-2">
                                            <GetTextContent contentKey="elev_1" />   
                                        </div>                                       
                                    </div>   
                                </div>
                            </div>
                            <div className="flex justify-center items-center ">
                            <div className="opacity-40 pt-4 md:hidden ">
                                <ChevronsDown size="44"/>
                            </div>
                            <div className="hidden md:block opacity-40 pt-4 ">
                                <ChevronsDown size="56"/>
                            </div>
                        </div>                                
                        </div>

                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center rounded-xl">
                            <div className="flex flex-col w-screen lg:w-full justify-start items-center h-full md:rounded-t-xl px-2 rounded-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] lg:rounded-xl flex flex-col justify-end items-center h-full rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create1})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-3xl bg-black/70 py-4 w-full flex justify-center items-end rounded-b-xl">
                                        <div className="mx-2 md:m-4 px-2">
                                            <GetTextContent contentKey="elev_2" />   
                                        </div>
                                       
                                    </div>   
                                </div>
                            </div>
                            <div className="flex justify-center items-center ">
                            <div className="opacity-40 pt-4 md:hidden ">
                                <ChevronsDown size="44"/>
                            </div>
                            <div className="hidden md:block opacity-40 pt-4 ">
                                <ChevronsDown size="56"/>
                            </div>
                        </div>                             
                        </div>
 
                  
                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center rounded-xl">
                            <div className="flex flex-col w-screen lg:w-full justify-start items-center h-full md:rounded-t-xl px-2 rounded-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] lg:rounded-xl flex flex-col justify-end items-center h-full rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create2})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-3xl bg-black/70 py-4 w-full flex justify-center items-end rounded-b-xl">
                                        <div className="mx-2 md:m-4 px-2">
                                            <GetTextContent contentKey="elev_3" />   
                                        </div>                                      
                                    </div>   
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center ">
                            <div className="opacity-40 pt-4 md:hidden">
                                <ChevronsDown size="44"/>
                            </div>
                            <div className="hidden md:block opacity-40 pt-4">
                                <ChevronsDown size="56"/>
                            </div>
                        </div>   
                        <div className="snap-start font-mina text-lg text-white min-w-full flex flex-col no-scrollbar justify-center items-center rounded-xl">
                            <div className="flex flex-col w-screen lg:w-full justify-start items-center h-full md:rounded-t-xl px-2 rounded-xl">
                                
                                <div 
                                    className="w-full min-h-[450px] md:min-h-[800px] lg:rounded-xl flex flex-col justify-end items-center h-full rounded-xl"
                                    style={{
                                        backgroundImage: `url(${Create4})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'top',
                                        backgroundRepeat: 'no-repeat',
                                        //filter: 'brightness(80%)',
                                    }}  
                                >
                                    <div className="text-md md:text-2xl lg:text-3xl bg-black/70 py-4 w-full flex justify-center items-end rounded-b-xl">
                                        <div className="mx-2 md:m-4 px-2">
                                            <GetTextContent contentKey="elev_4" />   
                                        </div>                                     
                                    </div>   
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center ">
                            <div className="opacity-40 py-4 md:hidden">
                                <ChevronsDown size="44"/>
                            </div>
                            <div className="hidden md:block opacity-40 py-4">
                                <ChevronsDown size="56"/>
                            </div>
                        </div>                            
                    </div>

            </div>
        </div>
    )
}

export default Intro;