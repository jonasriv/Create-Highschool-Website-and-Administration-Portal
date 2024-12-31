
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
        priority: string;
        resume: File | null;
    }
    const [ formData, setFormData ] = useState<FormData>({
        fullName: '',
        email: '',
        phone: '',
        priority: '',
        resume: null,
    });

    const [ errors, setErrors ] = useState({
        fullName: '',
        email: '',
        phone: '',
        priority: '',
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
            priority: formData.priority ? '' : 'Motivasjonstekst er påkrevd',
            resume: formData.resume ? '' : 'Du må laste opp en karakterutskrift',
        };
        setErrors(newErrors);

        return Object.values(newErrors).every((error) => !error);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.resume) {
            alert('Please upload your resume!');
            return;
          }

        if(validateForm()) {
            console.log('Soknad sendt', FormData);

            setFormData({
                fullName: '', 
                email: '', 
                phone: '', 
                priority: '', 
                resume: null, 
            });
        }
    };

    return (
        <div 
        className="flex flex-col h-auto w-screen bg-white/40 "
        style={{
          backgroundImage: `url(${BackgroundImage2.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          //filter: 'brightness(80%)',
      }}  >
            <Header/>
            <div className="w-full h-20 md:h-24 mt-4"></div>
            <div className="w-11/12 mx-auto p-6 bg-slate-600 rounded-lg shadow-lg md:24 flex flex-col">
            <div>
                <h1 className="font-bahiana text-4xl mb-4">
                    Bli en del av Create!
                </h1>
                <p className="font-mina text-lg">
                Create tar imot søkere fra hele landet. I 2024 tar vi hovedsaklig inn elever til vg1. Det er også mulig å søke på vg2 og vg3, der vi vil ta inn elever etter ledig kapasitet. Det går fint å søke på flere forskjellige skoler. Du bestemmer selv hvilken skole du vil gå på etter at du har fått tilbud om skoleplass. Opptaket starter 15. mars. Det koster kr 22.500 per skoleår å gå på CREATE.
                </p>
            </div>
            <h1 className="text-3xl font-bold mb-6 pt-8">Søknadsskjema</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fullt navn */}
            <div>
                <label htmlFor="fullName" className="block text-sm font-semibold">Fullt navn</label>
                <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>
    
            {/* E-post */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold">E-post</label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
    
            {/* Telefonnummer */}
            <div>
                <label htmlFor="phone" className="block text-sm font-semibold">Telefonnummer</label>
                <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
    
            {/* Motivajonstekst */}
            <div>
                <label htmlFor="priority" className="block text-sm font-semibold">Prioritering</label>
                <select
                id="prority"
                name="prority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-slate-700"
                
                >
                    <option>Velg</option>
                    <option value="musikk">Musikk</option>
                    <option value="dans">Dans</option>
                    <option value="drama">Drama</option>
                </select>
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority}</p>}
            </div>
    
            {/* CV opplasting */}
            <div>
                <label htmlFor="resume" className="block text-sm font-semibold">Last opp karakterutskrift:</label>
                <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md text-white"
                />
                {errors.resume && <p className="text-red-500 text-sm">{errors.resume}</p>}
            </div>
    
            {/* Submit Button */}
            <div>
                <button
                type="submit"
                className="w-full p-2 bg-pinky text-white rounded-md"
                >
                Send søknad
                </button>

            </div>
            </form>
            <Link href="/">Tilbake til hovedsiden</Link>
        </div>
    </div>
    );
    
}

export default Soknad;