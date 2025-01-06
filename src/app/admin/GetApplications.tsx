import { useState } from "react";

interface GetApplicationsProps {
    token: string;
}

const GetApplications: React.FC<GetApplicationsProps> = ({ token }) => {
    const [applications, setApplications] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [pressedButton, setPressedButton] = useState(false);
    
    const fetchApplications = async () => {
        setPressedButton(true);
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
            console.log("Fetched applications:", data);
            setApplications(data.applications || []);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div>
            <button
                className="p-4 rounded-xl text-2xl border-2 border-purple-500 w-96 bg-black/60 cursor-pointer hover:bg-black/80"
                onClick={fetchApplications}
            >
                Hent søknader
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {applications.length > 0 ? (
                <table className="table-auto w-full mt-8 text-xl p-4 bg-slate-800 rounded-xl">
                    <thead>
                        <tr className="bg-slate-400-100">
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Phone</th>
                            <th className="border px-4 py-2">Priority</th>
                            <th className="border px-4 py-2">Filename</th>
                            <th className="border px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id} className="">
                                <td className="border px-4 py-2">{app.name}</td>
                                <td className="border px-4 py-2">{app.email}</td>
                                <td className="border px-4 py-2">{app.phone}</td>
                                <td className="border px-4 py-2">{app.priority1}</td>
                                <td className="border px-4 py-2 text-xs max-w-44 h-auto break-words">{app.filename}</td>
                                <td className="border px-4 py-2">{app.createdAt.slice(0, 10)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>{pressedButton && <p>No applications found</p>}</div>
            )}
        </div>
    );
};

export default GetApplications;
