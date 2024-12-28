'use client'
import dynamic from "next/dynamic";
import React, { useRef } from 'react';
import ScrollButton from "@/components/ScrollButton";
import BackgroundImage2 from '../../public/images/gpt-background2.webp';
const Front = dynamic(() => import("./Front"));
const Study = dynamic(() => import("./Study"));
const Apply = dynamic(() => import("./Apply"));
const Header = dynamic(() => import("./Header"));
const Intro = dynamic(() => import("./Intro"));

const Home = () => {
    
  return (
    <div 
      className="flex flex-col h-screen w-screen bg-white/40"
      style={{
        backgroundImage: `url(${BackgroundImage2.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        //filter: 'brightness(80%)',
    }}  
    >
      <Header />
      <main className="bg-black/65 h-screen w-screen snap-y snap-mandatory overflow-x-hidden no-scrollbar">  
          <div id="front" className="snap-start h-screen flex items-center justify-center">
            <Front />
          </div>

          <div id="intro" className="snap-start h-screen flex items-center justify-center  backdrop-blur-lg bg-black/30">
            <Intro />
          </div>

          <div id="study" className="snap-start h-screen flex items-center justify-center">
            <Study />
          </div>          

          <div id="apply" className="snap-start h-screen flex items-center justify-center">
            <Apply />
          </div>
        
      </main>
      
    </div>
  );
}


export default Home;