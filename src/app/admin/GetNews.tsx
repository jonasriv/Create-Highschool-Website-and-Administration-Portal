import { useState, useEffect, useCallback } from "react";
import React from "react";

interface GetNewsItemProps {
    token: string;
}

interface NewsItem {
    _id: string;
    news_title: string;
    news_content: string;
    news_image: string;
    createdAt: string;
}

const GetNews: React.FC<GetNewsItemProps> = ({ token }) => {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newsTitle, setNewsTitle] = useState<string>("");
    const [newsContent, setNewsContent] = useState<string>("");
    const [newsImage, setNewsImage] = useState<string>("");
     
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
            console.log("Fetched news data:", data);  // Logg dataen
            if (data.news) {  // Endret fra data.newsItems til data.news
                setNewsItems(data.news);  // Bruk data.news i stedet for data.newsItems
            } else {
                setError("Ingen nyheter funnet.");
            }
        } catch (error) {
            console.log("Error fetching news:", error);
            setError("Feil ved henting av nyheter.");
        }
    }, [token]);
    
    

    const saveContent = async () => {
        //sjekk at felter er fylt ut: 
        if (!newsTitle || !newsContent || !newsImage) {
            alert("Alle feltene må fylles ut!");
            return;
        }

        try {
            const response = await fetch("/api/news", {
                method: 'POST',
                headers: {
                    "Content-Type": "applications/json",
                },
                body: JSON.stringify({
                    news_title: newsTitle, 
                    news_content: newsContent,
                    news_image: newsImage,
                }),
            });

            if (!response.ok) {
                throw new Error("Feil ved lagring av nyheten!");
            }

            const result = await response.json();
            alert("Nyheten ble lagret!");
            console.log(result);
        } catch (error) {
            console.error("Feil", error);
            alert("Kunne ikke lagre nyheten!");
        }
        fetchNews();
        setNewsContent("");
        setNewsTitle("");
        setNewsImage("");
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, news: NewsItem) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/news/${news._id}`, {
                method: 'DELETE',
                headers: 
                 {'Authorization': `Bearer ${token}`,},
            });

            if (!response.ok) {
                throw new Error('Failed ...');
            }
            alert("Nyheten ble slettet!");
            fetchNews();
        } catch (error) {
            console.error('Error ...:', error)
        };       
    };
    
    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return (
        <div className="flex flex-col w-full min-h-screen justify-start items-start">
            <div className="flex flex-row w-full h-full gap-8 justify-center ml-8 items-center"></div>
    
            {error && <p className="text-red-500 mt-4">{error}</p>}
    
                <div className="flex flex-col w-full overflow-scroll justify-center items-start px-8">
                    <h1 className="w-full text-center pb-4">Antall nyheter: {newsItems.length}</h1>
                    <div className="grid grid-cols-2 gap-8 w-full justify-center ">
                        {newsItems.map((newsitem) => (
                            <div 
                            key={newsitem._id}
                            className="bg-red-300 rounded-xl p-4"
                            >
                                <p className="text-lg font-bold text-black">{newsitem.news_title}</p>
                                <p className="text-md text-black">{newsitem.news_content}</p>
                                <p className="italic">{newsitem.news_image}</p>
                                <p>{newsitem.createdAt.substring(0, 10)}</p>
                                
                                <button 
                                    onClick={(e) => handleDelete(e, newsitem)}
                                    className="p-2 bg-red-500 rounded-xl mt-2"
                                    >
                                        SLETT
                                    </button>
                            </div>
                        ))}
                    </div>
                </div>
                            
            <form
                className="table-auto w-full mt-8 text-xl p-4 rounded-xl bg-slate-700 flex flex-col gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    saveContent();
                }}
            >
                <h1 className="text-center text-2xl font-bold font-mina">Opprett nyhet:</h1>
                <p>For bilder, last opp på cloudinary ( mail@create.no / M3rennbareskole! ) og hold over bildet for å få link</p>
                <h2>Tittel (maks 30 tegn):</h2>
                <input 
                    type="text" 
                    name="tittel" 
                    maxLength={30}
                    value={newsTitle} 
                    onChange={(e) => setNewsTitle(e.target.value)} 
                    className="text-black rounded-md"></input>
                <h2>Innhold (max 400 tegn):</h2>
                <textarea
                    value={newsContent} 
                    onChange={(e) => setNewsContent(e.target.value)}
                    maxLength={400}
                    className="text-black rounded-md"
                ></textarea>
                <h2>Bildelink (fra Create sin Cloudinary)</h2>
                <input 
                    type="text" 
                    name="bildelink" 
                    value={newsImage}
                    onChange={(e) => setNewsImage(e.target.value)} 
                    className="text-black rounded-md"   
                ></input>
                <button
                    type="submit"
                    className="p-4 rounded-md text-black text-2xl font-mina bg-green-500 hover:bg-green-600"
                >
                    Lagre nyhet
                </button>
            </form>
        </div>
    );
    
};

    
export default GetNews;
