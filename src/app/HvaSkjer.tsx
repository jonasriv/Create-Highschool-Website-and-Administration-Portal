'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface NewsItem {
    _id: string;
    news_title: string;
    news_content: string;
    news_image: string;
    createdAt: string;
}

const HvaSkjer = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Hent data når komponenten lastes
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch("/api/news");
                const data = await response.json();
                if (data && data.news) {
                    const sortedNews = data.news.sort(
                        (a: NewsItem, b: NewsItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setNewsItems(sortedNews); // Sett nyhetene i state
                } else {
                    setError("Ingen nyheter tilgjengelig.");
                }
            } catch (error) {
                setError("Kunne ikke hente nyheter. Prøv igjen senere.");
                console.log(error);
            } finally {
                setLoading(false); // Sett loading til false når henting er ferdig
            }
        };

        fetchNews(); // Kall funksjonen for å hente nyheter
    }, []); // Kjør kun ved første rendering

    if (loading) {
        return <div>Laster nyheter...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    if (!mounted) return null;
    return (
        <div 
        className="flex flex-col justify-center items-center w-screen h-auto mt-0 pb-0"
        >
            <div className="w-screen h-auto xl:w-[1024px] text-white flex flex-col justify-start items-center box-border ...  no-scrollbar mt-0 overflow-hidden">
                <div className="xl:bg-black/50 pb-12 flex h-auto flex-col lg:rounded-xl w-full mt-16 md:mt-24 justify-start items-center md:gap-4">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 md:mb-4 md:pt-4">
                        Hva skjer på Create?
                    </h1>
                    <div className="flex lg:justify-between items-start rounded-xl bg-white/40 w-full md:w-[600px] lg:w-[800px] h-[480px] md:h-[600px] lg:h-[600px]">
                        <Carousel autoplay={true} autoplayDelay={10000} showButtons={true} opts={{ loop: true }} className="flex flex-row overflow-hidden w-full h-full rounded-xl">
                            <CarouselContent className="w-full flex flex-row ">{newsItems.length > 0 ? (
                                newsItems.map((newsItem) => (
                                    
                                <CarouselItem key={newsItem._id} className="w-full min-w-full flex flex-col justify-end items-center" 
                                    style={{
                                        backgroundImage: `url(${newsItem.news_image})`, 
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                    >
                                    <div className="font-mina text-md lg:text-2xl bg-black/60 p-4 min-w-full flex flex-col justify-start items-start">
                                        <h1 className="font-mina text-lg md:text-2xl">{newsItem.news_title} </h1>
                                        <p className="font-roboto text-md md:text-lg lg:text-xl md:mt-2">
                                            {newsItem.news_content}
                                        </p>
                                    </div>
                                </CarouselItem>
                                    
                                    ))
                                ) : (
                                    <div className="text-center text-white">Ingen nyheter tilgjengelig.</div>
                                )}
                            </CarouselContent>                            
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HvaSkjer;
