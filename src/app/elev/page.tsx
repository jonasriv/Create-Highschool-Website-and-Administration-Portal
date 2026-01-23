import { getServerSession } from "next-auth";
import ElevHeader from "./ElevHeader";

export default async function ElevPage() {
    const internalBackground = "/images/iStock-1069853936_compressed3.jpg";

    const session = await getServerSession();
    // if (!session) redirect("/api/auth/signin?callbackUrl=/elev");

    return (
        <div className="flex flex-col h-screen w-screen bg-white/40 "
            style={{
                backgroundColor: 'black',
                backgroundImage: `url(${internalBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                //filter: 'brightness(80%)',
            }}  
        >
            <ElevHeader user={session?.user}/>        
            <main className="mt-24 h-screen min-w-full max-w-[1200px] pt-4 flex flex-col justify-start items-center">
                <div className="bg-black/60 backdrop-blur-sm w-10/12 h-96 rounded-md p-4">
                    {session ? <p>Innlogget som: {session?.user?.email || ""}</p> : <p>Du må logge deg inn med feide</p>}
                </div>
                
            </main>
        </div>
    );
}
