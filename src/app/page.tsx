'use client'
import dynamic from "next/dynamic";
const Front = dynamic(() => import("./Front"));
const Study = dynamic(() => import("./Study"));
const Header = dynamic(() => import("./Header"));
// const Hvaskjer = dynamic(() => import("./HvaSkjer"));
const Admission = dynamic(() => import("./Admission"), {ssr: false});
const Contact = dynamic(() => import("./Contact"));
const Footer = dynamic(() => import("./Footer"));
const ElevPaCreate = dynamic(() => import("./ElevPaCreate"));
const Mentorer = dynamic(() => import("./Mentorer"));

const Home = () => {
  const internalBackground = "/images/iStock-1069853936.jpg";
  return (
    <div 
      className="flex flex-col h-screen w-screen bg-white/40"
      style={{
        backgroundColor: 'black',
        backgroundImage: `url(${internalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        //filter: 'brightness(80%)',
    }}  
    >
      <Header />
      <main className="bg-black/60 h-screen w-screen scroll-smooth overflow-x-hidden no-scrollbar mt-22 md:pt-28">  

          <div id="front" className="h-screen flex items-center justify-center">
            <Front />
          </div> 

          {/* <div id="hvaskjer" className="h-auto flex items-center justify-center backdrop-blur-lg pt-8 mb-0 lg:pb-16 border-t-[0px] border-pinky">
            <Hvaskjer />
          </div>         */}

          <div id="study" className="h-auto flex items-center justify-center backdrop-blur-lg pt-8 mb-0 lg:pb-16 border-t-[0px] border-pinky bg-white/5">
            <Study />
          </div>
          
          <div id="intro" className="h-auto flex items-center justify-center backdrop-blur-lg pt-8 pb-16 mt-0 border-y-[0px] border-pinky ">
            <ElevPaCreate />
          </div>                                 

          <div id="mentorer" className="h-auto flex items-center justify-center backdrop-blur-lg pt-8 border-b-[0px] border-pinky bg-white/5">
            <Mentorer />
          </div>    

          <div id="admission" className="flex h-auto items-start justify-center backdrop-blur-lg pt-24 pb-16 border-b-[0px] border-pinky">
            <Admission />
          </div>         

          <div id="contact" className="flex h-auto items-start justify-center backdrop-blur-lg pt-28 bg-white/5">
            <Contact />
          </div>                       

          <div className="w-screen h-auto uppercase flex flex-col justify-end items-start max-w-screen border-t-[0px] border-pinky">
              <Footer/>
          </div>
         
      </main>
      
    </div>
  );
}


export default Home;