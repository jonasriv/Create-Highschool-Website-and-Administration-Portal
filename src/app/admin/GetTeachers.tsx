import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Props {
    token: string;
}

type Teacher = {
    email?: string,
    active?: boolean,
    displayName?: string,
    addedByEmail?: string,
    notes?: string,    
    _id?: string,
}

export default function GetTeachers({ token }: Props) {
    const [addingTeacher, setAddingTeacher] = useState<Teacher>({
            email: "",
            active: false,
            displayName: "",
            addedByEmail: "",
            notes: "",
    });
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    async function handleSaveTeacher() {
        if (addingTeacher.email === "" || addingTeacher.displayName === "") {
            alert("Du mangler epost eller navn for læreren");
            return;
        } 
        const savingName = addingTeacher.displayName;
        const savingEmail = addingTeacher.email;
        const savingActive = true;
        const savingAddedByEmail = "none";
        const notes = "";

        try {
            const res = await fetch("/api/teachers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: savingEmail,
                    active: savingActive,
                    displayName: savingName,
                    addedByEmail: savingAddedByEmail,
                    notes: notes,
                })
            });

            if (!res.ok) {
                alert ("Noe gikk galt ved lagring");
                throw new Error("Feil ved lagring av lærer");
            }

            const result = await res.json();
            alert("Læreren ble lagret");
            console.log(result);
            setAddingTeacher({...addingTeacher, email: "", active: false, displayName: "", addedByEmail: "", notes: ""});
            fetchTeachers();
        } catch (error) {
            console.error("Feil: ", error);
            alert("Kunne ikke lagre");
        }
    };

    async function fetchTeachers() {
        try {
            const res = await fetch("/api/teachers", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!res.ok) {
                throw new Error("Failed to fetch teahcers");
            }

            const data = await res.json();

            if (data.teachers) {
                setTeachers(data.teachers);
            } else {
                console.log("Feil ved henting av lærere – ingen teachers i data");
            }

        } catch (error) {
            console.log("Feil ved henting av lærere - catchet", error);
        }
    }

    async function deleteTeacher(teacherId: string) {
        const deletingId = teacherId;
        if (!confirm("Vil du slette læreren? ")) return;
        if (deletingId === "") {
            alert("Du sendte ingen lærer");
            return;
        }
        try {
            const res = await fetch("/api/teachers", {
                method: "DELETE", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({deletingId}),
            });

            if (!res.ok) {
                throw new Error("Failed to delete teacher");
            }

            alert("Lærer slettet!");
            await fetchTeachers();

        } catch (error) {
            console.log("Feil ved sletting av lærer - catchet", error);
        }
    }    

    useEffect(() => {
        if (!token) return;
        fetchTeachers();
    }, [token]);


    if (!token) return(<div>Ikke innlogged / admin</div>);
    return(
        <div className="w-screen h-[calc(100vh-200px)]">
            <div className="bg-black/80 backdrop-blur-md rounded-md h-full w-full p-2 flex flex-row justify-start items-start ">
                
                {/* Legg til ny lærer_skjema */}
                <div className="flex h-full border-r border-white w-96 pr-2">
                    <div className="flex flex-col gap-2 w-full mx-2 mt-4">
                        <h2 className="font-mina text-white uppercase text-lg">Legg til lærer</h2>
                        <p className="w-full border-t border-redish pt-2">Fullt navn:</p>
                        <input 
                            type="text"
                            value={addingTeacher.displayName}
                            className="p-2 rounded-md bg-white/70 shadow-sm shadow-gray-600 text-black placeholder-black/60 mb-2" placeholder="Fullt navn" 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddingTeacher({...addingTeacher, displayName: e.target.value})}
                        ></input>
                        <p className="w-full border-t border-redish pt-4">Epost: </p>                        
                        <input 
                            value={addingTeacher.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddingTeacher({...addingTeacher, email: e.target.value})}
                            className="p-2 rounded-md bg-white/70 shadow-sm shadow-gray-600 text-black placeholder-black/60" 
                            placeholder="E-post" 
                            type="email" 
                        ></input>
                        <button 
                            className="p-2 rounded-md bg-moreredish w-full  mt-8 hover:bg-evenmoreredish hover:font-black transition-all duration-200 h-10 uppercase tracking-widest"  
                            onClick={() => handleSaveTeacher()}
                        >Lagre</button>
                    </div>
                </div>

                {/* Vis alle lærere */}
                    <div className="flex flex-col gap-2 w-full mx-2 mt-4">
                        <h2 className="font-mina text-white uppercase text-lg border-b border-redish pb-2">Alle mine lærarar</h2>
                    {teachers.length <= 0 ? "Ingen lærere registrert" : (
                        <table className="bg-white/20 rounded-md">
                            <thead>
                                <tr className="h-4 text-xl border-b border-white">
                                    <td className="p-2">Lærer</td>
                                    <td className="p-2">E-post</td>
                                    <td className="p-2">ID</td>
                                    <td className="p-2">Handlinger</td>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher, idx) => 
                                    <tr 
                                        className="h-10 items-center justify-between odd:bg-white/10 even:bg-white/20 py-2 px-1"
                                        key={idx}
                                    >
                                        <td className="p-2">{teacher.displayName}</td>
                                        <td className="p-2">{teacher.email}</td>
                                        <td className="p-2">{teacher._id}</td>
                                        <td className="p-2">
                                            {teacher._id && (
                                            <div 
                                                onClick={() => deleteTeacher(teacher._id || "")}
                                                    title="Slett"
                                                    className="w-6 h-6 rounded-full p-2 bg-white/30 flex flex-row justify-center items-center hover:bg-red-600 transition-all duration-200 cursor-pointer"
                                                >
                                                    <X size={12}/>
                                                </div>
                                            )}
                                            

                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                
            </div>
        </div>
    )
}