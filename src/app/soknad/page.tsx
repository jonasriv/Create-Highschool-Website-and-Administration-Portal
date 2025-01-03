
'use client'
import { useState } from "react";
import dynamic from "next/dynamic";
import BackgroundImage2 from '../../../public/images/gpt-background2.webp';
import Link from 'next/link';
const Header = dynamic(() => import("./HeaderSoknad"));


const Soknad = () => {

    type FormData = {
        fullName: string;
        email: string;
        phone: string;
        priority1: string;
        priority2: string;
        priority3: string;
        resume: File | null;
    }
    const [ formData, setFormData ] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        priority1: '',
        priority2: '',
        priority3: '',
        resume: null,
    });

    const [ errors, setErrors ] = useState({
        fullName: '',
        email: '',
        phone: '',
        priority1: '',
        priority2: '',
        priority3: '',
        resume: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev => ({ ...prev, [name]: value })));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0]; // Sjekker om files finnes og henter første element
        if (file) {
          setFormData((prev) => ({
            ...prev,
            resume: file,
          }));
        }
      };

    const validateForm = () => {
        const newErrors = {
            fullName: formData.fullName ? '' : 'Fullt navn er påkrevd',
            email: formData.email ? '' : 'E-post er påkrevd',
            phone: formData.phone ? '' : 'Telefonnummer er påkrevd',
            priority1: formData.priority1 ? '' : 'Du må velge en førsteprioritet',
            priority2: formData.priority2 ? '' : 'Du må velge en andreprioritet',
            priority3: formData.priority3 ? '' : 'Du må velge en tredjeprioritet',
            resume: formData.resume ? '' : 'Du må laste opp en karakterutskrift',
        };
        setErrors(newErrors);

        return Object.values(newErrors).every((error) => !error);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.resume) {
            alert('Please upload your resume!');
            return;
          }

        if(validateForm()) {
            try {
                // Opprett FormData-objekt for å håndtere filopplasting:
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.fullName); 
                formDataToSend.append('email', formData.email); 
                formDataToSend.append('phone', formData.phone); 
                formDataToSend.append('priority1', formData.priority1); 
                formDataToSend.append('priority2', formData.priority2); 
                formDataToSend.append('priority3', formData.priority3); 
                formDataToSend.append('resume', formData.resume as File); 

                //Send Post-forespørsel til API: 
                const response = await fetch('api/applications', {
                    method: 'POST', 
                    body: formDataToSend,
                });

                if (!response.ok) {
                    throw new Error('Noe gikk galt. Prøv igjen senere');
                }

                const data = await response.json();
                console.log('Søknaden ble sendt inn', data);

                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    priority1: '',
                    priority2: '',
                    priority3: '',
                    resume: null,
                });

                alert('Søknaden ble sendt inn!');
            } catch (error) {
                console.error('Error:', error);
                alert('Kunne ikke sende inn søknaden. Prøv igjen senere');
            }
        }
    };

    return (
        <div 
        className="flex flex-col h-auto min-h-screen w-screen bg-white/40 "
        style={{
          backgroundImage: `url(${BackgroundImage2.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          //filter: 'brightness(80%)',
      }}  >
            <Header/>
            <div className="w-full h-20 md:h-24 mt-4"></div>
            <div className="max-w-screen-lg mb-8 w-11/12 mx-auto p-6 bg-slate-600 rounded-lg shadow-lg md:24 flex flex-col">
            <div className="">
                <h1 className="font-bahiana text-4xl md:text-6xl mb-4">
                    Bli en del av Create!
                </h1>
                <p className="font-mina text-lg md:text-2xl">
                Create tar imot søkere fra hele landet. I 2024 tar vi hovedsaklig inn elever til vg1. Det er også mulig å søke på vg2 og vg3, der vi vil ta inn elever etter ledig kapasitet. Det går fint å søke på flere forskjellige skoler. Du bestemmer selv hvilken skole du vil gå på etter at du har fått tilbud om skoleplass. Opptaket starter 15. mars. Det koster kr 22.500 per skoleår å gå på CREATE.
                </p>
            </div>
            <h1 className="text-4xl font-bold mb-6 pt-8 font-mina">Søknadsskjema</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fullt navn */}
            <div>
                <label htmlFor="fullName" className="block text-sm md:text-lg font-semibold">Fullt navn</label>
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
                <label htmlFor="email" className="block text-sm md:text-lg font-semibold">E-post</label>
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
    
            {/* Telefonnummer */}
            <div>
                <label htmlFor="phone" className="block text-sm md:text-lg font-semibold">Telefonnummer</label>
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
            <h1 className="font-mina text-3xl">Prioritering:</h1>
            <div>
                <label htmlFor="priority1" className="block text-sm md:text-lg font-semibold">Førstevalg</label>
                <select
                id="prority1"
                name="prority1"
                value={formData.priority1}
                onChange={(e) => setFormData({ ...formData, priority1: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                
                >
                    <option>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                </select>
                {errors.priority1 && <p className="text-red-500 text-sm md:text-lg">{errors.priority1}</p>}
            </div>

            <div>
                <label htmlFor="priority2" className="block text-sm md:text-lg font-semibold">Andrevalg</label>
                <select
                id="prority2"
                name="prority2"
                value={formData.priority2}
                onChange={(e) => setFormData({ ...formData, priority2: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                
                >
                    <option>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                </select>
                {errors.priority2 && <p className="text-red-500 text-sm md:text-lg">{errors.priority2}</p>}
            </div>

            <div>
                <label htmlFor="priority3" className="block text-sm md:text-lg font-semibold">Tredjevalg</label>
                <select
                id="prority3"
                name="prority3"
                value={formData.priority3}
                onChange={(e) => setFormData({ ...formData, priority3: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                
                >
                    <option>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                </select>
                {errors.priority3 && <p className="text-red-500 text-sm md:text-lg">{errors.priority3}</p>}
            </div>      
    
            {/* CV opplasting */}
            <div>
                <h1 className="font-mina text-3xl">Last opp karakterkort * :</h1>
                <label htmlFor="resume" className="block text-sm md:text-lg font-semibold"></label>
                <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx,.jpeg,.png,.jpg,.webp,.tiff,.bmp,.gif"
                name="resume"
                onChange={(e) => setFormData({ ...formData, resume: e.target.files ? e.target.files[0] : null})}
                className="w-full p-4 border border-gray-300 rounded-md text-white text-xl "
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
            </form>
            <Link href="/" className="w-full h-[48px] text-2xl font-mina mt-8 flex justify-center items-center bg-blue-800 opacity-70 hover:bg-blue-600 rounded-md mb-16">Tilbake til hovedsiden</Link>
            <div>
                * Opplastede bilder/pdf av karakterkort lagres i opptil 12 måneder for søknadsprosessen og slettes deretter automatisk. Ingen data deles med tredjeparter. 
            </div>
        </div>
    </div>
    );
    
}

export default Soknad;