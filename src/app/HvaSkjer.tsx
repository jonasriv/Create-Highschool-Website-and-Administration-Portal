'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
interface NewsItem {
    _id: string;
    news_title: string;
    news_content: string;
    news_image: string;
    link?: string;
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

    const showArrowButtons = newsItems.length > 1;

    if (error) {
        return <div>{error}</div>;
    }
    if (!mounted) return null;
    return (
        <div 
        className="flex flex-col justify-center items-center w-screen h-auto mt-0 pb-0 min-h-96"
        >
            <div className="w-screen h-auto xl:w-[1024px] text-white flex flex-col justify-start items-center box-border ...  no-scrollbar mt-0 overflow-hidden">
                <div className="xl:bg-black/50 pb-12 flex h-auto flex-col lg:rounded-xl w-full mt-16 md:mt-24 justify-start items-center md:gap-4">
                    <h1 className="font-mina text-2xl md:text-3xl lg:text-4xl tracking-widest text-center text-white font-black mb-4 md:mb-4 md:pt-4">
                        Hva skjer på Create?
                    </h1>
                    <div className="flex lg:justify-between items-start lg:rounded-xl bg-transparent w-full md:w-[600px] lg:w-[800px] h-[480px] md:h-[600px] lg:h-[600px]">
                        
                        {loading && 
                            <div className="w-full h-full flex justify-center items-center">
                                <p>Laster nyheter...</p>
                            </div>
                        }
                        <Carousel autoplay={true} autoplayDelay={10000} showButtons={showArrowButtons} opts={{ loop: true }} className="flex flex-row overflow-hidden w-full h-full lg:rounded-xl">
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
                                        <div className="font-mina bg-black/60 backdrop-blur-md p-4 min-w-full flex flex-col justify-start items-start">
                                            <h3 className="font-mina  font-bold text-sm md:text-2xl text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
                                                {newsItem.news_title}
                                            </h3>
 
                                        <div className="flex flex-row gap-4">
                                            <p className="font-roboto text-md md:text-md lg:text-lg md:mt-2">
                                                {newsItem.news_content}
                                            </p>
                                            {newsItem.link && newsItem.link.length > 5 && (
                                                <a href={newsItem.link} target="_blank" className="p-1 border-[#E74f2e] border-2 items-center rounded-lg flex bg-black/80 justify-center transitionn-all duration-500 hover:bg-[#E74f2e] cursor-pointer"> 
                                                    <p className="font-roboto text-sm flex flex-row items-center px-2 gap-1 font-bold">
                                                        Les mer <ArrowRight size="32"/>
                                                    </p>
                                            </a>
                                            )}
                                            
                                        </div>
                                    </div>
                                </CarouselItem>
                                    
                                    ))
                                ) : (
                                    <div className="text-center text-white"></div>
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
