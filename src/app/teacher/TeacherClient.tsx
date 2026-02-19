"use client";
import TeacherHeader from "./TeacherHeader";
import Sidebar from "./components/Sidebar";
import { useTeacherStore } from "./store";
import TeacherTools from "./TeacherTools";
import TeacherTests from "./TeacherTests";
import TeacherOther from "./TeacherOther";

type Props = {
user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
};
msConnected: boolean;
};


export default function TeacherClient({ user, msConnected }: Props) {
    const windowOpen = useTeacherStore((s) => s.windowOpen);
    const backgroundImage = "/images/sky_background.jpg";
    const dark = useTeacherStore((s) => s.dark);
    const showingMenu = useTeacherStore((s) => s.showingMenu);
    return (
        <div 
            className="w-screen h-screen overflow-hidden"
            style={{
                backgroundColor: 'black',
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                //filter: 'brightness(60%)',
            }}  
        >
            <TeacherHeader user={user}/>
            <main className={`flex flex-row backdrop-blur-xl`}>
                <Sidebar/>
                {/* CONTENT COMES HERE */}
                <div 
                    className={`${showingMenu ? "w-[calc(100vw-11rem)]" : "w-[calc(100vw-3rem)]"} transition-all ${dark ? "bg-black/70" : "bg-white/70"}`}
                >
                    {windowOpen === "tools" 
                        ? <TeacherTools user={user} msConnected={msConnected}/> 
                        : windowOpen === "tests" 
                            ? <TeacherTests user={user} msConnected={msConnected}/> 
                            : <TeacherOther user={user} msConnected={msConnected}/>
                    }

                </div>
            </main>
        </div>
    )
}