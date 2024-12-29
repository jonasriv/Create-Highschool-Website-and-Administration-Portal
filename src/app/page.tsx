'use client'
import dynamic from "next/dynamic";
import BackgroundImage2 from '../../public/images/gpt-background2.webp';
const Front = dynamic(() => import("./Front"));
const Study = dynamic(() => import("./Study"));
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
      <main className="bg-black/65 h-screen w-screen snap-y snap-mandatory overflow-x-hidden no-scrollbar pt-20 md:pt-24">  

          <div id="front" className="snap-start h-screen flex items-center justify-center">
            <Front />
          </div>
          
          <div id="intro" className="snap-start h-screen flex items-center justify-center backdrop-blur-lg ">
            <Intro />
          </div>

          <div id="study" className="snap-start h-screen flex items-center justify-center backdrop-blur-lg ">
            <Study />
          </div>          
        
      </main>
      
    </div>
  );
}


export default Home;