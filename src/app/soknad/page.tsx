'use client'
import React, { useState, useRef } from "react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import GetTextContent from "../GetTextContent";
const Header = dynamic(() => import("./HeaderSoknad"));

const Soknad = () => {
    const divRef = useRef<HTMLDivElement | null>(null);
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
        resume: File | null;
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
        resume: null,
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
        resume: '',
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
            opptaksprove: formData.priority3 ? '' : 'Du må velge om ønsker frivillig opptaksprøve',
            resume: formData.resume ? '' : 'Du må laste opp en karakterutskrift',
        };
        setErrors(newErrors);
        return Object.values(newErrors).every((error) => !error);
    }
    
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
                formDataToSend.append('opptaksprove', formData.opptaksprove); 
                formDataToSend.append('resume', formData.resume as File); 
    
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
                    resume: null,
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
                    <GetTextContent contentKey="soknad_intro"/>
                </div>
                <p className="text-lg text-white mt-4">Søknadsfrist 1. mars</p>
            </div>
            <h1 className="text-2xl font-bold mb-6 pt-8 font-mina w-full text-center">Søknadsskjema</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
    
            {/* Prioritering */}
            <h1 className="font-mina text-2xl pt-4">Prioritering:</h1>
            <div>
                <label htmlFor="priority1" className="block text-sm md:text-lg font-semibold">Førstevalg:</label>
                <select
                id="prority1"
                name="prority1"
                value={formData.priority1}
                onChange={(e) => setFormData({ ...formData, priority1: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                
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
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                
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
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                >
                    <option value="" disabled>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                    <option value="onsker_ikke_3">Ønsker ikke tredjevalg</option>
                </select>
                {errors.priority3 && <p className="text-red-500 text-sm md:text-lg">{errors.priority3}</p>}
            </div>      
            <div>
                <label htmlFor="opptaksprove" className="block text-sm md:text-lg font-semibold">Ønsker du frivillig opptaksprøve? Kan gi ekstra poeng.</label>
                <select
                id="opptaksprove"
                name="opptaksprove"
                value={formData.opptaksprove}
                onChange={(e) => setFormData({ ...formData, opptaksprove: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                >
                    <option value="" disabled>Velg</option>
                    <option value="ja">Ja, jeg ønsker opptaksprøve.</option>
                    <option value="nei">Nei, jeg ønsker ikke opptaksprøve. </option>

                </select>
                {errors.priority3 && <p className="text-red-500 text-sm md:text-lg">{errors.priority3}</p>}
            </div>                
    
            {/* CV opplasting */}
            <div className="w-full">
                <button id="expand_button" className="w-full border-2 border-transparent hover:bg-redpink rounded-lg bg-blue-500 p-2 font-mina font-normal text-xl mb-6" 
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
                                className="w-full p-4 border-2 border-pinky rounded-md text-white text-xl animate-highlight-fileinput bg-black/40"
                            />
                            {errors.resume && <p className="text-red-500 text-sm md:text-lg">{errors.resume}</p>}
                        </div>
            {/* Submit Button */}
                    <div>
                        <button
                        type="submit"
                        className="w-full p-2 bg-pinky text-white rounded-md text-2xl font-mina border-2 border-transparent hover:bg-redpink"
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
