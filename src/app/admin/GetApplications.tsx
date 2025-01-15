import { useState, useRef } from "react";
import { utils, writeFileXLSX } from "xlsx";
import { Download } from 'lucide-react';

interface GetApplicationsProps {
    token: string;
}

interface Application {
    _id: string;
    name: string;
    email: string;
    phone: string;
    priority1: string;
    priority2: string;
    priority3: string;
    filename: string;
    createdAt: string;
    s3FileUrl?: string;  // Add a new field to store S3 URL
    textractAnalysis?: string;  // Add a new field to store S3 URL
    karaktersett?: Array<number>,
    gjennomsnitt?: number,
    antallKarakterer?: number,
    behandlet?: number,
}

const GetApplications: React.FC<GetApplicationsProps> = ({ token }) => {
    const tbl = useRef(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [pressedButton, setPressedButton] = useState(false);
    
    const fetchApplications = async () => {
        setPressedButton(false);
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
            
            const applications = data.applications.map((app: Application) => ({
                ...app, 
                s3FileUrl: app.s3FileUrl || null,
            }));
            
            // Iterer gjennom hver applikasjon og prosesser Textract-resultatet
            applications.forEach((app: Application) => {
                if (app.textractAnalysis) {
                    try {
                        const linjer: Array<string> = [];
                        const textractResult = JSON.parse(app.textractAnalysis); // Pars Textract JSON
                        textractResult.forEach((result: string) => {
                            const trimmetResultat: string = result.trim();
                            linjer.push(trimmetResultat.toString());
                        })
                        const regex = /^\s?([1-6])\s?\-?\s?(EN|TO|TRE|FIRE|FEM|SEKS|en|to|tre|fire|fem|seks)?\s?$/;
                        ;
                        const matches: Array<string> = [];
                        linjer.forEach((linje) => {
                            const result = regex.exec(linje) || "";
                            if (result) matches.push(result[0]);
                        });
                        
                        const karakterer: Array<number> = [];
                        matches.forEach((match) => {
                            const trimmedMatch = match.trim();
                            karakterer.push(parseInt(trimmedMatch[0][0]));
                        });
                        if (karakterer.length > 10 && karakterer.length < 28) {
                            app.karaktersett = karakterer;
                            let samletSum: number = 0;
                            let antallKarakterer: number = 0;
                            karakterer.forEach((karakter) => {
                                samletSum += karakter;
                                antallKarakterer ++;
                            })
                            app.gjennomsnitt = samletSum / antallKarakterer;
                            app.antallKarakterer = antallKarakterer;
                        } else {
                            app.gjennomsnitt = 0;
                            app.antallKarakterer = karakterer.length;
                        }
                    } catch (e) {
                        console.error("Error parsing Textract analysis for application:", e);
                    }
                }
            });

            setApplications(applications);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="flex flex-col w-full min-h-screen">
            <div className="flex flex-row w-full h-full gap-8 justify-between items-center">
                <button
                    className="p-4 flex justify-center items-center rounded-xl text-2xl border-2 border-purple-500 w-96 bg-fuchsia-500 cursor-pointer hover:bg-pinky"
                    onClick={fetchApplications}
                >
                    {pressedButton && (
                        <span>Oppdater søknader</span>
                        
                    )}
                    {!pressedButton && (
                        <span>Hent søknader</span>
                    )}
                </button>
                
                {pressedButton && 
                    <button className="justify-center items-center p-4 flex flex-row rounded-xl text-2xl  w-96 bg-fuchsia-500 cursor-pointer hover:bg-pinky" onClick={() => {
                        const wb = utils.table_to_book(tbl.current);
                        const nowDate = new Date();
                        const year = nowDate.getFullYear();
                        const month = nowDate.getMonth() + 1;
                        const day = nowDate.getDate();
                        const hour = nowDate.getHours();
                        const minutes = nowDate.getMinutes();
                        const formattedMonth = month.toString().padStart(2, '0');
                        const formattedDay = day.toString().padStart(2, '0');
                        const formattedHour = hour.toString().padStart(2, '0');
                        const formattedMinutes = minutes.toString().padStart(2, '0');
                        const fileDate = `${year}-${formattedMonth}-${formattedDay}(${formattedHour}.${formattedMinutes})`
                        const xlsxFileName = `SøknaderCreate_${fileDate}.xlsx`;
                        writeFileXLSX(wb, xlsxFileName);
                    }}>Eksporter søknader<Download/></button>
}
            </div>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {applications.length > 0 ? (
                <div className="flex flex-col w-full overflow-scroll justify-start items-start px-8">
                    <h1>Antall søknader: {applications.length}</h1>
                    <table ref={tbl} className="table-auto w-full mt-8 text-lg p-4 bg-slate-800 rounded-xl max-w-screen-md overflow-scroll">
                        <thead className="bg-slate-600">
                            <tr className="bg-slate-400-100">
                                <th className="border px-4 py-2">Navn</th>
                                <th className="border px-4 py-2">Søkt dato <span className="text-sm">(YYYY-MM-DD)</span></th>
                                <th className="border px-4 py-2">E-post</th>
                                <th className="border px-4 py-2">Telefon</th>
                                <th className="border px-4 py-2">1. Prioritet</th>
                                <th className="border px-4 py-2">2. Prioritet</th>
                                <th className="border px-4 py-2">3. Prioritet</th>
                                <th className="border px-4 py-2">Bilde</th>
                                <th className="border px-4 py-2">Gjennomsnitt</th>
                                <th className="border px-4 py-2">Antall karakterer</th>
                                <th className="border px-4 py-2">Karaktersett</th>
                                <th className="border px-4 py-2">Behandlet?</th>

                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} className="">
                                    <td className="border px-4 py-2">{app.name}</td>
                                    <td className="border px-4 py-2">{app.createdAt.slice(0, 10)}</td>
                                    <td className="border px-4 py-2">{app.email}</td>
                                    <td className="border px-4 py-2">{app.phone}</td>
                                    <td className="border px-4 py-2">{app.priority1}</td>
                                    <td className="border px-4 py-2">{app.priority2}</td>
                                    <td className="border px-4 py-2">{app.priority3}</td>
                                    <td className="border px-4 py-2 text-xs max-w-44 h-auto break-words">
                                        {app.s3FileUrl ? (
                                        <a href={app.s3FileUrl} target="_blank" rel="noopener noreferrer">
                                            Last ned fil
                                        </a>
                                        ) : (
                                            <span>Ingen fil</span>
                                        )}
                                        </td>
                                    <td className="border px-4 py-2">{app.gjennomsnitt?.toString().substring(0, 7)}</td>
                                    <td className="border px-4 py-2">{app.antallKarakterer}</td>
                                    <td className="border px-4 py-2 break-words">{app.karaktersett}</td>
                                    <td className="border px-4 py-2 break-words">{app.behandlet}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div>{pressedButton && <p>No applications found</p>}</div>
            )}
        </div>
    );
};

export default GetApplications;
