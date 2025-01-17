import { useState, useRef } from "react";

interface GetContentProps {
    token: string;
}

interface ContentItem {
        _id: string;
        frontpage_soknadsfrist?: string;
        program_musikk?: string;
        program_dans?: string;
        program_drama?: string;
        elev_1?: string;
        elev_2?: string;
        elev_3?: string;
        elev_4?: string;
        opptak?: string;
        hva_blir_jeg?: string;
        om_create?: string;
        soknad_intro?: string;
        createdAt: string;
    }

const GetContent: React.FC<GetContentProps> = ({ token }) => {
    
    const [content, setContent] = useState<ContentItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const pressedButton = useRef(false);
    
    const fetchContent = async () => {
        pressedButton.current = true;
        if (!token) return;

        setError(null);
        try {
            const response = await fetch("/api/content", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch content");
            }

            const data = await response.json();

            const sortedContent = (data.content || []).sort(
                (a: ContentItem, b: ContentItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            if (sortedContent.length > 0) {
                const newestContent = sortedContent[0] ? [sortedContent[0]] : []; 
                const validatedContent = newestContent.map((item: ContentItem, index: number) => ({
                    ...item,
                    _id: item._id || `generated-id-${index}`,
                }));
                setContent(validatedContent);
            } else {
                setContent([
                    {
                        _id: "new-content",
                        frontpage_soknadsfrist: "",
                        elev_1: "",
                        elev_2: "",
                        elev_3: "",
                        elev_4: "",
                        program_musikk: "",
                        program_dans: "",
                        program_drama: "",
                        opptak: "",
                        hva_blir_jeg: "",
                        om_create: "",
                        soknad_intro: "",
                        createdAt: "",
                    },
                ]);
            }
            

        } catch (err) {
            if (err instanceof Error) {
                setError((err as Error).message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const handleInputChange = (index: number, field: keyof ContentItem, value: string) => {
        const updatedContent = [...content];
        updatedContent[index] = {
            ...updatedContent[index],
            [field]: value,
        };
        setContent(updatedContent);
    };

    const saveContent = async () => {
        if (!token) {
            return;
        }
        try {
            const formData = new FormData();
            content.forEach((item) => {
                Object.entries(item).forEach(([key, value]) => {
                    if (value) {
                        console.log(`Key: ${key}, Value: ${value}`); // Debugging

                        formData.append(key, value.toString());
                    }
                });
            });
            const response = await fetch("api/content", {
                method: "POST",
                headers: { 
                    Authorization: `Bearer ${token}`,
                 },
                 body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch content");
            }

            const data = await response.json();
            console.log("Content saved successfully:", data);
            alert("Innholdet ble oppdatert!");
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Error saving content:", err.message);
                setError(err.message);
                alert("Feil ved oppdatering av innhold!");
            } else {
                console.log("An unknown error occuurred");
                setError("An unknown error occurred");
                alert("En ukjent feil oppsto!");
            }    
        }
    };
    
    return (        
        <div className="flex flex-col w-full min-h-screen justify-start items-center">
            <button
                className="p-[8px] flex justify-center items-center rounded-xl text-xl border-2 border-white w-52 bg-pinky cursor-pointer hover:bg-fuchsia-950"
                onClick={fetchContent}
            >
                Hent innhold
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <p className="pt-4 text-lg">Bruk &lt;br/&gt; for linjeskift</p>
            <p className="pt-4 text-lg">Fet skrift: Bruk &lt;b&gt; før ordet og &lt;/b&gt; etter ordet: Slik som dette: &lt;b&gt; <b>fett</b> &lt;/b&gt;</p>
            <p className="text-green-400 font-bold text-xl">Huske å LAGRE nederst på siden når du gjør endringer</p>
            {content.length > 0 ? (
                <form key='formA' className="table-auto w-full mt-8 text-xl p-4 bg-slate-800 rounded-xl"
                    onSubmit={(e) => {
                        e.preventDefault();
                        saveContent();
                    }}
                >
                    
                    {content.map((content, index) => (
                        <div key={content._id} className="flex flex-col mb-4 w-full items-start">
                            <h2>Forside info om frist:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "frontpage_soknadsfrist", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.frontpage_soknadsfrist || ""}>
                            </textarea>
                            <h2>Programfag musikk:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "program_musikk", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.program_musikk || ""}>
                            </textarea>
                            <h2>Programfag dans:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "program_dans", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.program_dans || ""}>
                            </textarea>
                            <h2>Programfag drama:</h2><textarea 

                                onChange={(e) => handleInputChange(index, "program_drama", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.program_drama || ""}>
                            </textarea>
                            <h2>Elev på Create 1:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "elev_1", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.elev_1 || ""}>
                            </textarea>
                            <h2>Elev på Create 2:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "elev_2", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.elev_2 || ""}>
                            </textarea>
                            <h2>Elev på Create 3:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "elev_3", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.elev_3 || ""}>
                            </textarea>
                            <h2>Elev på Create 4:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "elev_4", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.elev_4 || ""}>
                            </textarea>                            
                            <h2>Opptak:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "opptak", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.opptak || ""}>
                            </textarea>
                            <h2>Hva blir jeg?:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "hva_blir_jeg", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.hva_blir_jeg || ""}>
                            </textarea>
                            <h2>Om create:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "om_create", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.om_create || ""}>
                            </textarea>
                            <h2>Søknadsside intro:</h2>
                            <textarea 
                                onChange={(e) => handleInputChange(index, "soknad_intro", e.target.value)} 
                                className="border px-4 py-2 w-11/12 min-h-24 mb-8 h-auto text-black bg-slate-100" 
                                value={content.soknad_intro || ""}>
                            </textarea>                                
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="p-4 rounded bg-green-500 text-white hover:bg-green-600"
                    >Lagre oppdatert innhold
                    </button>
                    
                </form>
            ) : (
                ""
            )}
        </div>
    );
};

export default GetContent;
