import { useState, useEffect } from "react";
import DOMPurify from "dompurify";

interface ContentItem {
    _id: string;
    frontpage_title?: string;
    frontpage_soknadsfrist?: string;
    elev_1?: string;
    elev_2?: string;
    elev_3?: string;
    elev_4?: string;
    program_musikk?: string;
    program_dans?: string;
    program_drama?: string;
    opptak?: string;
    hva_blir_jeg?: string;
    om_create?: string;
}

interface GetTextContentProps {
    contentKey: keyof ContentItem; // Keyen fra ContentItem som vi skal hente fra objektet
}

const GetTextContent = ({ contentKey }: GetTextContentProps) => {  
    const [content, setContent] = useState<ContentItem | null>(null); // Endre til å være en enkelt ContentItem, ikke array
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchContent = async () => {
            setError(null);
            try {
                const response = await fetch("/api/content", {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch content");
                }

                const data = await response.json();

                const sortedContent = (data.content || []).sort(
                    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                if (sortedContent.length > 0) {
                    setContent(sortedContent[0]); // Lagre det nyeste objektet i content
                } else {
                    setContent({
                        _id: "new-content",
                        frontpage_title: "",
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
                    });
                }
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchContent();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!content) {
        return <div>Loading...</div>;
    }

    // Hent spesifikt innhold basert på contentKey
    const contentValue = content[contentKey] || "No content available"; // Bruk contentKey for å hente riktig verdi

    const sanitizedHTML = DOMPurify.sanitize(contentValue as string);
    return <span dangerouslySetInnerHTML={{
        __html: sanitizedHTML // Bruk sanert HTML

    }}>
    </span>;
};

export default GetTextContent;
