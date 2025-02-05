import { useState, useRef } from "react";
import { utils, writeFileXLSX } from "xlsx";
import React, { ChangeEvent } from "react";
import { format } from "date-fns"
import { CalendarIcon, ImageDown, Download, Repeat, CirclePlay } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface GetApplicationsProps {
    token: string;
}

interface Application {
    _id: string;
    name: string;
    email: string;
    emailParent: string;
    phone: string;
    priority1: string;
    priority2: string;
    priority3: string;
    opptaksprove: string,
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
    const [isLoading, setIsLoading] = useState<string>("");
    const [date, setDate] = React.useState<Date>();
    const [secondDate, setSecondDate] = React.useState<Date>();
    const [showDateFrom, setShowDateFrom] = useState<string>("");
    const [showDateTo, setShowDateTo] = useState<string>("");
    const [isFetching, setIsFetching] = useState<boolean>(false);
    
    const fetchApplications = async () => {
        setIsFetching(true);
        setPressedButton(false);
        setApplications([]);
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
            
            let applications = data.applications.map((app: Application) => ({
                ...app, 
                s3FileUrl: app.s3FileUrl || null,
            }));

            if (date && secondDate) {
                const fromDate = new Date(date);
                const toDate = new Date(secondDate);
            
                const fromAdaptedYear = fromDate.getFullYear();
                const fromAdaptedMonth = (fromDate.getMonth() + 1).toString().padStart(2, '0'); // Ensures two-digit month
                const fromAdaptedDay = fromDate.getDate().toString().padStart(2, '0'); // Ensures two-digit day
                const fromAdaptedDate = `${fromAdaptedYear}${fromAdaptedMonth}${fromAdaptedDay}`; // Format: YYYYMMDD
            
                const toAdaptedYear = toDate.getFullYear();
                const toAdaptedMonth = (toDate.getMonth() + 1).toString().padStart(2, '0'); // Ensures two-digit month
                const toAdaptedDay = toDate.getDate().toString().padStart(2, '0'); // Ensures two-digit day
                const toAdaptedDate = `${toAdaptedYear}${toAdaptedMonth}${toAdaptedDay}`; // Format: YYYYMMDD
            
                applications = applications.filter((app: Application) => {
                    const appDate = new Date(app.createdAt);
                    const appAdaptedYear = appDate.getFullYear();
                    const appAdaptedMonth = (appDate.getMonth() + 1).toString().padStart(2, '0'); // Ensures two-digit month
                    const appAdaptedDay = appDate.getDate().toString().padStart(2, '0'); // Ensures two-digit day
                    const appAdaptedDate = `${appAdaptedYear}${appAdaptedMonth}${appAdaptedDay}`; // Format: YYYYMMDD
            
                    setShowDateFrom(`${appAdaptedYear}-${appAdaptedMonth}-${appAdaptedDay}`); // Formatting to YYYY-MM-DD for display
                    setShowDateTo(`${toAdaptedYear}-${toAdaptedMonth}-${toAdaptedDay}`); // Formatting to YYYY-MM-DD for display
                    
                    return appAdaptedDate >= fromAdaptedDate && appAdaptedDate <= toAdaptedDate;
                });
            }
            applications.sort((a: Application, b: Application) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
            
                // Sjekk om begge datoene er gyldige
                if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                    console.error("Invalid date format for application:", a.createdAt, b.createdAt);
                    return 0;
                }
            
                // Sorter etter tid (nyeste først)
                return dateB.getTime() - dateA.getTime();
            });

            // Iterer gjennom hver applikasjon og prosesser Textract-resultatet
            applications.forEach((app: Application) => {
                if (app.textractAnalysis) {
                    if (app.textractAnalysis === "" || app.textractAnalysis === "feilet") {
                        app.gjennomsnitt = 0;
                    } else {
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
                            
                            if (karakterer.length > 0 && karakterer.length < 100) {
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
                }
            });

            setApplications(applications);
        } catch (err) {
            setError((err as Error).message);
        }
        setIsFetching(false);
    };

    const handleCheckboxChange = async (e: ChangeEvent<HTMLInputElement>, app: Application) => {
        const checked = e.target.checked;
        const updatedBehandlet = checked ? 1 : 0; // Sett behandlet til 1 hvis checked, ellers 0
        
        try {
            const response = await fetch(`/api/applications/${app._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ behandlet: updatedBehandlet }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update application');
            }
    
            // Oppdater listen med applikasjoner med ny behandlet-verdi
            const updatedApplications = applications.map((application) => {
                if (application._id === app._id) {
                    return { ...application, behandlet: updatedBehandlet };
                }
                return application;
            });
    
            setApplications(updatedApplications);
    
        } catch (err) {
            console.error('Error updating application:', err);
        }
    };
    
    const handleTextract = async (e: React.MouseEvent<HTMLButtonElement>, app: Application) => {
        const sentFilename: string = app.filename;
        app.textractAnalysis = "";
        
        try {
            // Start loading state
            setIsLoading(app._id);
    
            const response = await fetch(`/api/applications/${app._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ fileKey: sentFilename }),
            });
    
            if (!response.ok) {
                const responseData = await response.json(); // Hent serverens feilmelding
                throw new Error(responseData.message || 'Textract mislyktes');
            }

            fetchApplications();

            console.log('Textract analyse fullført og dataene er oppdatert.');
        } catch (err) {
            console.error('Mislyktes:', err);
        } finally {
            // Slutt loading state
            setIsLoading("");
        }
    };
       

    return (
        <div className="flex flex-col w-full min-h-screen justify-start items-start">
            <div className="flex flex-row w-full h-full gap-8 justify-center ml-8 items-center">
            <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left text-black font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>FRA-DATO</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[280px] justify-start text-left text-black font-normal",
                                !secondDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {secondDate ? format(secondDate, "PPP") : <span>TIL-DATO</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={secondDate}
                            onSelect={setSecondDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>            
                <button
                    className="p-[2px] flex justify-center items-center rounded-xl text-lg border-2 border-white w-52 bg-pinky cursor-pointer hover:bg-fuchsia-950"
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
                    <button className="p-[2px] flex justify-center items-center rounded-xl text-lg border-2 border-white w-64 bg-pinky cursor-pointer hover:bg-fuchsia-950" 
                    onClick={() => {
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
                    }}>Eksporter til excel <Download/></button>
}
            </div>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {applications.length > 0 ? (
                <div className="flex flex-col w-full overflow-scroll justify-center items-start px-8 pt-8">
                    <h1 className="w-full text-center">Antall søknader: {applications.length}</h1>
                    {showDateFrom !== "" && <p className="w-full text-center">Viser søknader fra {showDateFrom} til {showDateTo} (YYYY-MM-DD)</p>}
                    <div className="flex w-full justify-center"> 
                        <table ref={tbl} className="table-auto w-full mt-8 text-sm p-4 bg-slate-800 rounded-xl max-w-screen-3xl overflow-scroll border border-black border-collapse">
                        <thead className="bg-slate-600">
                            <tr className="bg-slate-400-100 border border-black">
                                <th className="border border-black px-[2px] break-words py-2">Navn</th>
                                <th className="border border-black px-[2px] text-xs break-words py-2">Søkt dato <span className="text-xs">(Y-M-D)</span></th>
                                <th className="border border-black px-[2px] break-words py-2">E-post</th>
                                <th className="border border-black px-[2px] break-words py-2">E-post foresatt</th>
                                <th className="border border-black px-[2px] break-words py-2">TLF</th>
                                <th className="border border-black px-[2px] break-words py-2">1. Pri</th>
                                <th className="border border-black px-[2px] break-words py-2">2. Pri</th>
                                <th className="border border-black px-[2px] break-words py-2">3. Pri</th>
                                <th className="border border-black px-[2px] break-words py-2 max-w-16">Prøve?</th>
                                <th className="border border-black px-[2px] break-words py-2">Bilde</th>
                                <th className="border border-black px-[2px] break-words py-2">Analyse</th>
                                <th className="border border-black px-[2px] break-words py-2">Snitt</th>
                                <th className="border border-black px-[2px] break-words py-2">Ant. karakterer</th>
                                <th className="border border-black px-[2px] break-words py-2">Karakter-sett</th>
                                <th className="border border-black px-[2px] break-words py-2">Behandlet?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} className={app.behandlet === 1 ? 'bg-green-200 text-gray-600 border border-black' : 'odd:bg-slate-200 even:bg-slate-100 text-black border border-black'}>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.name}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.createdAt.slice(0, 10)}</td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">{app.email}</td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">{app.emailParent}</td>
                                    <td className="border border-black px-[6px] py-2 max-w-16">{app.phone}</td>
                                    <td className="border border-black px-[6px] py-2">{app.priority1}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.priority2}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.priority3}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-16">{app.opptaksprove}</td>
                                    <td className="border border-black text-center py-0 text-xs h-auto">
                                        {app.s3FileUrl ? (
                                        <div className="w-full h-full flex justify-center items-center">
                                            <a href={app.s3FileUrl} target="_blank" rel="noopener noreferrer">
                                                <ImageDown size="24" color="blue" className="bg-transparent p-[1px] rounded-lg hover:bg-blue-400"/>
                                            </a>
                                        </div>    
                                        ) : (
                                            <span>Ingen fil</span>
                                        )}
                                        </td>
                                    <td className="border border-black px-[2px] text-center flex items-center justify-center h-full w-full border-none py-2">
                                    {
                                        app.textractAnalysis === "feilet" ? (
                                            <span className="flex flex-col items-center justify-start h-full w-full">
                                                <p className="text-red-700 font-mina">Feilet</p>
                                                <button 
                                                    className="bg-orange-500 text-center text-[10px] p-[5px] flex justify-center items-center text-black rounded-sm hover:bg-orange-400"
                                                    onClick={(e) => handleTextract(e, app)}
                                                > 
                                                    <Repeat size="12"/>
                                                </button>                                                
                                            </span>

                                        ) : app.textractAnalysis && app.textractAnalysis.length > 10 ? (
                                            <span className="flex flex-col items-center justify-start h-full w-full">
                                                <p className="text-green-700 text-xs font-mina">KJØRT</p>
                                                <button 
                                                    className="bg-orange-500 text-center text-[10px] p-[5px] flex justify-center items-center text-black rounded-sm hover:bg-orange-400"
                                                    onClick={(e) => handleTextract(e, app)}
                                                > 
                                                    <Repeat size="12"/>
                                                </button>                                                
                                            </span>
                                            
                                        ) : isLoading === app._id ? (
                                            //<p className="text-orange-800 bg-blue-400 p-2 rounded-sm">Kjører...</p>
                                            <div className="mt-[2px] w-6 h-6 border-b-4 border-t-4 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div>
                                        ) : app.textractAnalysis === "" && isLoading !== app._id ? (
                                            <button 
                                                className="bg-blue-500 p-[4px] text-center text-xs font-bold text-black rounded-md hover:bg-blue-400"
                                                onClick={(e) => handleTextract(e, app)}
                                            > 
                                                <CirclePlay size="20" color="white"/>
                                            </button>
                                        ) : null}
                                    </td>
                                    <td className="border border-black px-[6px] py-2">
                                        {app.antallKarakterer && app.antallKarakterer > 11 && app.antallKarakterer < 15 ? 
                                            (
                                                <span className="text-green-700">{app.gjennomsnitt?.toString().substring(0, 7)}</span>
                                            ) 
                                        : (
                                            app.antallKarakterer ? 
                                            <span className="flex flex-row items-center justify-between"><span className="text-red-700">{app.gjennomsnitt?.toString().substring(0, 7)}</span></span>
                                            : ""
                                        )}
                                    </td>                                    
                                    <td className="border border-black px-[6px] py-2">
                                        {app.antallKarakterer && app.antallKarakterer > 11 && app.antallKarakterer < 15 ? 
                                            (
                                                <span className="text-green-700">{app.antallKarakterer}</span>
                                            ) 
                                        : (
                                            app.antallKarakterer ? 
                                            <span className="flex flex-row items-center justify-between"><span className="text-red-700">{app.antallKarakterer}</span><span className="text-end right-0 text-red-700"> *sjekk bilde</span></span>
                                            : ""
                                        )}
                                    </td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-2">{app.karaktersett}</td>
                                    <td className="border border-black px-[2px] text-center py-2 break-words">
                                        {
                                             <span className="flex justify-around items-center">
                                             <input 
                                             type="checkbox" 
                                             checked={app.behandlet === 1} 
                                             onChange={(e) => handleCheckboxChange(e, app)} // Hvis du trenger å håndtere endringer
                                           />
                                           {
                                                <span className="">{app.behandlet === 1 ? "(ja)" : "(nei)"}</span>
                                            }
                                           </span>
                                           
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            ) : (
                <div className="w-full">{pressedButton && (isFetching ? <div className="w-full h-52 flex justify-center items-center"><div className="mt-24 w-24 h-24 border-b-6 border-t-6 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div></div> : <p className="text-center">Ingen søknader funnet.</p>)}</div>
            )}
        </div>
    );
};

export default GetApplications;
