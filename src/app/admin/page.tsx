"use client";

import {useState } from "react";

export default function AdminPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null); 
        try {

            
            const response = await fetch("/api/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            console.log(response);
            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            setToken(data.token);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchApplications = async () => {
        if (!token) return;

        setError(null);
        try {
            const response = await fetch("/api/applications", {
                method: "GET", 
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch applications");
            }

            const data = await response.json();
            setApplications(data.applications);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            {!token ? (
                <div className="flex flex-col gap-12 w-96">
                    {error && <p style={{color:"red" }}>{error}</p>}
                    <input  
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-black"
                    />
                    <input  
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-black"
                    />                    
                    <button className="p-4 m-4 rounded-xl border-2 border-purple-500" onClick={handleLogin}>Login</button>
                </div>
            ) : (
                <div>
                    <button className="p-4 m-4 rounded-xl border-2 border-purple-500" onClick={fetchApplications}>Fetch applications</button>
                    {applications.length > 0 ? (
                        <ul>
                            {applications.map((app) => (
                                <li key={app._id}>
                                    {app.name} - {app.email}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No applications found</p>
                    )}
                </div>
            )}
        </div>
    );
}