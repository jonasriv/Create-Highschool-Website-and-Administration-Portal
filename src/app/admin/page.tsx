"use client";
import { useState, useEffect, useCallback } from "react";
import GetApplications from "./GetApplications";
import GetContent from "./GetContent";
import GetNews from "./GetNews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



export default function AdminPage() {
    const externalBackground = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506363/background_no_logo_yhjwra.jpg";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = useCallback(async () => {
        setError(null);
        
        if (!username || !password) {
            setError("Both username and password are required.");
            return;
        }
                   
        try {
            const response = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }), 
            });
            
            console.log("Response:", response);
            
            if (!response.ok) {
                throw new Error("Login failed");
            }
    
            const data = await response.json();
            console.log("Received data:", data); // Logg responsen fra backend
            setToken(data.token);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Error logging in:", err);
                setError(err.message);
            } else {
                console.error("An unknown error occurred");
                setError("An unknown error occurred");
            }
        }
    }, [username, password]);    

    const handleLogout = () => {   
        setToken(null);
        location.reload();
    }

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && (!token)) {
                handleLogin();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [username, password, handleLogin, token]);

    return (
        <div className="flex flex-col w-screen h-screen box-border bg-fuchsia-black justify-start items-center" 

        style={{
          backgroundImage: `url(${externalBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          //filter: 'brightness(80%)',
      }}>
                <div className="flex flex-row gap-4 items-center justify-between w-full bg-slate-950 px-8 text-sm md:text-lg font-bold font-roboto min-h-16">
                    <div>
                        <h1 className="w-full p-4 text-center font-black font-mina">Create VGS Admin Panel</h1>
                    </div>
                    {token &&
                        <div className="flex flex-row gap-4 md:gap-8 items-center">
                            <p>Logget inn som <span className="text-red-700">{username}</span></p>
                            <button onClick={handleLogout} className="rounded-xl px-2 md:px-4 my-2 py-[2px] bg-red-400 hover:bg-red-500">Logg ut</button>
                        </div>
                    }

                </div>
            {!token ? (
                <div className="flex flex-col gap-12 w-full max-w-screen-sm min-h-96 items-center bg-black/60 p-12 md:rounded-2xl mt-16 ">
                    {error && <p style={{color:"red" }}>{error}</p>}
                    <input  
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-black text-2xl p-2 rounded-lg w-96"
                    />
                    <input  
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-black text-2xl p-2 rounded-lg w-96"
                    />                    
                    <button className="p-4 rounded-xl text-2xl border-2 border-purple-500 w-96 hover:bg-pinky" onClick={handleLogin}>Login</button>
                </div>
            ) : (
                
                <div id="subject_tabs" className="w-full h-auto pb-12 lg:pb-16 bg-black/80 border-t-2 border-b-2 border-pinky">
                {username === "nyhetsansvarlig" &&
                    <div className="w-full h-full flex flex-col justify-center">
                        <div className="w-full h-auto min-h-screen">
                            <h1 className="text-center text-2xl p-8 w-full bg-black/40">Nyheter</h1>
                            <div className="w-full mb-4 p-4">
                                <GetNews token={token}/>
                            </div>
                    </div>  
                    </div>
                }
                {username === "admin" &&
                <Tabs defaultValue="news_tab" className="w-full h-full flex flex-col justify-center">
                    <div className="w-full flex justify-center bg-white/20">
                        <TabsList className="rounded-none h-22 p-4 mb-4 flex flex-row justify-between w-8/12">
                            <TabsTrigger value="news_tab" className="opacity-100 bg-black p-2 md:p-4 text-sm md:text-md lg:text-2xl">Nyheter</TabsTrigger>
                            <TabsTrigger value="applications_tab" className="opacity-100 bg-black p-2 md:p-4 text-sm md:text-md lg:text-2xl">Søknader</TabsTrigger>
                            <TabsTrigger value="content_tab" className="opacity-100 p-2 md:p-4 bg-black text-sm md:text-md lg:text-2xl">Web-innhold</TabsTrigger>
                        </TabsList> 
                    </div>

                    <TabsContent value="news_tab" className="w-full h-auto min-h-screen">
                        <div className="flex flex-col w-full mb-4 p-4">
                            <GetNews token={token}/>
                        </div>
                    </TabsContent>                      

                    <TabsContent value="applications_tab" className="w-auto h-auto min-h-screen">
                        <div className="flex flex-col md:flex-row justify-center items-start mb-4 p-4">
                            <GetApplications token={token}/>
                        </div>
                    </TabsContent>                             

                    <TabsContent value="content_tab" className="w-full h-auto min-h-screen">
                        <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 p-4">
                            <GetContent token={token}/>
                        </div>
                    </TabsContent>                      
                </Tabs>  
                }
                  

            </div>
            )}
        </div>
    );
}