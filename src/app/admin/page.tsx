"use client";
import { useState, useEffect, useCallback } from "react";
import GetApplications from "./GetApplications";
import GetContent from "./GetContent";
import GetNews from "./GetNews";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jwtDecode } from "jwt-decode";
import { LogOut } from 'lucide-react';
interface MyToken {
    name: string;
    exp: number;
    isAdmin: boolean;
}

export default function AdminPage() {
    const externalBackground = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506363/background_no_logo_yhjwra.jpg";
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
 
    const handleLogin = useCallback(async () => {
        setError(null);
        setIsLoggingIn(true);
        
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
        setIsLoggingIn(false);
    }, [username, password]);    

    const handleLogout = () => {   
        setToken(null);
        location.reload();
    }

    const decoded = token ? jwtDecode<MyToken>(token) : null;

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (decoded && decoded.exp * 1000 < Date.now()) {
                alert("Sesjonen har utløpt. Logg inn på nytt.");
                handleLogout();
            }
        };
    
        const interval = setInterval(checkTokenExpiration, 10000); // Sjekker hvert tiende sekund
    
        return () => clearInterval(interval); // Rydder opp når komponenten unmountes
    }, [decoded, handleLogout]);

    useEffect(() => {

        if (!decoded && token && !isLoggingIn) {
            alert("Logg inn på nytt!");
            handleLogout();
        }
        if (decoded && !decoded.isAdmin && !isLoggingIn) {
            alert("Logg inn som admin-bruker!");
        }

    }, [token, decoded, isLoggingIn, handleLogout]);

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
        <div className="sticky flex flex-col w-screen h-auto min-h-screen box-border bg-fuchsia-black justify-start items-center " 

        style={{
          backgroundImage: `url(${externalBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          //filter: 'brightness(80%)',
      }}>
            <div className="sticky top-0 flex flex-row gap-4 items-center justify-between w-full bg-slate-950 md:px-8 text-sm md:text-lg font-bold font-roboto min-h-16 h-16 z-50">
                <div className="flex items-center h-full">
                    <h1 className="w-full p-4 text-center md:text-xl font-black font-mina">Create VGS Admin <span className="hidden md:inline-block">Panel</span></h1>
                </div>
                {token &&
                    <div className="flex flex-row gap-4 h-full md:gap-8 items-center">
                        <p>Logget inn som <span className="text-red-700">{username}</span></p>
                        <button onClick={handleLogout} className="rounded-xl px-2 md:px-2 py-[4px] mr-2 md:mr-0 bg-red-500 hover:bg-red-500"><LogOut size="18"/></button>
                    </div>
                }

            </div>
            <div className="w-full overflow-auto">

            {!token ? (
                <span>
                {isLoggingIn && 
                    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                        <div className="w-screen h-screen flex justify-center items-start mt-[550px]">
                            <div className="w-36 h-36 border-b-8 border-t-8 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div>
                        </div>
                    </div>
                }
                <div className="w-full flex md:justify-center md:items-center">
                    <div className="flex flex-col gap-12 w-full max-w-screen-sm min-h-96 items-center justify-center bg-black/60 p-12 md:rounded-2xl md:mt-16 ">
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
                        <button className="p-4 rounded-xl text-2xl border-2 border-purple-500 w-auto md:w-96 hover:bg-pinky" onClick={handleLogin}>Login</button>
                    </div>
                </div>
                </span>
            ) : (
                
                <div id="subject_tabs" className="w-full h-auto pb-12 lg:pb-16 bg-black/80 overflow-auto">
                {username === "nyhetsansvarlig" &&
                    <div className="w-full h-full flex flex-col justify-center">
                        <div className="w-full h-auto min-h-screen">
                            <h1 className="text-center text-2xl p-8 w-full bg-black/40">Nyheter</h1>
                            <div className="w-full mb-4 p-4 overflow-auto">
                                <GetNews token={token}/>
                            </div>
                        </div>  
                    </div>
                }
                {username === "admin" &&
                    <Tabs defaultValue="applications_tab" className="w-full h-full flex flex-col justify-center">
                        <div className="w-full flex justify-center items-center bg-slate-800 opacity-80">
                            <TabsList className="w-full rounded-none h-full p-4 flex flex-row justify-between md:w-8/12">
                                <TabsTrigger value="news_tab" className="opacity-100 bg-white/10 p-2 w-48 text-white text-sm md:text-md lg:text-xl">Nyheter</TabsTrigger>
                                <TabsTrigger value="applications_tab" className="opacity-100 bg-white/10 w-48 p-2 text-white text-sm md:text-md lg:text-xl">Søknader</TabsTrigger>
                                <TabsTrigger value="content_tab" className="opacity-100 p-2 bg-white/10 w-48 text-sm text-white md:text-md lg:text-xl">Web-innhold</TabsTrigger>
                            </TabsList> 
                        </div>

                        <TabsContent value="news_tab" className="w-full h-auto min-h-screen">
                            <div className="flex flex-col w-full mb-4 p-4">
                                <GetNews token={token}/>
                            </div>
                        </TabsContent>                      

                        <TabsContent value="applications_tab" className="w-auto h-auto min-h-screen">
                            <div className="flex flex-col md:flex-row justify-center items-start mb-4 md:p-4">
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
        </div>
    );
}