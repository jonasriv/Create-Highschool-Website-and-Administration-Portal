'use client'
import dynamic from "next/dynamic";
const Front = dynamic(() => import("./Front"));
const Study = dynamic(() => import("./Study"));
const Header = dynamic(() => import("./Header"));
const Admission = dynamic(() => import("./Admission"));
const Contact = dynamic(() => import("./Contact"));
const Footer = dynamic(() => import("./Footer"));
const ElevPaCreate = dynamic(() => import("./ElevPaCreate"));

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
      <main className="bg-black/65 h-screen w-screen scroll-smooth overflow-x-hidden no-scrollbar mt-22 md:pt-28">  

          <div id="front" className="h-screen flex items-center justify-center">
            <Front />
          </div> 
          
          <div id="study" className="h-auto flex items-center justify-center backdrop-blur-lg pb-0 mb-0 lg:pb-8">
            <Study />
          </div>

          <div id="intro" className="h-auto flex items-center justify-center backdrop-blur-lg pt-8 pb-16 mt-0">
            <ElevPaCreate />
          </div>                       

          <div id="admission" className="flex h-auto items-start justify-center backdrop-blur-lg pt-16 pb-16">
            <Admission />
          </div>         

          <div id="contact" className="flex lg:h-screen items-start justify-center backdrop-blur-lg pt-24">
            <Contact />
          </div>                       

          <div className="w-screen h-auto uppercase flex flex-col justify-end items-start max-w-screen">
                <Footer/>
            </div>
         
      </main>
      
    </div>
  );
}


export default Home;