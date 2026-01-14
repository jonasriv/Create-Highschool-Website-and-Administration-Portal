'use client'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("./HeaderBesoksdag"), {ssr:false});

const Besoksdag = () => {
        
    const externalBackground = "images/iStock-1069853936_compressed3.jpg"; 
    
    return (
    <div 
        className="flex flex-col overflow-y-scroll h-screen w-screen bg-black "
        style={{
            backgroundImage: `url(${externalBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            //filter: 'brightness(80%)',
        }}  
    >
        <Header/>
        <main className='mt-24 w-full flex flex-col justify-center items-start pt-0'>
            <section className="w-full bg-white/30 md:max-w-3xl w-[[800px] mx-auto p-4 text-black lg:rounded-lg mt-0">
            <h1 className="text-2xl md:text-3xl font-mina font-bold mb-4">
                Program – Besøksdag på Create videregående skole
            </h1>

            <p className="mb-6">
                <strong>Dato:</strong> 21. og 23. januar <br />
                <strong>Tid:</strong> kl. 12.00–15.00
            </p>

            <div className="flex flex-col gap-6">
                <article>
                <h2 className="text-white text-xl font-semibold">
                    12.00–12.20 | Velkommen
                </h2>
                <ul className="list-disc list-inside">
                    <li>Velkomst ved rektor Bjarne og elevrådet</li>
                    <li>Kort presentasjon av skolen</li>
                </ul>
                </article>

                <article>
                <h2 className="text-white text-xl font-semibold">
                    12.15–13.45 | Utforsk programfag
                </h2>
                <p className="mb-2">
                    Elevene får bli bedre kjent med de programfagene de synes er mest
                    interessante:
                </p>
                <ul className="list-disc list-inside">
                    <li>Musikk</li>
                    <li>Dans</li>
                    <li>Drama / film</li>
                </ul>
                <p className="italic mt-2">
                    Skal du delta på dans, anbefales det å ha på klær som er gode å
                    bevege seg i.
                </p>
                </article>

                <article>
                <h2 className="text-white text-xl font-semibold">
                    13.45–14.15 | Pause
                </h2>
                <p>Pause med enkel servering.</p>
                </article>

                <article>
                <h2 className="text-white text-xl font-semibold">
                    14.15–14.40 | Møte med faglærere
                </h2>
                <ul className="list-disc list-inside">
                    <li>Bli kjent med faglærerne</li>
                    <li>
                    Mulighet til å stille spørsmål om fag, skolehverdag og vurdering
                    </li>
                </ul>
                </article>

                <article>
                <h2 className="text-white text-xl font-semibold">
                    14.40–15.00 | Elevliv og avslutning
                </h2>
                <ul className="list-disc list-inside">
                    <li>Samtaler med elever</li>
                    <li>Spørsmål og svar</li>
                    <li>Avrunding av dagen</li>
                </ul>
                <h2 className="pb-12 text-xl font-semibold pt-4 text-white">
                    Påmelding: <a href="mailto:mail@create.no" className='text-black drop-shadow-xl p-2 rounded-md hover:bg-[#E74f2e]'>mail@create.no</a>
                </h2>                
                </article>
            </div>
            </section>            
        </main>
    </div>
    );
    
}

export default Besoksdag;
