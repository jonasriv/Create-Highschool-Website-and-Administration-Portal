'use client'
import dynamic from "next/dynamic";
import BackgroundImage2 from '../../public/images/gpt-background2.webp';
const Front = dynamic(() => import("./Front"));
const Study = dynamic(() => import("./Study"));
const Header = dynamic(() => import("./Header"));
const Intro = dynamic(() => import("./Intro"));
const Admission = dynamic(() => import("./Admission"));

const Home = () => {
  const externalBackground = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506363/background_no_logo_yhjwra.jpg";
  return (
    <div 
      className="flex flex-col h-screen w-screen bg-white/40"
      style={{
        backgroundImage: `url(${externalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        //filter: 'brightness(80%)',
    }}  
    >
      <Header />
      <main className="bg-black/65 h-screen w-screen snap-y snap-proximity overflow-x-hidden no-scrollbar mt-22 md:pt-28">  

          <div id="front" className="snap-start h-screen flex items-center justify-center">
            <Front />
          </div>
          
          <div id="intro" className="snap-start h-screen flex items-center justify-center backdrop-blur-lg">
            <Intro />
          </div>

          <div id="study" className="snap-start h-screen flex items-center justify-center backdrop-blur-lg ">
            <Study />
          </div>             

          <div id="admission" className="snap-start flex h-screen items-start justify-center backdrop-blur-lg pt-24">
            <Admission />
          </div>                       
        
      </main>
      
    </div>
  );
}


export default Home;