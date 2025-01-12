'use client'
import React from "react";
import Footer from "./Footer";
import { Instagram, Facebook, Mail, Phone} from 'lucide-react'

const Contact = () => {
    
    return (
        <div className="flex w-screen h-full flex-col justify-end items-center">
            <div className="flex flex-col justify-between items-center md:items-start w-full max-w-screen-lg h-full gap-12">
                <h1 className="text-3xl font-mina font-black">Kontakt</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full w-full ">
                <div className="bg-black/40 mx-4 md:mx-0 rounded-xl p-8 font-mina">
                    <h1 className="text-pinky text-center">
                        Kontakt oss:
                    </h1>
                    <div className="font-mina text-xl">
                        <a href="mailto:mail@create.no" target="_blank" className="hover:bg-pinky rounded-xl p-2 flex flex-row">
                            <Mail color="white" size={22} />
                            <p>mail@create.no</p>
                        </a>
                    </div>
                    <div className="font-mina text-xl">    
                        <a href="tel:+4746787000"  target="_blank" className="hover:bg-pinky rounded-xl p-2 flex flex-row">
                            <Phone color="white" size={22} />
                            <p>+47 467 87 000</p>
                        </a>
                    </div>
                </div>
                
                <div className="bg-black/40 mx-4 md:mx-0 rounded-xl p-8 font-mina">
                    <h1 className="text-pinky text-center">
                        Følg oss:
                    </h1>
                    <div className="font-mina text-xl flex flex-row w-full">
                    <a href="https://www.instagram.com/createvgs/" target="_blank" className="hover:bg-pinky rounded-xl p-2 flex flex-row gap-4">
                        <Instagram color="white" size={22} />
                        <p>
                            Instagram
                        </p>
                    </a>
                    </div>
                    <div className="font-mina text-xl flex flex-row w-full">
                    <a href="https://www.facebook.com/createvgs/" target="_blank" className="hover:bg-pinky rounded-xl p-2 flex flex-row gap-4">
                        <Facebook color="white" size={22} />
                        <p>
                            Facebook
                        </p>
                    </a>
                    </div>
            
                </div>
                <div className="bg-black/40 mx-4 md:mx-0 rounded-xl p-8 font-mina">
                    <h1 className="text-pinky text-center">
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
                <div className="bg-black/40 mx-4 md:mx-0 rounded-xl p-8 font-mina mb-8">
                    <h1 className="text-pinky text-center">
                        Les mer:
                    </h1>
                    <a target="_blank" href="/publicfiles/ordensreglement.pdf">
                        <p className="font-mina text-xl">Ordensreglement</p>
                    </a>
                    <a target="_blank" href="/publicfiles/inntaksreglement.pdf">
                        <p className="font-mina text-xl">Inntaksreglement</p>
                    </a>
                    <a target="_blank" href="/publicfiles/CREATE_-_fag_og_timefordeling_2019 (1).pdf">
                        <p className="font-mina text-xl">Fag- og timefordeling</p>
                    </a>
                    <a target="_blank" href="/publicfiles/Creates_læreplan__generell_del (1).pdf">
                        <p className="font-mina text-xl">Læreplan og godkjennelse</p>
                    </a>
                </div>
                </div>

            </div>
            <div className="w-screen h-full uppercase flex flex-col justify-end items-start max-w-screen">
                <Footer/>
            </div>
        </div>
    )
}

export default Contact;