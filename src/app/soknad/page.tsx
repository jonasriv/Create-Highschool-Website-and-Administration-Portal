'use client'
import React, { useState, useRef } from "react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
const Header = dynamic(() => import("./HeaderSoknad"), {ssr:false});

const Soknad = () => {
    const divRef = useRef<HTMLDivElement | null>(null);
    const externalBackground = "https://res.cloudinary.com/dtg4y0rod/image/upload/v1736506363/background_no_logo_yhjwra.jpg"; 
    type FormData = {
        fullName: string;
        email: string;
        emailParent: string;
        phone: string;
        priority1: string;
        priority2: string;
        priority3: string;
        opptaksprove: string;
        hovedinstrument: string;
        skoleaar: string;
        resume: File | null;
        fakturanavn: string;
        fakturaepost: string;
        fakturagateadresse: string;
        fakturapostnummer: string;
        fakturapoststed: string;
        fakturaland?: string;    
        sprakvalg: string;    
        leiemac: string;    
    }
    const [ formData, setFormData ] = useState<FormData>({
        fullName: '',
        email: '',
        emailParent: '',
        phone: '',
        priority1: '',
        priority2: '',
        priority3: '',
        opptaksprove: '',
        hovedinstrument: '',
        skoleaar: 'VG1',
        resume: null,
        fakturanavn: "",
        fakturaepost: "",
        fakturagateadresse: "",
        fakturapostnummer: "",
        fakturapoststed: "",
        fakturaland: "Norge",        
        sprakvalg: "",        
        leiemac: "",        
    });

    const [ errors, setErrors ] = useState({
        fullName: '',
        email: '',
        emailParent: '',
        phone: '',
        priority1: '',
        priority2: '',
        priority3: '',
        opptaksprove: '',
        hovedinstrument: '',
        skoleaar: '',
        resume: '',
        fakturanavn: "",
        fakturaepost: "",
        fakturagateadresse: "",
        fakturapostnummer: "",
        fakturapoststed: "",
        fakturaland: "",
        sprakvalg: "",
        leiemac: "",
    })

    const [loading, setLoading] = useState(false);  // Legg til loading state
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const validateForm = () => {
        const newErrors = {
            fullName: formData.fullName ? '' : 'Fullt navn er påkrevd',
            email: formData.email ? '' : 'E-post er påkrevd',
            emailParent: formData.emailParent ? '' : 'E-post til foresatt er påkrevd',
            phone: formData.phone ? '' : 'Telefonnummer er påkrevd',
            priority1: formData.priority1 ? '' : 'Du må velge en førsteprioritet',
            priority2: formData.priority2 ? '' : 'Du må velge en andreprioritet',
            priority3: formData.priority3 ? '' : 'Du må velge en tredjeprioritet',
            opptaksprove: formData.opptaksprove ? '' : 'Du må velge om ønsker frivillig opptaksprøve',
            hovedinstrument: (formData.priority1 === 'musikk' || formData.priority2 === 'musikk' || formData.priority3 === 'musikk') && !formData.hovedinstrument ? 'Du må velge et hovedinstrument' : '',
            resume: formData.resume ? '' : 'Du må laste opp en karakterutskrift',
            skoleaar: formData.skoleaar ? '' : 'Du må velge et skoleår',
            fakturanavn: formData.fakturanavn ? '' : 'Du må skrive inn et navn for fakturamottaker',
            fakturaepost: formData.fakturaepost ? '' : 'Du må oppgi epostadresse til fakturamottaker',
            fakturagateadresse: formData.fakturagateadresse ? '' : 'Du må oppgi gateadresse til fakturamottaker',
            fakturapostnummer: formData.fakturapostnummer ? '' : 'Du må oppgi postnummer til fakturamottaker',
            fakturapoststed: formData.fakturapoststed ? '' : 'Du må oppgi poststed til fakturamottaker',
            fakturaland: formData.fakturaland ? '' : 'Du må oppgi fakturaland',
            sprakvalg: formData.sprakvalg ? '' : 'Du må velge fremmedspråk',
            leiemac: formData.leiemac ? '' : 'Du må velge om du vil leie mac',
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (formData.priority1 === formData.priority2 || formData.priority1 === formData.priority3 || formData.priority3 === formData.priority2) {
            alert("Du må velge tre forskjellige prioriteringer!");
            return;
        }
    
        if (!formData.resume) {
            alert('Du må laste opp et karakterkort!');
            return;
        }

        // 🛑 Sjekk filstørrelse før innsending
        if ((formData.resume as File).size > MAX_FILE_SIZE) {
            alert("Filen er for stor. Prøv igjen med et bilde som tar mindre plass (maks 5MB).");
            return;
        }
    
        if (validateForm()) {
            setLoading(true);
            try {
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.fullName); 
                formDataToSend.append('email', formData.email); 
                formDataToSend.append('emailParent', formData.emailParent); 
                formDataToSend.append('phone', formData.phone); 
                formDataToSend.append('priority1', formData.priority1); 
                formDataToSend.append('priority2', formData.priority2); 
                formDataToSend.append('priority3', formData.priority3); 
                formDataToSend.append('hovedinstrument', formData.hovedinstrument); 
                formDataToSend.append('opptaksprove', formData.opptaksprove); 
                formDataToSend.append('skoleaar', formData.skoleaar); 
                formDataToSend.append('resume', formData.resume as File); 
                formDataToSend.append('fakturanavn', formData.fakturanavn); 
                formDataToSend.append('fakturaepost', formData.fakturaepost); 
                formDataToSend.append('fakturagateadresse', formData.fakturagateadresse); 
                formDataToSend.append('fakturapostnummer', formData.fakturapostnummer); 
                formDataToSend.append('fakturapoststed', formData.fakturapoststed); 
                formDataToSend.append('fakturaland', formData.fakturaland || ''); 
                formDataToSend.append('sprakvalg', formData.sprakvalg); 
                formDataToSend.append('leiemac', formData.leiemac); 
    
                const response = await fetch('api/applications', {
                    method: 'POST', 
                    body: formDataToSend,
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.message || 'Noe gikk galt. Prøv igjen senere.');
                    throw new Error(errorData.message || 'Feil under innsending.');
                }
    
                const data = await response.json();
                alert(data.message || 'Søknaden ble sendt inn!');
                console.log('Søknaden ble sendt inn', data);
                setLoading(false);
    
                setFormData({
                    fullName: '',
                    email: '',
                    emailParent: '',
                    phone: '',
                    priority1: '',
                    priority2: '',
                    priority3: '',
                    opptaksprove: '',
                    hovedinstrument: '',
                    skoleaar: '',
                    resume: null,
                    fakturanavn: "",
                    fakturaepost: "",
                    fakturagateadresse: "",
                    fakturapostnummer: "",
                    fakturapoststed: "",
                    fakturaland: "",                       
                    sprakvalg: "",                       
                    leiemac: "",                       
                });
    
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
    
                window.location.href = '/';
            } catch (error) {
                console.error('Error:', error);
                alert('Kunne ikke sende inn søknaden. Prøv igjen senere.');
            } finally {
                setLoading(false);
            }
        }
    };
    
    const [requirements, setRequirements] = useState<number>(0);

    const handleExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        setRequirements(1);

    };

    const handleGetIt = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setRequirements(0);
        if (divRef.current) {
            divRef.current.classList.remove("hidden");
            document.getElementById("expand_button")?.classList.toggle("hidden");
        } 
    };
    
    return (
    <div 
    className="flex flex-col overflow-y-scroll h-screen w-screen bg-black "
    style={{
        backgroundImage: `url(${externalBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        //filter: 'brightness(80%)',
    }}  >
            <Header/>
            {loading && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 flex-col gap-12">
                <div className="w-24 h-24 border-b-8 border-t-8 border-pinky border-t-blue-500 rounded-full animate-spin-fast"></div>
                <p className="text-2xl">Vent mens opplastingen behandles...</p>
              </div>
            )}
            {requirements && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 flex-col gap-12">    
                    <div className="bg-black/80 p-4 mb-4 rounded-xl w-96 h-auto font-roboto">
                        <h1 className="text-white text-2xl font-black">Opplasting av karakterkort</h1>
                        <p className="text-xl text-white mb-4">
                            Last opp et tydelig og klart bilde av din karakterutskrift fra 1. termin på 10. trinn. Det må vise fullt navn, skole og alle karakterene dine. Bruk gjerne skjermbilde fra <a className="underlines hover:underline font-black text-blue-400" href="https://elev.visma.no/lillehammer" target="_blank">visma</a> eller tilsvarende. 
                        </p>
                        <p className="text-xl mb-4 text-white">
                            Karakterkort lagres i opptil 12 måneder for søknadsprosessen og slettes deretter automatisk. Ingen data deles med tredjeparter. 
                        </p>
                        <button onClick={(e) => {handleGetIt(e)}} className="p-4 w-full bg-blue-600 hover:bg-blue-500 cursor-pointer rounded-lg">Jeg skjønner!</button>
                    </div>    
                </div>
            )}            
            <div className="max-w-screen-lg mt-20 mb-8 w-11/12 mx-auto p-6 bg-slate-600 bg-opacity-95 rounded-lg flex flex-col">
            <div className="">
                <h1 className="font-mina text-2xl md:text-3xl mb-4">
                    Bli en del av Create!
                </h1>
                <div className="font-roboto text-lg md:text-xl">
                    <p>
                        Create tar imot søkere fra hele landet. I 2026 tar vi hovedsaklig inn elever til VG1. Det er også mulig å søke på VG2 og VG3, der vi vil ta inn elever etter ledig kapasitet. Det går fint å søke på flere forskjellige skoler. Du bestemmer selv hvilken skole du vil gå på etter at du har fått tilbud om skoleplass. Opptaket starter 15. mars. Det koster 28.000 kroner per skoleår å gå på Create.
                    </p>
                </div>
                <p className="text-lg text-white mt-4">Søknadsfrist 1. mars</p>
            </div>
            <h1 className="text-2xl font-bold mb-6 pt-8 font-mina w-full text-center">Søknadsskjema</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="font-mina text-2xl pt-4">Personalia:</h1>                
            {/* Fullt navn */}
            <div>
                <label htmlFor="fullName" className="block text-sm md:text-lg font-semibold">Fullt navn:</label>
                <input
                type="text"
                placeholder="Ditt fulle navn"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fullName && <p className="text-red-500 text-sm md:text-lg">{errors.fullName}</p>}
            </div>
            {/* Skoleår */}
            <div>
            <label htmlFor="skoleaar" className="block text-sm md:text-lg font-semibold">Hvilket skoleår søker du for?</label>
                <select
                    id="skoleaar"
                    name="skoleaar"
                    value={formData.skoleaar}  // Sørg for at denne verdien er i tråd med formData
                    onChange={(e) => setFormData({ ...formData, skoleaar: e.target.value })}
                    className="w-full p-2 h-10 border border-gray-300 rounded-md text-slate-700"
                >
                    <option value="VG1">VG1</option>
                    <option value="VG2">VG2</option>
                </select>
                {errors.skoleaar && <p className="text-red-500 text-sm md:text-lg">{errors.skoleaar}</p>}
            </div>
    
            {/* E-post */}
            <div>
                <label htmlFor="email" className="block text-sm md:text-lg font-semibold">Din e-postadresse:</label>
                <input
                type="email"
                placeholder="Din e-postadresse"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.email && <p className="text-red-500 text-sm md:text-lg">{errors.email}</p>}
            </div>

            {/* E-post foresatt*/}
            <div>
                <label htmlFor="emailParent" className="block text-sm md:text-lg font-semibold">Foresattes e-postadresse:</label>
                <input
                type="email"
                placeholder="Foresattes e-postadresse"
                id="emailParent"
                name="emailParent"
                value={formData.emailParent}
                onChange={(e) => setFormData({ ...formData, emailParent: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.emailParent && <p className="text-red-500 text-sm md:text-lg">{errors.emailParent}</p>}
            </div>                
    
            {/* Telefonnummer */}
            <div>
                <label htmlFor="phone" className="block text-sm md:text-lg font-semibold">Telefonnummer:</label>
                <input
                type="tel"
                placeholder="Telefonnummer"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.phone && <p className="text-red-500 text-sm md:text-lg">{errors.phone}</p>}
            </div>
            
            {/* Fakturaadresse */}
            <h1 className="font-mina text-2xl pt-4">Fakturaadresse:</h1>
            {/* Fakturaadresse navn*/}
            <div>
                <label htmlFor="fakturanavn" className="block text-sm md:text-lg font-semibold">Navn på fakturamottaker:</label>
                <input
                type="text"
                placeholder="Fullt navn på fakturamottaker"
                id="fakturanavn"
                name="fakturanavn"
                value={formData.fakturanavn}
                onChange={(e) => setFormData({ ...formData, fakturanavn: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fakturanavn && <p className="text-red-500 text-sm md:text-lg">{errors.fakturanavn}</p>}
            </div>
            
            {/* Fakturaadresse epost */}
            <div>
                <label htmlFor="fakturaepost" className="block text-sm md:text-lg font-semibold">Epost-adresse til fakturamottaker:</label>
                <input
                type="text"
                placeholder="Epost-adresse til fakturamottaker"
                id="fakturaepost"
                name="fakturaepost"
                value={formData.fakturaepost}
                onChange={(e) => setFormData({ ...formData, fakturaepost: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fakturaepost && <p className="text-red-500 text-sm md:text-lg">{errors.fakturaepost}</p>}
            </div>  

            {/* Fakturaadresse postadresse (gateadresse) */}
            <div>
                <label htmlFor="fakturagateadresse" className="block text-sm md:text-lg font-semibold">Postadresse (gateadresse) til fakturamottaker:</label>
                <input
                type="text"
                placeholder="Post-/gateadresse til fakturamottaker"
                id="fakturagateadresse"
                name="fakturagateadresse"
                value={formData.fakturagateadresse}
                onChange={(e) => setFormData({ ...formData, fakturagateadresse: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fakturagateadresse && <p className="text-red-500 text-sm md:text-lg">{errors.fakturagateadresse}</p>}
            </div>    

            {/* Fakturaadresse postnummer*/}
            <div>
                <label htmlFor="fakturapostnummer" className="block text-sm md:text-lg font-semibold">Postnummer:</label>
                <input
                type="number"
                placeholder="Postnummer"
                id="fakturapostnummer"
                name="fakturapostnummer"
                value={formData.fakturapostnummer}
                onChange={(e) => setFormData({ ...formData, fakturapostnummer: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fakturapostnummer && <p className="text-red-500 text-sm md:text-lg">{errors.fakturapostnummer}</p>}
            </div>  

            {/* Fakturaadresse postnummer*/}
            <div>
                <label htmlFor="fakturapoststed" className="block text-sm md:text-lg font-semibold">Sted:</label>
                <input
                type="text"
                placeholder="Poststed"
                id="fakturapoststed"
                name="fakturapoststed"
                value={formData.fakturapoststed}
                onChange={(e) => setFormData({ ...formData, fakturapoststed: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fakturapoststed && <p className="text-red-500 text-sm md:text-lg">{errors.fakturapoststed}</p>}
            </div>   

            {/* Fakturaadresse postnummer*/}
            <div>
                <label htmlFor="fakturaland" className="block text-sm md:text-lg font-semibold">Land:</label>
                <input
                type="text"
                placeholder="Norge"
                id="fakturaland"
                name="fakturaland"
                value={formData.fakturaland}
                onChange={(e) => setFormData({ ...formData, fakturaland: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fakturaland && <p className="text-red-500 text-sm md:text-lg">{errors.fakturaland}</p>}
            </div>                         
            {/* Prioritering */}
            <h1 className="font-mina text-2xl pt-4">Prioritering og valg:</h1>
            <div>
                <label htmlFor="priority1" className="block text-sm md:text-lg font-semibold">Førstevalg:</label>
                <select
                id="prority1"
                name="prority1"
                value={formData.priority1}
                onChange={(e) => setFormData({ ...formData, priority1: e.target.value})}
                className="w-full h-10 p-2 border border-gray-300 rounded-md text-slate-700"
                
                >
                    <option value="" disabled>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                </select>
                {errors.priority1 && <p className="text-red-500 text-sm md:text-lg">{errors.priority1}</p>}
            </div>

            <div>
                <label htmlFor="priority2" className="block text-sm md:text-lg font-semibold">Andrevalg:</label>
                <select
                id="prority2"
                name="prority2"
                value={formData.priority2}
                onChange={(e) => setFormData({ ...formData, priority2: e.target.value})}
                className="w-full h-10 p-2 border border-gray-300 rounded-md text-slate-700"
                
                >
                    <option value="" disabled>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                    <option value="onsker_ikke_2">Ønsker ikke andrevalg</option>
                </select>
                {errors.priority2 && <p className="text-red-500 text-sm md:text-lg">{errors.priority2}</p>}
            </div>

            <div>
                <label htmlFor="priority3" className="block text-sm md:text-lg font-semibold">Tredjevalg:</label>
                <select
                id="prority3"
                name="prority3"
                value={formData.priority3}
                onChange={(e) => setFormData({ ...formData, priority3: e.target.value})}
                className="w-full h-10 p-2 border border-gray-300 rounded-md text-slate-700"
                >
                    <option value="" disabled>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                    <option value="onsker_ikke_3">Ønsker ikke tredjevalg</option>
                </select>
                {errors.priority3 && <p className="text-red-500 text-sm md:text-lg">{errors.priority3}</p>}
            </div>
            {(formData.priority1 === "musikk" || formData.priority2 === "musikk" || formData.priority3 === "musikk") && 
                <div>
                    <label htmlFor="hovedinstrument" className="block text-sm md:text-lg font-semibold">Hovedinstrument:</label>
                    <input
                    type="text"
                    placeholder="Hovedinstrument"
                    id="hovedinstrument"
                    name="hovedinstrument"
                    value={formData.hovedinstrument}
                    onChange={(e) => setFormData({ ...formData, hovedinstrument: e.target.value})}
                    className="w-full h-10 p-2 border border-gray-300 rounded-md text-slate-700"
                    />
                    {errors.hovedinstrument && <p className="text-red-500 text-sm md:text-lg">{errors.hovedinstrument}</p>}
                </div>
            }

            <div>
                <label htmlFor="sprakvalg" className="block text-sm md:text-lg font-semibold">Valg av fremmedspråk:</label>
                <select
                id="sprakvalg"
                name="sprakvalg"
                value={formData.sprakvalg}
                onChange={(e) => setFormData({ ...formData, sprakvalg: e.target.value})}
                className="w-full h-10 p-2 border border-gray-300 rounded-md text-slate-700"
                
                >
                    <option value="" disabled>Velg</option>
                    <option value="fransk2">Fransk 2 (hadde fransk på ungdomsskolen)</option>
                    <option value="spansk2">Spansk 2 (hadde spansk på ungdomsskolen)</option>
                    <option value="tysk1">Tysk 1 (hadde ikke tysk på ungdomsskolen)</option>
                    <option value="tysk2">Tysk 2 (hadde tysk på ungdomsskolen)</option>
                </select>
                {errors.sprakvalg && <p className="text-red-500 text-sm md:text-lg">{errors.sprakvalg}</p>}
            </div>
            <div>
                <label htmlFor="opptaksprove" className="block text-sm md:text-lg font-semibold">Ønsker du frivillig opptaksprøve? Kan gi ekstra poeng.</label>
                <select
                id="opptaksprove"
                name="opptaksprove"
                value={formData.opptaksprove}
                onChange={(e) => setFormData({ ...formData, opptaksprove: e.target.value})}
                className="w-full h-10 p-2 border border-gray-300 rounded-md text-slate-700"
                >
                    <option value="" disabled>Velg</option>
                    <option value="ja">Ja, jeg ønsker opptaksprøve.</option>
                    <option value="nei">Nei, jeg ønsker ikke opptaksprøve. </option>

                </select>
                {errors.opptaksprove && <p className="text-red-500 text-sm md:text-lg">{errors.opptaksprove}</p>}
            </div>     
            <div>
                <label htmlFor="leiemac" className="block text-sm md:text-lg font-semibold">Ønsker du å leie mac (pc) av skolen?</label>
                <select
                id="leiemac"
                name="leiemac"
                value={formData.leiemac}
                onChange={(e) => setFormData({ ...formData, leiemac: e.target.value})}
                className="w-full h-10 p-2 border border-gray-300 rounded-md text-slate-700"
                >
                    <option value="" disabled>Velg</option>
                    <option value="ja">Ja, jeg ønsker å leie mac av skolen.</option>
                    <option value="nei">Nei takk. </option>

                </select>
                {errors.leiemac && <p className="text-red-500 text-sm md:text-lg">{errors.leiemac}</p>}
            </div>                         
    
            {/* CV opplasting */}
            <div className="w-full pt-8">
                <button id="expand_button" className="w-full border-2 border-transparent hover:bg-blue-400 rounded-lg bg-blue-500 p-2 font-mina font-normal text-2xl mb-6" 
                    onClick={(event) => handleExpand(event)}
                >
                    Last opp karakterkort
                </button>
                        <div id="expand_div" ref={divRef} className="hidden mb-8 rounded-xl ">

                            <label htmlFor="resume" className="block text-sm md:text-lg font-semibold"></label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="resume"
                                accept=".pdf,.doc,.docx,.jpeg,.png,.jpg,.webp,.heic,.heif,.avif,.dng,.vsd,.vsdx,.pages,.tiff,.bmp"
                                name="resume"
                                onChange={(e) => setFormData({ ...formData, resume: e.target.files ? e.target.files[0] : null})}
                                className="w-full p-4 border-2 border-moreredish rounded-md text-white text-xl animate-highlight-fileinput bg-black/40"
                            />
                            {errors.resume && <p className="text-red-500 text-sm md:text-lg">{errors.resume}</p>}
                        </div>
            {/* Submit Button */}
                    <div>
                        <button
                        type="submit"
                        className="w-full p-2 bg-moreredish text-white rounded-md text-2xl font-mina border-2 border-transparent hover:bg-redish"
                        >
                        Send søknad
                        </button>
                    
                </div>
            </div>
            </form>
            <Link href="/" className="w-full h-[48px] text-2xl font-mina mt-8 flex justify-center items-center bg-blue-800 opacity-70 hover:bg-blue-600 rounded-md mb-16">Tilbake til hovedsiden</Link>
            
        </div>
    </div>
    );
    
}

export default Soknad;
