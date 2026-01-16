import { useState, useRef, useEffect, useCallback } from "react";
import { utils, writeFileXLSX } from "xlsx";
import React, { ChangeEvent } from "react";
import { format } from "date-fns"
import { CalendarIcon, ImageDown, Download, Repeat, Play, Pencil, X, RefreshCw, Save, MessageCircleMore, Trash } from "lucide-react"

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
    logg?: string,
    hovedinstrument?: string,
    skoleaar?: string,
    fakturaepost?: string;
    fakturanavn?: string;
    fakturagateadresse?: string;
    fakturapostnummer?: string;
    fakturapoststed?: string;
    fakturaland?: string;       
    leie_mac?: string;       
}

const GetApplications: React.FC<GetApplicationsProps> = ({ token }) => {
    const tbl = useRef(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState<string | null>(null);
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
    const [deletingApplication, setDeletingApplication] = useState<Application | null>(null);
    const [editedFields, setEditedFields] = useState<Record<string, string>>({
        name: "",
        email: "",
        emailParent: "",
        phone: "",
    });
    const [hidingTreatedApps, setHidingTreatedApps] = useState<boolean>(false);
    const [isChecking, setIsChecking] = useState<Application['_id'] | null>(null);
    const [isAddingGrades, setIsAddingGrades] = useState<Application['_id'] | null>(null);
    const [addedGrades, setAddedGrades] = useState<string | null>("");
    const [isLogging, setIsLogging] = useState<Application['_id'] | null>(null);
    const [isAverage, setIsAverage] = useState<boolean>(false);
    const [isDateSorted, setIsDateSorted] = useState<boolean>(false);
    const [addedLog, setAddedLog] = useState<string | null>("");
    
    const fetchApplications = useCallback(async () => {
        setIsFetching(true);
        setApplications([]);
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
                setIsChecking(null);
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

    const handleDeleteApplication = async () => {
        if (!deletingApplication) {
            alert("Ingen søknad er valgt");
            return;
        }
        const ok = window.confirm("Slette søknaden til " + deletingApplication.name + " permanent? Opplastet vedlegg slettes også");
        if (!ok) {
            setDeletingApplication(null);
            return;
        } 
        const deleteMe = deletingApplication._id;
        
        try {
            const res = await fetch(`/api/applications/${deleteMe}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(data?.error || data?.message || "Kunne ikke slette søknaden");
            }    
            
            setApplications((prev) => prev.filter((a) => a._id !== deleteMe));
            setDeletingApplication(null)
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Noe gikk galt");
        }
    };

    const handleGradesRegister = async (e: React.MouseEvent<HTMLButtonElement>, app: Application) => {
        e.preventDefault();
        const field = 'textractAnalysis';
        if (addedGrades && isAddingGrades === app._id) {
            const originalValue = addedGrades;
            const value = originalValue 
            ? JSON.stringify([...originalValue.split(""), "manueltregistrert"])
                : "";
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

                setIsAddingGrades(null);
                setAddedGrades("");
                await fetchApplications(); // Kjører etter at oppdatering er bekreftet
            } catch (err) {
                console.error('Error updating application:', err);
            }
        }
    };

    const handleLogRegister = async (e: React.MouseEvent<HTMLButtonElement>, app: Application) => {
        e.preventDefault();
        const field = 'logg';
        const today = new Date();
        const logDate = today.getFullYear() + (today.getMonth() +1).toString().padStart(2, '0') + today.getDate().toString().padStart(2, '0');
        const newLog = addedLog ? app.logg ? app.logg + "_loggpause_" + logDate + addedLog : logDate + addedLog : null;
        
        if (addedLog && isLogging === app._id) {
            try {
                console.log("Sending log:", addedLog);  // Logg før sending
                const response = await fetch(`/api/applications/${app._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ [field]: newLog }),  // Send logg som newLog
                });
    
                const data = await response.json();
                if (data) console.log("data");
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Feil ved oppdatering:", errorText);
                    throw new Error(`Failed to update application: ${errorText}`);
                }
    
                setIsLogging(null);
                setAddedLog("");
                await fetchApplications();
                console.log("Oppdatering fullført!");
            } catch (err) {
                console.error('Error updating application log:', err);
                alert("Noe feil!");
            }
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
                app.priority1.toLowerCase().includes(searchTerm) ||
                app.phone.includes(searchTerm)
            ) 
            
        : 
        applications;

        const displayApplications = hidingTreatedApps 
        ? filteredApplications.filter((app) => app.behandlet === 0)  // Behold kun ubehandlede
        : filteredApplications;

    const handleSortAverage = () => {
        setIsAverage(!isAverage);
        setIsDateSorted(false);
        let sortedApps = filteredApplications;
        if(!isAverage) {
            sortedApps = [...filteredApplications].sort((a, b) => (b.gjennomsnitt || 0) - (a.gjennomsnitt || 0));
        } else {
            sortedApps = [...filteredApplications].sort((a, b) => (a.gjennomsnitt || 0) - (b.gjennomsnitt || 0));
        }
        setApplications(sortedApps);
    };

    const handleSortDate = () => {
        setIsDateSorted(!isDateSorted);
        setIsAverage(false);  // Resetter gjennomsnittssortering
        const sortedApps = [...filteredApplications].sort((a, b) => {
            const dateA = new Date(a.createdAt.slice(0, 10));
            const dateB = new Date(b.createdAt.slice(0, 10));
    
            if (!isDateSorted) {
                return dateB.getTime() - dateA.getTime();  // Nyeste først
            } else {
                return dateA.getTime() - dateB.getTime();  // Eldste først
            }
        });
    
        setApplications(sortedApps);
    };
    
    


    return (
        <div className="flex flex-col w-full min-h-screen justify-start h-auto items-start overflow-auto">
            <div className="flex flex-row w-full h-full gap-8 justify-center items-center">
                <div className="w-full md:mx-8 flex flex-row items-center justify-between">    
                    <div className="hidden md:flex flex-row gap-8">
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
                                <div className="p-[2px] flex justify-center bg-white/20 items-center rounded-xl text-lg border-2 border-white w-36 cursor-pointer hover:bg-white/10 text-center"
                                    onClick={handleRemoveFromdate}
                                >
                                    Nullstill datoer
                                </div>
                            }                                 
                    </div>

                    <div className="flex flex-row gap-8">
                        {isFetching && 
                                <div className="hidden md:block w-8 h-8 border-b-4 border-t-4 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div>
                        }
                        <button
                            className="hidden md:flex p-[2px] justify-center items-center rounded-xl text-lg border-2 border-white w-auto md:w-52 bg-white/20 cursor-pointer hover:bg-white/10"
                            onClick={fetchApplications}
                        >
                            <span className="hidden md:inline-block">Oppdater søknader &nbsp;</span><RefreshCw/>
                        </button>
                            <button className="hidden md:flex p-[2px] justify-center items-center rounded-md md:rounded-xl text-lg border-2 border-white w-auto md:w-52 bg-white/20 cursor-pointer hover:bg-white/10" 
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
                            }}><span className="flex items-center justify-between gap-4"><span className="hidden md:inline-block">Eksporter til excel</span><span><Download/></span></span></button>
                        
                        {/*MOBILE MENU*/}
                        <div className="flex md:hidden flex-col h-22">
                            <div className="flex md:hidden flex-row gap-2 mx-2">
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    placeholder="Finn søker..." 
                                    className="p-[2px] text-md rounded-md w-40 text-black"
                                    onChange={(e) => {handleFilterApplications(e)}}
                                ></input>
                                <div 
                                    className="p-[2px] flex justify-center items-center rounded-xl text-md border-2 border-white w-36 bg-white/20 cursor-pointer hover:bg-white/10"
                                    onClick={hideTreatedApps}    
                                >
                                    {hidingTreatedApps && <span>Vis behandlede</span>}
                                    {!hidingTreatedApps && <span>Skjul behandlede</span>}
                                </div>
                                <button
                                    className="flex md:hidden p-2 justify-center items-center rounded-full text-lg border-2 border-white w-auto md:w-52 bg-white/20 cursor-pointer hover:bg-white/10"
                                    onClick={fetchApplications}
                                >
                                    <RefreshCw size="14" color="lightgreen"/>
                                </button>
                            </div>
                            <div className="flex flex-row mt-2 w-full justify-center items-center">
                                <div>
                                    {!isFetching && 
                                        <h1 className="text-xl  md:hidden">Antall søknader: {displayApplications.length}</h1>
                                    }
                                </div>

                            </div>
                        </div>
                        {/* END MOBILE MENU */}
                    </div>
                </div>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="w-full flex justify-start items-center px-8 md:pt-6 mb-4">
                <div className="w-full flex flex-row items-center justify-between gap-8">
                <div className="hidden md:flex flex-row gap-4">
                    <input 
                        type="text" 
                        value={searchTerm}
                        placeholder="Finn søker..." 
                        className="p-[6px] text-lg rounded-md w-80 text-black"
                        onChange={(e) => {handleFilterApplications(e)}}
                    ></input>
                    <div 
                        className="p-[2px] flex justify-center items-center rounded-xl text-lg border-2 border-white w-64 bg-white/20 cursor-pointer hover:bg-white/10"
                        onClick={hideTreatedApps}    
                    >
                        {hidingTreatedApps && <span>Vis behandlede søknader</span>}
                        {!hidingTreatedApps && <span>Skjul behandlede søknader</span>}
                    </div>
                </div>
                {!isFetching && 
                    <h1 className="text-xl hidden md:block">Antall søknader: {displayApplications.length}</h1>
                }
                </div>
            </div>
            
            
            {displayApplications.length > 0 || useFilter ? (
                <div className="flex flex-col w-full overflow-scroll justify-center items-start md:px-8 overflow-y-scroll">

            {/* MOBIL TABLE */}
                    <div className="flex md:hidden w-full justify-center">
                        <table ref={tbl} className="table-auto w-full text-sm bg-slate-800 overflow-scroll border border-black border-collapse">
                            <thead className="bg-slate-600">
                                <tr className="bg-slate-400-100 border border-black">
                                    <th className="border border-black px-[2px] break-words py-2">#</th>
                                    <th className="border border-black px-[2px] break-words py-2">Navn</th>
                                    <th className="border border-black px-[2px] text-xs break-words py-2">Søkt dato</th>
                                    <th className="border border-black px-[2px] break-words py-2">TLF</th>
                                    <th className="border border-black px-[2px] break-words py-2">1. pri</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {displayApplications.map((app) => (
                                <tr key={app._id} className={app.behandlet === 1 ? 'bg-gray-400 text-gray-600 border border-black' : 'odd:bg-sky-200 even:bg-sky-100 text-black border border-black'}>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">{app.name}</td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">{app.createdAt.slice(0, 10)}</td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">{app.email}</td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-24">{app.priority1}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                {/* DESKTOP TABLE */}
                    <div className="hidden md:flex w-full justify-center"> 
                        <table ref={tbl} className="table-auto w-full mt-8 text-sm p-4 bg-slate-800 rounded-xl max-w-screen-3xl overflow-scroll border border-black border-collapse">
                        <thead className="bg-slate-600">
                            <tr className="bg-slate-400-100 border border-black">
                                <th className="border border-black px-[2px] break-words py-2">Navn</th>
                                <th className="border border-black px-[2px] text-xs break-words py-2">
                                    <span onClick={handleSortDate} className="border-[1px] border-slate-400 rounded-lg px-2 py-[2px] bg-slate-700 hover:bg-red-300 cursor-pointer">
                                        Søkt dato <span className="text-xs">(YMD)</span>
                                    </span>
                                    
                                </th>
                                <th className="border border-black px-[2px] break-words py-2">E-post</th>
                                <th className="border border-black px-[2px] break-words py-2">E-post fores.</th>
                                <th className="border border-black px-[2px] break-words py-2">TLF</th>
                                <th className="border border-black px-[2px] break-words py-2">ÅR</th>
                                <th className="border border-black px-[2px] break-words py-2">Faktura</th>
                                <th className="border border-black px-[2px] break-words py-2">Pri 1</th>
                                <th className="border border-black px-[2px] break-words py-2">Pri 2</th>
                                <th className="border border-black px-[2px] break-words py-2">Pri 3</th>
                                <th className="border border-black px-[2px] break-words py-2">Instr</th>
                                <th className="border border-black px-[2px] break-words py-2 max-w-16">Prøve?</th>
                                <th className="border border-black px-[2px] break-words py-2">Bilde</th>
                                <th className="border border-black px-[2px] break-words py-2">Analyse</th>
                                <th className="border border-black px-[2px] break-words py-2">
                                    <span onClick={handleSortAverage} className="border-[1px] border-slate-400 rounded-lg px-2 py-[2px] bg-slate-700 hover:bg-red-300 cursor-pointer">
                                        Snitt
                                    </span>
                                </th>
                                <th className="border border-black px-[2px] break-words py-2">Ant. karakterer</th>
                                <th className="border border-black px-[2px] break-words py-2">Karakterer</th>
                                <th className="border border-black px-[2px] break-words py-2">Logg</th>
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
                                    <td className="border border-black break-words px-[6px] py-2 text-xs max-w-16">
                                        {app.phone}
                                    </td>
                                    <td className="border border-black px-[6px] text-xs py-2">{app.skoleaar}</td>
                                    {/* fakturaadresse */}
                                    <td className="border border-black px-[6px] text-[9px] py-2">
                                        <p>{app.fakturanavn}</p>
                                        <p>{app.fakturaepost}</p>
                                        <p>{app.fakturagateadresse}</p>
                                        <p>{app.fakturapostnummer} {app.fakturapoststed} </p>
                                        <p>{app.fakturaland}</p>
                                    </td>
                                    <td className="border border-black px-[6px] text-xs py-2">{app.priority1}</td>
                                    <td className="border border-black px-[6px] text-xs py-2 break-words max-w-24">{app.priority2}</td>
                                    <td className="border border-black px-[6px] text-xs py-2 break-words max-w-24">{app.priority3}</td>
                                    <td className="border border-black px-[6px] py-2 break-words text-xs max-w-24">{app.hovedinstrument}</td>
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
                                        {app.antallKarakterer && app.antallKarakterer > 11 && app.antallKarakterer < 15 && !app.textractAnalysis?.includes("manueltregistrert")? 
                                            (
                                                <div className="flex flex-row justify-between">
                                                    {app.textractAnalysis && !app.textractAnalysis.includes("manueltregistrert") &&    
                                                    <span className="text-green-700">
                                                        {app.antallKarakterer}
                                                    </span>
                                                    }
                                                    <span className="flex flex-row items-center justify-between">
                                                        <span>
                                                            
                                                            {app.textractAnalysis && app.textractAnalysis.includes("manueltregistrert") && 
                                                            <span>
                                                                <span className="text-red-700">{app.antallKarakterer}</span>
                                                                <span className="text-red-700"> (manuelt oppgitt)</span>
                                                            </span>
                                                            }
                                                        </span>
                                                        <button 
                                                            onClick={(() => setIsAddingGrades(app._id))}
                                                            className="bg-transparent hover:bg-red-400 text-xs p-[4px] rounded-md border-white border-[2px]">
                                                                {app.textractAnalysis && app.textractAnalysis.includes("manueltregistrert") ? <span>Endre</span> : <span>Legg inn manuelt</span>}
                                                        </button>
                                                    </span>
                                                </div>
                                            ) 
                                        : (
                                            app.antallKarakterer ? 
                                                isAddingGrades === app._id ? 
                                                    <span className="flex flex-row w-full justify-end items-center px-[4px] gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Skriv inn karakterene her"
                                                            className="h-8 rounded-md text-black text-xs px-[2px] w-40"
                                                            onChange={((e) => setAddedGrades(e.target.value))}
                                                        >
                                                        
                                                        </input>
                                                        <span className="flex flex-row gap-2">
                                                            <button 
                                                                onClick={((e) => handleGradesRegister(e, app))}
                                                                className=" p-[4px] bg-green-500 hover:bg-green-400 rounded-full"><Save size="16" color="white"/></button>
                                                            <button 
                                                                onClick={(() => setIsAddingGrades(null))}
                                                                className=" p-[4px] bg-red-400 hover:bg-red-500 rounded-full"><X size="16" color="white"/></button>
                                                        </span>
                                                    </span>
                                                : 
                                                    <span className="flex flex-row items-center justify-between">
                                                        <span>
                                                            <span className="text-red-700">{app.antallKarakterer}</span>
                                                            {app.textractAnalysis && app.textractAnalysis.includes("manueltregistrert") && 
                                                            <span className="text-red-700"> (manuelt oppgitt)</span>}
                                                        </span>
                                                        <button 
                                                            onClick={(() => setIsAddingGrades(app._id))}
                                                            className="bg-red-100 hover:bg-red-400 text-xs p-[4px] rounded-md border-white border-[2px]">
                                                                {app.textractAnalysis && app.textractAnalysis.includes("manueltregistrert") ? <span>Endre</span> : <span>Legg inn manuelt</span>}
                                                        </button>
                                                    </span>
                                            : 
                                            isAddingGrades === app._id ? 
                                            <span className="flex flex-row w-full justify-end items-center px-[4px] gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Skriv inn karakterene her"
                                                    className="h-8 rounded-md text-black text-xs px-[2px] w-40"
                                                    onChange={((e) => setAddedGrades(e.target.value))}
                                                >
                                                
                                                </input>
                                                <span className="flex flex-row gap-2">
                                                    <button 
                                                        onClick={((e) => handleGradesRegister(e, app))}
                                                        className=" p-[4px] bg-green-500 hover:bg-green-400 rounded-full"><Save size="16" color="white"/></button>
                                                    <button 
                                                        onClick={(() => setIsAddingGrades(null))}
                                                        className=" p-[4px] bg-red-400 hover:bg-red-500 rounded-full"><X size="16" color="white"/></button>
                                                </span>
                                            </span>
                                        : 
                                            <span className="flex flex-row items-center justify-between">
                                                <span>
                                                    <span className="text-red-700">{app.antallKarakterer}</span>
                                                    {app.textractAnalysis && app.textractAnalysis.includes("manueltregistrert") && 
                                                    <span className="text-red-700"> (manuelt oppgitt)</span>}
                                                </span>
                                                <button 
                                                    onClick={(() => setIsAddingGrades(app._id))}
                                                    className="bg-red-100 hover:bg-red-400 text-xs p-[4px] rounded-md border-white border-[2px]">
                                                        {app.textractAnalysis && app.textractAnalysis.includes("manueltregistrert") ? <span>Endre</span> : <span>Legg inn manuelt</span>}
                                                </button>
                                            </span>
                                        )}
                                    </td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words max-w-2">{app.karaktersett}</td>
                                    <td className="border border-black px-[6px] py-2 text-xs break-words min-w-40 max-w-40">
                                        <span className="flex flex-col">
                                            <span className="font-thin">
                                                <ul className="mb-2">{app.logg && app.logg.split('_loggpause_').map((loggEntry, index) => (
                                                    <li className="text-[10px] bg-black/20" key={index}>
                                                        {loggEntry.substring(0, 4)}.{loggEntry.substring(4, 6)}.{loggEntry.substring(6, 8)}: {loggEntry.substring(8)}
                                                    </li>
                                                ))}
                                                </ul>
                                                {
                                                    isLogging === app._id ? 
                                                    <span className="flex flex-row w-full justify-end items-center px-[4px] gap-2">
                                                        <textarea
                                                            placeholder="Ny logg her"
                                                            className="h-6 rounded-md text-black text-[10px] px-[2px] w-40"
                                                            onChange={((e) => setAddedLog(e.target.value))}
                                                        >
                                                        
                                                        </textarea>
                                                        <span className="flex flex-row gap-2">
                                                            <button 
                                                                onClick={((e) => handleLogRegister(e, app))}
                                                                className=" p-[4px] bg-green-500 hover:bg-green-400 rounded-full"><Save size="10" color="white"/></button>
                                                            <button 
                                                                onClick={(() => setIsLogging(null))}
                                                                className=" p-[4px] bg-red-400 hover:bg-red-500 rounded-full"><X size="10" color="white"/></button>
                                                        </span>
                                                    </span>
                                                : 
                                                    <span className="flex flex-row items-center justify-between">
                                                        <span>

                                                        </span>
                                                        <button 
                                                            onClick={(() => setIsLogging(app._id))}
                                                            className="bg-white hover:bg-red-400 text-xs rounded-2xl p-[2px]">
                                                                <MessageCircleMore size="16" color="#e6410a"/>
                                                        </button>
                                                    </span>
                                                }
                                            </span>
                                        </span>
                                    </td>
                                    <td className="border border-black text-center py-2 break-words">
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
                                                <div className={`w-4 h-4 bg-white absolute top-0.5 left-0.5 ${isChecking === app._id ? 'translate-x-[0.625rem]' : ''} peer-checked:translate-x-5 rounded-full transition-all duration-300 shadow-md`}>
                                                    <p className="hidden">{app.behandlet ? 'ja' : 'nei'}</p>
                                                </div>
                                            </label>
                                        </div>  
                                    </td>

                                    <td className="h-16 w-auto justify-center items-center border-none flex-col">
                                        <div className="w-full h-full flex flex-col py-4 px-1 justify-between items-start ">
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
                                            {/* Knapp for å åpne slette-modal */}
                                            <button 
                                                className="bg-red-500 p-2 rounded-full flex flex-row justify-center items-center hover:bg-red-400 mt-2"
                                                onClick={() => setDeletingApplication(app)}
                                            >
                                                <Trash size="16" color="white"/>
                                            </button>
                                        </div>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {deletingApplication && (
                        <div className="fixed inset-0 flex backdrop-blur-sm items-center justify-center bg-white/40 z-50">
                            <div className="bg-black/80  p-4 rounded-lg shadow-lg w-96 z-60 flex flex-col text-white font-bold">
                                <div className="flex flex-row justify-between items-center">
                                    <h3 className="text-white text-xl">Slette søknad?</h3>
                                    <button 
                                        className="bg-redish hover:bg-moreredish p-1 rounded-lg cursor-pointer"
                                        onClick={() => {
                                            setDeletingApplication(null)
                                            setDeletingApplication(null);
                                        }}
                                    >
                                        <X/>
                                    </button>
                                </div>
                                <div className="mt-4 font-sans text-sm">
                                    <p><b>Søkernavn</b>: {deletingApplication.name}</p>
                                    <p><b>Søkt dato</b>: {deletingApplication.createdAt.split("T")[0] || 'no date'} {deletingApplication.createdAt.split("T")[1].split(".")[0] || 'no time' }</p>
                                </div>
                                <div className="mt-4 font-sans text-sm flex flex-row justify-between items-center">
                                    <button 
                                        className="border-moreredish rounded-md border-2 hover:bg-red-400 p-2"
                                        onClick={() => {
                                            handleDeleteApplication()
                                        }}
                                    >
                                        Slett søknad
                                    </button>
                                    <button 
                                        className="border-blue-400 rounded-md border-2 hover:bg-blue-400 p-2"
                                        onClick={() => setDeletingApplication(null)}
                                    >
                                        Gå tilbake
                                    </button>                                    
                                </div>
                            </div>
                        </div>
                    )}
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
                <div className="w-full">{(isFetching ? <div className="w-full h-full bg-flex justify-center items-center"><div className="mt-24 w-24 h-24 border-b-6 border-t-6 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div></div> : <p className="text-center">Ingen søknader funnet.</p>)}</div>
            )}
        </div>
    );
};

export default GetApplications;
