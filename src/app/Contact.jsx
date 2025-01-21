'use client'
import React from "react";
import Image from "next/image"
import { Instagram, Facebook, Mail, Phone} from 'lucide-react'
import tiktoklogo from '../../public/images/tiktok-white-icon.svg';

const Contact = () => {
    
    return (
        <div className="flex w-screen h-auto flex-col justify-end items-center lg:mb-16 tracking-widest">
            <div className="flex flex-col justify-between items-center md:items-center w-full max-w-screen-lg h-full gap-12">
                <h1 className="text-3xl font-mina font-black text-center flex">Kontakt</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full w-full px-4 items-start">
                    <div className="bg-black/40 mx-4 md:mx-0 flex flex-col rounded-xl p-2 font-mina gap-4 md:h-72">
                        <h1 className="text-pinky text-center">
                            Kontakt oss:
                        </h1>
                        <div className="font-mina text-xl p-2 hover:bg-pinky rounded-xl">
                            <a href="mailto:mail@create.no" target="_blank" className="flex flex-row gap-4">
                                <Mail color="white" size={22} />
                                <p>mail@create.no</p>
                            </a>
                        </div>
                        <div className="font-mina text-xl p-2 hover:bg-pinky rounded-xl">    
                            <a href="tel:+4746787000"  target="_blank" className="flex flex-row gap-4">
                                <Phone color="white" size={22} />
                                <p>+47 467 87 000</p>
                            </a>
                        </div>
                    </div>
                    
                    <div className="bg-black/40 mx-4 md:mx-0 rounded-xl p-2 font-mina md:h-72">
                        <h1 className="text-pinky text-center">
                            Følg oss:
                        </h1>
                        <div className="font-mina text-xl p-2 hover:bg-pinky rounded-xl">
                            <a href="https://www.instagram.com/createvgs/" target="_blank" className="flex flex-row gap-4">
                                <Instagram color="white" size={22} />
                                <p>
                                    Instagram
                                </p>
                            </a>
                        </div>
                        <div className="font-mina text-xl p-2 hover:bg-pinky rounded-xl">
                            <a href="https://www.facebook.com/createvgs/" target="_blank" className="flex flex-row gap-4">
                                <Facebook color="white" size={22} />
                                <p>
                                    Facebook
                                </p>
                            </a>
                        </div>
                        <div className="font-mina text-xl p-2 hover:bg-pinky rounded-xl flex flex-row">
                            <a href="https://www.tiktok.com/@create_vgs" target="_blank" className="flex flex-row gap-6 justify-start">
                            <div className="cursor-pointer">
                                <Image 
                                    src={tiktoklogo}
                                    alt=""
                                    id="logo"
                                    className="w-4 ml-[2px] mt-[2px]"
                                />
                            </div>
                                <p>
                                    TikTok
                                </p>
                            </a>
                        </div>                        
                    </div>
                    <div className="bg-black/40 mx-4 md:mx-0 rounded-xl p-2 pb-4 font-mina md:h-72 flex flex-col justify-start items-center">
                        <h1 className="text-pinky text-center pb-2">
                            Besøk oss:
                        </h1>
                        <p className="font-mina text-xl">
                            CREATE
                        </p>
                        <p className="font-mina text-xl">
                            Mesnakvartalet 20
                        </p>
                        <p className="font-mina text-xl">
                            2615 Lillehammer
                        </p>
                    </div>
                    <div className="bg-black/40 mx-4 md:mx-0 rounded-xl p-2 font-mina mb-8 flex flex-col gap-2 md:h-80">
                        <h1 className="text-pinky text-center">
                            Les mer:
                        </h1>
                        <a className="hover:bg-pinky p-2 rounded-xl" target="_blank" href="/publicfiles/ordensreglement.pdf">
                            <p className="font-mina text-lg">Ordensreglement</p>
                        </a>
                        <a className="hover:bg-pinky p-2 rounded-xl" target="_blank" href="/publicfiles/inntaksreglement.pdf">
                            <p className="font-mina text-lg">Inntaksreglement</p>
                        </a>
                        <a className="hover:bg-pinky p-2 rounded-xl" target="_blank" href="/publicfiles/CREATE_-_fag_og_timefordeling_2019 (1).pdf">
                            <p className="font-mina text-lg">Fag- og timefordeling</p>
                        </a>
                        <a className="hover:bg-pinky p-2 rounded-xl" target="_blank" href="/publicfiles/Creates_læreplan__generell_del (1).pdf">
                            <p className="font-mina text-lg">Læreplan og godkjennelse</p>
                        </a>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Contact;