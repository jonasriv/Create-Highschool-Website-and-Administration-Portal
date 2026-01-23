import { getServerSession } from "next-auth";
import ElevHeader from "./ElevHeader";

export default async function ElevPage() {
    const internalBackground = "/images/iStock-1069853936_compressed3.jpg";

    const session = await getServerSession();
    // if (!session) redirect("/api/auth/signin?callbackUrl=/elev");

    return (
        <div className="flex flex-col h-screen w-screen bg-white/40"
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
            <main className="mt-24">
                <p>Innlogget som: {session?.user?.email ?? "ukjent"}</p>HALLO
            </main>
        </div>
    );
}
