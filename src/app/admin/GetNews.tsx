
import { useState, useEffect, useCallback } from "react";
import React from "react";
import BlobMediaLibrary from "@/components/ui/BlobMediaLibrary";


interface GetNewsItemProps {
    token: string;
}

interface NewsItem {
    _id: string;
    news_title: string;
    news_content: string;
    news_image: string;
    createdAt: string;
    link?: string;
}

const GetNews: React.FC<GetNewsItemProps> = ({ token }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Funksjon for å håndtere det valgte bildet
    const handleImageSelected = (imageUrl: string) => {
      setSelectedImage(imageUrl);
    };
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newsTitle, setNewsTitle] = useState<string>("");
    const [newsContent, setNewsContent] = useState<string>("");
    const [linkContent, setLinkContent] = useState<string>("");
    
    const saveContent = async () => {
        if (!newsTitle || !newsContent) {
            alert("Tittel og Innhold på fylles ut!");
            return;
        }
        const imageToSave = selectedImage || '';
        const linkToSave = linkContent.trim() || '';

        try {
            const response = await fetch("/api/news", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    news_title: newsTitle,
                    news_content: newsContent,
                    news_image: imageToSave,
                    link: linkToSave,
                }),
            });

            if (!response.ok) {
                throw new Error("Feil ved lagring av nyheten!");
            }

            const result = await response.json();
            alert("Nyheten ble lagret!");
            console.log(result);

            fetchNews();
            setNewsContent("");
            setNewsTitle("");
            setSelectedImage(null);
            setLinkContent("");

        } catch (error) {
            console.error("Feil", error);
            alert("Kunne ikke lagre nyheten!");
        }
    };

    const fetchNews = useCallback(async () => {
        setNewsItems([]);
        if (!token) return;

        setError(null);
        try {
            const response = await fetch("/api/news", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch news");
            }

            const data = await response.json();
            console.log("Fetched news data:", data);
            if (data.news) {
                setNewsItems(data.news);
            } else {
                setError("Ingen nyheter funnet.");
            }
        } catch (error) {
            console.log("Error fetching news:", error);
            setError("Feil ved henting av nyheter.");
        }
    }, [token]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleDelete = async (e: React.MouseEvent, delete_id: string) => {
        const delete_me = delete_id;
        e.preventDefault();
        try {
            const response = await fetch(`/api/news/${delete_me}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    
                },
                body: JSON.stringify({id: delete_me})
            })

            if (!response.ok) {
                throw new Error("Noe gikk galt med slettingen");
            }
            alert("Nyheten ble slettet");
            fetchNews();
        } catch (e) {
            console.log(e);
            alert("Kunne ikke slette nyheten");
        }
    }

    const uploadNewsImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/news/upload-image", {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        },
        body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Opplasting feilet");

    setSelectedImage(data.url); // <-- dette blir news_image som du lagrer
    };


    return (
        <div className="flex flex-col w-full min-h-screen justify-start items-center overflow-auto">

            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="flex flex-col w-full overflow-scroll justify-center items-start max-w-[1000px]">
                <h1 className="w-full text-center pb-4">Antall nyheter: {newsItems.length}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-start items-center">
                    {newsItems.map((newsitem) => (
                        <div key={newsitem._id} className="bg-white/60 rounded-xl w-auto max-w-[600px] h-96 flex items-end border-[1px]"
                            style={{
                                backgroundImage: `url(${newsitem.news_image})`,
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover"
                            }}
                        >
                            <div className="bg-white/80 min-w-full min-h-1/4 rounded-b-xl p-2">
                                <p className="text-lg font-bold text-black">{newsitem.news_title}</p>
                                <p className="text-md text-black">{newsitem.news_content}</p>
                                <p className="text-md text-black">{newsitem.link || ''}</p>
                                <p className="text-black">{newsitem.createdAt.substring(0, 10)}</p>
                                <div className="w-full flex justify-end items-center">
                                    <button 
                                        onClick={(e) => {handleDelete(e, newsitem._id)}}
                                        className="bg-red-500 text-lg px-4 py-2 rounded-lg hover:bg-red-400"
                                    >
                                        Slett nyhet
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <form
                className="table-auto w-full mt-8 text-xl p-4 rounded-xl bg-white/60 border-2 border-black text-black flex flex-col gap-4 max-w-[1000px]"
                onSubmit={(e) => {
                    e.preventDefault();
                    saveContent();
                }}
            >
                <h1 className="text-center text-2xl font-bold font-mina">Opprett en nyhet:</h1>
                <h2 className="font-black">Tittel (maks 30 tegn):</h2>
                <input
                    type="text"
                    name="tittel"
                    maxLength={30}
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="text-black rounded-md h-12 p-2"
                />
                <h2 className="font-black">Innhold (max 400 tegn):</h2>
                <textarea
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    maxLength={400}
                    className="text-black rounded-md p-2"
                    rows={4}
                ></textarea>
                <h2 className="font-black">Link:</h2>                
                <input
                    placeholder="http://create.no/"
                    type="url"
                    name="link"
                    maxLength={300}
                    value={linkContent}
                    onChange={(e) => setLinkContent(e.target.value)}
                    className="text-black rounded-md h-12 p-2"
                />                
                <div className="flex justify-center items-center h-auto text-white font-bold w-full flex-col">
                    <div className="w-full flex flex-row justify-between items-center pb-4">
                        <div className="w-5/12">
                            <BlobMediaLibrary
                                token={token}
                                onImageSelected={handleImageSelected}
                                buttonClassName="bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-md font-bold py-2 px-4 rounded-lg w-full"
                            />
                        </div>
                        <input
                        type="file"
                        accept="image/*"
                        placeholder="LAst opp fil"
                        onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            try {
                            await uploadNewsImage(f);
                            } catch (err) {
                            alert(err instanceof Error ? err.message : "Kunne ikke laste opp bilde");
                            }
                        }}
                        className="bg-orange-500 hover:bg-blue-700 text-white text-sm md:text-md font-bold py-2 px-4 rounded-lg w-5/12"
                        />
               
                    </div>
                    {selectedImage && (
                        <div className="flex w-full flex-row p-2 bg-blue-400 rounded-lg">
                            <p>Valgt bilde: <span className="font-normal">{selectedImage}</span></p>
                            <img src={selectedImage} alt="" className="w-20 h-20 object-contain rounded-xl"/>
                        </div>
                    )}
                </div>


                <div className="flex justify-center items-center h-auto">

                </div>
                <button
                    type="submit"
                    className="p-4 rounded-md text-white text-2xl font-mina bg-green-500 hover:bg-green-600 cursor-pointer"
                >
                    Lagre nyhet
                </button>
            </form>

        </div>
    ); 
};

export default GetNews;
