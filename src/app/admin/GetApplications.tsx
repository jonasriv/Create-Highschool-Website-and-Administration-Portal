import { useState, useRef, useEffect, useCallback } from "react";
import { utils, writeFileXLSX } from "xlsx";
import React, { ChangeEvent } from "react";
import { format } from "date-fns"
import { CalendarIcon, ImageDown, Download, Repeat, Play, Pencil, X } from "lucide-react"
 
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
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [openTo, setOpenTo] = React.useState(false);
    const [openFrom, setOpenFrom] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [useFilter, setUseFilter] = useState<boolean>(false);
    const [editingApplication, setEditingApplication] = useState<Application | null>(null);
    const [editedFields, setEditedFields] = useState<Record<string, string>>({
        name: "",
        email: "",
        emailParent: "",
        phone: "",
    });
    const [hidingTreatedApps, setHidingTreatedApps] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<Application['_id'] | null>(null);
    
    const fetchApplications = useCallback(async () => {
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

            if (date) {
                const fromDate = new Date(date);
                const toDate = secondDate ? new Date(secondDate) : new Date();
            
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
    }, [token, date, secondDate]);

    const handleCheckboxChange = async (e: ChangeEvent<HTMLInputElement>, app: Application) => {
        setIsChecking(app._id);
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
                setIsChecking(null);
            }
    
            // Oppdater listen med applikasjoner med ny behandlet-verdi
            const updatedApplications = applications.map((application) => {
                if (application._id === app._id) {
                    return { ...application, behandlet: updatedBehandlet };
                }
                return application;
            });
    
            setApplications(updatedApplications);
            setIsChecking(null);
    
        } catch (err) {
            console.error('Error updating application:', err);
            setIsChecking(null);
        }
        
    };

    const handleApplicationChange = async (e: ChangeEvent<HTMLInputElement>, app: Application, field: string) => {
        const value = e.target.value;
        try {
            const response = await fetch(`/api/applications/${app._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ [field]: value }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update application');
            }
    
        // Oppdater listen med applikasjoner med riktig felt
        setApplications((prevApplications) =>
            prevApplications.map((application) =>
                application._id === app._id
                    ? { ...application, [field]: value }
                    : application
            )
        );
    
        } catch (err) {
            console.error('Error updating application:', err);
        }
    };

    const handleRemoveFromdate = async () => {
        setDate(undefined);
        setSecondDate(undefined);      
    }

    useEffect(() => {
        fetchApplications();
    }, [date, secondDate, fetchApplications]);

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

    const handleFilterApplications = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        setUseFilter(true);
    };

    const hideTreatedApps = () => {
        setHidingTreatedApps((prev) => !prev);
    };
    

    const filteredApplications = useFilter 
        ? 
            applications.filter((app) => 
                app.name.toLowerCase().includes(searchTerm) ||
                app.email.toLowerCase().includes(searchTerm) ||
                app.emailParent.toLowerCase().includes(searchTerm) ||
                app.phone.includes(searchTerm)
            ) 
            
        : 
        applications;

        const displayApplications = hidingTreatedApps 
        ? filteredApplications.filter((app) => app.behandlet === 0)  // Behold kun ubehandlede
        : filteredApplications;

    return (
        <div className="flex flex-col w-full min-h-screen justify-start items-start">
            <div className="flex flex-row w-full h-full gap-8 justify-center items-center">
                <div className="w-full mx-8 flex flex-row items-center justify-between">    
                    <div className="flex flex-row gap-8">
                        <Popover open={openFrom} onOpenChange={setOpenFrom}>
                            <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] flex flex-row justify-between text-left text-black font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <span className="flex flex-row">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Fra-dato</span>}
                                        </span>
                                    </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        setOpenFrom(false);
                                    }}
                                    initialFocus
                                />
                                
                            </PopoverContent>
                        </Popover>
                        <Popover open={openTo} onOpenChange={setOpenTo}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-between flex flex-row text-left text-black font-normal",
                                        !secondDate && "text-muted-foreground"
                                    )}
                                >
                                    <span className="flex flex-row">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {secondDate ? format(secondDate, "PPP") : <span>Til-dato</span>}
                                    </span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={secondDate}
                                    onSelect={(selectedDate) => {
                                        setSecondDate(selectedDate);
                                        setOpenTo(false);
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>   

                        {showDateFrom !== "" &&                         
                                <div className="p-[2px] flex justify-center items-center rounded-xl text-lg border-2 border-white w-36 bg-white/10 cursor-pointer hover:bg-white/60 hover:text-black text-center"
                                     onClick={handleRemoveFromdate}
                                >
                                    Nullstill datoer
                                </div>
                            }                                 
                    </div>

                    <div className="flex flex-row gap-8">
                        {isFetching && 
                            
                                <div className="w-8 h-8 border-b-4 border-t-4 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div>
                            
                        }
                        <button
                            className="p-[2px] flex justify-center items-center rounded-xl text-lg border-2 border-white w-52 bg-white/20 cursor-pointer hover:bg-blue-400"
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
                            <button className="p-[2px] flex justify-center items-center rounded-xl text-lg border-2 border-white w-52 bg-white/20 cursor-pointer hover:bg-blue-400" 
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
                            }}><span className="flex items-center justify-between gap-4"><span>Eksporter til excel</span><span><Download/></span></span></button>
                        }
                    </div>
                </div>
            </div>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}

            
            {displayApplications.length > 0 || useFilter ? (
                <div className="flex flex-col w-full overflow-scroll justify-center items-start px-8 pt-8 overflow-y-scroll">
                    
                    {!isFetching && 
                        <div className="w-full flex justify-start items-center">
                            <div className="w-full flex flex-row items-center justify-between gap-8">
                            <div className="flex flex-row gap-4">
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    placeholder="Finn søker..." 
                                    className="p-[6px] text-lg rounded-md w-80 text-black"
                                    onChange={(e) => {handleFilterApplications(e)}}
                                ></input>
                                <div 
                                    className="p-[2px] flex justify-center items-center rounded-xl text-lg border-2 border-white w-64 bg-white/20 cursor-pointer hover:bg-blue-400"
                                    onClick={hideTreatedApps}    
                                >
                                    {hidingTreatedApps && <span>Vis behandlede søknader</span>}
                                    {!hidingTreatedApps && <span>Skjul behandlede søknader</span>}
                                </div>
                            </div>
                                <h1 className="text-xl">Antall søknader: {displayApplications.length}</h1>
                            </div>
                        </div>
                    }
                    
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
                                <th className="border-none px-[2px] break-words py-2 text-center flex items-center justify-center"><Pencil size="16"/></th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayApplications.map((app) => (
                                <tr key={app._id} className={app.behandlet === 1 ? 'bg-gray-400 text-gray-600 border border-black' : 'odd:bg-sky-200 even:bg-sky-100 text-black border border-black'}>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.name}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.createdAt.slice(0, 10)}</td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">
                                        {app.email}
                                    </td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">
                                        {app.emailParent}
                                    </td>
                                    <td className="border border-black px-[6px] py-2 max-w-16">
                                        {app.phone}
                                    </td>
                                    <td className="border border-black px-[6px] py-2">{app.priority1}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.priority2}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-24">{app.priority3}</td>
                                    <td className="border border-black px-[6px] py-2 break-words max-w-16">{app.opptaksprove}</td>
                                    <td className="border border-black text-center py-0 text-xs h-auto">
                                        {app.s3FileUrl ? (
                                        <div className="w-full h-full flex justify-center items-center">
                                            <a href={app.s3FileUrl} target="_blank" rel="noopener noreferrer">
                                                <ImageDown size="32" color={app.behandlet === 1 ? 'gray' : 'purple'} className="bg-transparent p-[2px] rounded-lg hover:bg-blue-400"/>
                                            </a>
                                        </div>    
                                        ) : (
                                            <span>Ingen fil</span>
                                        )}
                                    </td>
                                    <td className="text-center border-none ">
                                        
                                            {
                                            app.textractAnalysis === "feilet" ? (
                                                <span className="flex flex-col items-center justify-start h-full w-full">
                                                    <p className="text-red-700 font-mina">Feilet</p>
                                                    <button 
                                                        className="bg-orange-500 text-center text-[10px] p-[5px] flex justify-center items-center text-black rounded-sm hover:bg-orange-400"
                                                        onClick={(e) => handleTextract(e, app)}
                                                        disabled={app.behandlet === 1}
                                                        style={{
                                                            backgroundColor: app.behandlet === 1 ? 'grey' : '',
                                                        }}                                                        
                                                    > 
                                                        <Repeat size="12"/>
                                                    </button>                                                
                                                </span>

                                            ) : app.textractAnalysis && app.textractAnalysis.length > 10 ? (
                                                <span className="flex flex-col items-center justify-center ">
                                                    <p className="text-green-700 text-xs font-mina">KJØRT</p>
                                                    <button 
                                                        className={` text-center text-[10px] p-[5px] flex justify-center items-center text-black rounded-sm hover:bg-orange-400 ${app.behandlet === 1 || isLoading ? 'bg-gray-400 cursor-not-allowed pointer-events-none' : 'bg-orange-500'}`}
                                                        onClick={(e) => handleTextract(e, app)}
                                                        disabled={app.behandlet === 1}
                                                        style={{
                                                            backgroundColor: app.behandlet === 1 ? 'grey' : '',
                                                        }}                                                        
                                                    > 
                                                        <Repeat size="12"/>
                                                    </button>                                                
                                                </span>
                                                
                                            ) : isLoading === app._id ? (
                                                //<p className="text-orange-800 bg-blue-400 p-2 rounded-sm">Kjører...</p>
                                                <div className="w-full h-full flex justify-center items-center"> 
                                                    <div className="mt-[2px] w-6 h-6 border-b-4 border-t-4 border-pinky border-t-blue-500  rounded-2xl animate-spin-fast"></div>
                                                </div>
                                            ) : app.textractAnalysis === "" && isLoading !== app._id ? (
                                                <button 
                                                    className={`bg-blue-500 p-2 text-center text-xs font-bold text-black rounded-full hover:bg-blue-400 ${app.behandlet === 1 || isLoading ? 'bg-gray-400 text-gray-600 cursor-not-allowed pointer-events-none' : 'bg-blue-500 text-white hover:bg-blue-400'}`}
                                                    onClick={(e) => handleTextract(e, app)}
                                                    style={{
                                                        backgroundColor: app.behandlet === 1 || isLoading ? 'grey' : '',
                                                    }}
                                                > 
                                                    <Play size="20" color="white"/>
                                                </button>
                                            ) : null
                                            }
                                        
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
                                        <div className="w-full flex items-center justify-center">
                                            <label className="relative flex cursor-pointer items-center">
                                                {/* Skjult checkbox */}
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer"
                                                    checked={app.behandlet === 1} 
                                                    onChange={(e) => handleCheckboxChange(e, app)} 
                                                />
                                                {/* Ytre div (bakgrunn) */}
                                                <div className="w-10 h-5 bg-gray-300 peer-checked:bg-gray-500 rounded-full transition-all duration-300"></div>
                                                {/* Indre div (sirkelen) */}
                                                <div className={`w-4 h-4 bg-white absolute top-0.5 left-0.5 ${isChecking === app._id ? 'translate-x-[0.625rem]' : ''} peer-checked:translate-x-5 rounded-full transition-all duration-300 shadow-md`}></div>
                                            </label>
                                        </div>  
                                    </td>

                                    <td className="flex h-16 w-full justify-center items-center border-none">
                                        <div className="w-full h-full flex justify-center items-center ">
                                            <button
                                                onClick={() => {
                                                    setEditingApplication(app);
                                                    setEditedFields({
                                                        name: app.name,
                                                        email: app.email,
                                                        emailParent: app.emailParent,
                                                        phone: app.phone,
                                                        opptaksprove: app.opptaksprove,
                                                        priority1: app.priority1,
                                                        priority2: app.priority2,
                                                        priority3: app.priority3,
                                                    });
                                                }}
                                                disabled={app.behandlet === 1}
                                                className="bg-blue-500 p-2 rounded-full flex flex-row justify-center items-center hover:bg-blue-400"
                                                style={{
                                                    backgroundColor: app.behandlet === 1 ? 'gray' : '',
                                                }}
                                            >
                                                <Pencil size="18" color="white"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {editingApplication && (
                        <div className="fixed inset-0 flex items-center justify-center bg-white/40 z-50">
                            <div className="bg-black/80 p-6 rounded-lg shadow-lg z-60 flex flex-col text-white font-bold">
                                <div className="flex flex-row justify-between items-center">
                                    <h2 className="text-xl">Endre søknad</h2>
                                    <div className="rounded-full bg-transparent p-2 hover:bg-white/60"
                                        onClick={() => setEditingApplication(null)}
                                    >
                                        <X/>
                                    </div>
                                </div>
                                <form
                                    className="flex flex-col w-96 mt-8"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        Object.keys(editedFields).forEach((field) => {
                                            handleApplicationChange(
                                                { target: { value: editedFields[field] } } as ChangeEvent<HTMLInputElement>,
                                                editingApplication,
                                                field
                                            );
                                        });
                                        setEditingApplication(null);
                                    }}
                                >
                                    <label>Navn:</label>
                                    <input
                                        type="text"
                                        value={editedFields.name}
                                        onChange={(e) => setEditedFields({ ...editedFields, name: e.target.value })}
                                        className="mb-4 rounded-md mt-2 h-8 text-black text-sm font-normal p-2"
                                    />
                                    <label>E-post:</label>
                                    <input
                                        type="email"
                                        value={editedFields.email}
                                        onChange={(e) => setEditedFields({ ...editedFields, email: e.target.value })}
                                        className="mb-4 rounded-md mt-2 h-8 text-black text-sm font-normal p-2"
                                    />
                                    <label>E-post foresatt:</label>
                                    <input
                                        type="email"
                                        value={editedFields.emailParent}
                                        onChange={(e) => setEditedFields({ ...editedFields, emailParent: e.target.value })}
                                        className="mb-4 rounded-md mt-2 h-8 text-black text-sm font-normal p-2"
                                    />                                    
                                    <label>Phone:</label>
                                    <input
                                        type="tel"
                                        value={editedFields.phone}
                                        onChange={(e) => setEditedFields({ ...editedFields, phone: e.target.value })}
                                        className="mb-4 rounded-md mt-2 h-8 text-black text-sm font-normal p-2"
                                    />
                                    <label>Opptaksprøve?</label>
                                    <select
                                        id="opptaksprove"
                                        name="opptaksprove"
                                        value={editedFields.opptaksprove}
                                        onChange={(e) => setEditedFields({ ...editedFields, opptaksprove: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md text-slate-700 font-normal mt-2 mb-2" 
                                    >
                                        <option value="ja">Ja</option>
                                        <option value="nei">Nei</option>
                                    </select>                                    
                                    <label>Pri 1:</label>
                                    <select
                                        id="prority1"
                                        name="prority1"
                                        value={editedFields.priority1}
                                        onChange={(e) => setEditedFields({ ...editedFields, priority1: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md text-slate-700 font-normal mt-2 mb-2" 
                                    >
                                        <option value="" disabled>Velg</option>
                                        <option value="musikk">Musikk</option>
                                        <option value="dans">Dans</option>
                                        <option value="drama">Drama</option>
                                    </select>
                                    <label>Pri 2:</label>
                                    <select
                                        id="prority2"
                                        name="prority2"
                                        value={editedFields.priority2}
                                        onChange={(e) => setEditedFields({ ...editedFields, priority2: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md text-slate-700 font-normal mt-2 mb-2" 
                                    >
                                        <option value="" disabled>Velg</option>
                                        <option value="musikk">Musikk</option>
                                        <option value="dans">Dans</option>
                                        <option value="drama">Drama</option>
                                        <option value="onsker_ikke_2">Ønsker ikke andrevalg</option>
                                    </select>     
                                    <label>Pri 3:</label>
                                    <select
                                        id="prority3"
                                        name="prority3"
                                        value={editedFields.priority3}
                                        onChange={(e) => setEditedFields({ ...editedFields, priority3: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded-md text-slate-700 font-normal mt-2 mb-2" 
                                    >
                                        <option value="" disabled>Velg</option>
                                        <option value="musikk">Musikk</option>
                                        <option value="dans">Dans</option>
                                        <option value="drama">Drama</option>
                                        <option value="onsker_ikke_2">Ønsker ikke tredjevalg</option>
                                    </select>      

                                    <div className="flex flex-row justify-between items-center mt-4">
                                        <button className="bg-blue-500 rounded-md p-2" type="submit">Lagre</button>
                                        <button className="bg-red-500 rounded-md p-2" type="button" onClick={() => setEditingApplication(null)}>
                                            Avbryt
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    </div>
                </div>
            ) : (
                <div className="w-full">{pressedButton && (isFetching ? <div className="w-full h-full bg-flex justify-center items-center"><div className="mt-24 w-24 h-24 border-b-6 border-t-6 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div></div> : <p className="text-center">Ingen søknader funnet.</p>)}</div>
            )}
        </div>
    );
};

export default GetApplications;
