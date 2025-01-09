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
    ocrText: string;
    gjennomsnitt?: string;
    karaktersett?: string;
    numbersString?: string;
    antallKarakterer?: string;
    muligSuksess?: boolean;
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
            console.log("Fetched applications:", data);
            const applicationsArray = data.applications || [];
            const processedApplications = applicationsArray.map((app: Application) => {
                // rEgex for å finne karakterer: Her må endringer til. 
                const regex = /\s*([1-6])\s*-\s*(?:EN|TO|TRE|FIRE|FEM|SEKS|en|to|tre|fire|fem|seks)\s*/g;
                const regex2 = /\s+([1-6])\s+/g;
                let match;
                const numbers: number[] = [];
                
                if (app.ocrText.includes("visma")) {
                    console.log(app.ocrText);
                    const gammelStreng = app.ocrText;;
                    const startTekst = "ungdomsskole";
                    const sluttTekst = "VISMA";
                    // Finn start- og sluttposisjoner
                    const startPosisjon = gammelStreng.indexOf(startTekst) + startTekst.length;
                    const sluttPosisjon = gammelStreng.indexOf(sluttTekst, startPosisjon);
                    const nyStreng = startPosisjon > startTekst.length && sluttPosisjon > startPosisjon
                        ? gammelStreng.substring(startPosisjon, sluttPosisjon).trim()
                        : "";
                
                    while ((match = regex2.exec(nyStreng)) !== null) {
                        numbers.push(parseInt(match[1], 10));        
                    }
                } else {
                    while ((match = regex.exec(app.ocrText)) !== null) {
                        numbers.push(parseInt(match[1], 10));
                    }
                }
                const gjennomsnitt = 
                    numbers.length > 0 
                        ? (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2)
                        : "Ingen tall funnet";
                let numbersString: string = "";
                let count: number = 0;
                numbers.forEach(number => {
                    count++;
                    numbersString += number;
                    if (count < numbers.length) numbersString += " - ";
                });
                const muligSuksess = numbers.length > 10 && numbers.length < 15;
                const antallKarakterer = numbers.length;
                return { ...app, gjennomsnitt, numbersString, antallKarakterer, muligSuksess};
            })
            setApplications(processedApplications);
        } catch (err) {
            setError((err as Error).message);
        }


    };

    return (
        <div>
            <div className="flex flex-row w-full gap-8 justify-between items-center">
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
                <table ref={tbl} className="table-auto w-full mt-8 text-xl p-4 bg-slate-800 rounded-xl">
                    <thead>
                        <tr className="bg-slate-400-100">
                            <th className="border px-4 py-2">Navn</th>
                            <th className="border px-4 py-2">E-post</th>
                            <th className="border px-4 py-2">Telefon</th>
                            <th className="border px-4 py-2">1. Prioritet</th>
                            <th className="border px-4 py-2">Filnavn</th>
                            <th className="border px-4 py-2">Søkt dato</th>
                            <th className="border px-4 py-2">Snitt</th>
                            <th className="border px-4 py-2">Karakterer</th>
                            <th className="border px-4 py-2">Antall Karakterer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app._id} className="">
                                <td className="border px-4 py-2">{app.name}</td>
                                <td className="border px-4 py-2">{app.email}</td>
                                <td className="border px-4 py-2">{app.phone}</td>
                                <td className="border px-4 py-2">{app.priority1}</td>
                                <td className="border px-4 py-2 text-xs max-w-44 h-auto break-words"><a href={app.filename}>{app.filename}</a></td>
                                <td className="border px-4 py-2">{app.createdAt.slice(0, 10)}</td>
                                <td className="border px-4 py-2">{app.muligSuksess ? app.gjennomsnitt : "feilet"}</td>
                                <td className="border px-4 py-2">{app.numbersString}</td>
                                <td className="border px-4 py-2">{app.antallKarakterer}</td>
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
