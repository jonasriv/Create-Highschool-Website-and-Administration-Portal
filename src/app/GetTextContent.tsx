import useSWR from "swr";
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
    createdAt?: Date;
}

interface GetTextContentProps {
    contentKey: keyof ContentItem; // Keyen fra ContentItem som vi skal hente fra objektet
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const GetTextContent = ({ contentKey }: GetTextContentProps) => {
    // Bruk SWR for å håndtere datalasting og caching
    const { data, error } = useSWR<{ content: ContentItem[] }>("/api/content", fetcher);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>...</div>;
    }

    const sortedContent = (data.content || []).sort(
        (a: ContentItem, b: ContentItem) =>
            new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
    );

    const content = sortedContent[0] || {
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
    };

    const contentValue =
        typeof content[contentKey] === "string" ? content[contentKey] : "No content available";

    const sanitizedHTML = DOMPurify.sanitize(contentValue as string);

    return (
        <span
            dangerouslySetInnerHTML={{
                __html: sanitizedHTML, // Bruk sanert HTML
            }}
        ></span>
    );
};

export default GetTextContent;
