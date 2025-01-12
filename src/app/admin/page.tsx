"use client";

import { useState } from "react";
import GetApplications from "./GetApplications";
import GetContent from "./GetContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleLogin = async () => {
        setError(null);
        

        if (!username || !password) {
            setError("Both username and password are required.");
            return;
        }
    
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
                
        try {
            const response = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }), // Pass på at vi sender passordet
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
    };
    



    return (
        <div className="flex flex-col w-screen h-screen box-border bg-fuchsia-950 justify-start items-center ">
            <h1 className="font-black font-mina">Create VGS Admin Panel</h1>
            {!token ? (
                <div className="flex flex-col gap-12 w-full md:max-w-screen-lg items-center bg-black/60 p-12 rounded-2xl">
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
                    <button className="p-4 rounded-xl text-2xl border-2 border-purple-500 w-96" onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div id="subject_tabs" className="w-full h-auto flex flex-row pb-12 lg:pb-16 bg-black/60">
                <Tabs defaultValue="applications_tab" className="w-full h-full">
                    
                    <TabsList className="min-w-full rounded-none flex flex-row items-center justify-between h-22 gap-0  bg-fuchsia-950 p-4 mb-4">
                        <TabsTrigger value="applications_tab" className="opacity-100 p-2 md:p-4 animate-flash-border3 text-md md:text-2xl uppercase">Søknader</TabsTrigger>
                        <TabsTrigger value="content_tab" className="opacity-100 p-2 md:p-4 animate-flash-border2 text-md md:text-2xl uppercase">Web-innhold</TabsTrigger>
                    </TabsList> 
           
                    <TabsContent value="applications_tab" className="w-full h-auto min-h-screen">
                        <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 p-4">
                            <GetApplications token={token}/>
                        </div>
                    </TabsContent>                             

                    <TabsContent value="content_tab" className="w-full h-auto min-h-screen">
                        <div className="flex flex-col md:flex-row md:justify-between items-start mb-4 p-4">
                            <GetContent token={token}/>
                        </div>
                    </TabsContent>   

                </Tabs>    

            </div>
            )}
        </div>
    );
}