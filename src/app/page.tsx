import dynamic from "next/dynamic";

const Front = dynamic(() => import("./Front"));
const Study = dynamic(() => import("./Study"));
const Apply = dynamic(() => import("./Apply"));
const Header = dynamic(() => import("./Header"));
const Intro = dynamic(() => import("./Intro"));

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />

      <main className="h-screen w-screen snap-y snap-mandatory overflow-x-hidden no-scrollbar">
        
          <div id="intro" className="snap-start h-screen flex items-center justify-center">
            <Front />
          </div>

          <div id="front" className="snap-start h-screen items-center justify-center bg-black flex flex-col">
            <Intro/>
          </div>

          <div id="study" className="snap-start h-screen w-screen flex items-center justify-center bg-yellow-200">
            <Study />
          </div>          
          
          <div id="apply" className="snap-start h-screen w-screen flex items-center justify-center bg-blue-200">
            <Apply />
          </div>
        
      </main>
    </div>
  );
}
