import Image from 'next/image';
import BackgroundImage from '../../public/images/background_no_logo.jpg'
import Logo from  '../../public/images/logo-header.svg'
import { ChevronDown } from 'lucide-react';

const Front = () => {
    return (
        <div 
            id="front"
            className="flex flex-col justify-center items-center w-screen max-w-screen h-screen"
            style={{
                backgroundImage: `url(${BackgroundImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                //filter: 'brightness(80%)',
            }}
        >
            <div className="w-screen h-screen bg-black/80 uppercase gap-20 flex flex-col justify-center items-center pt-36 max-w-screen">
                <Image alt="image" src={Logo} className="w-36 mt-6 md:w-72"></Image>
                <div className="flex flex-col md:flex-row width-screen px-8 tracking-widest font-bahiana text-4xl md:text-4xl">
                    <h1 className="text-center leading-loose">
                        Lillehammer kreative
                    </h1>
                    <h1 className="text-center leading-loose">
                        videregående skole
                    </h1>
                </div>
                <button className="bg-pinky w-52 md:w-72 h-20 flex justify-center items-center md:h-auto text-2xl md:text-5xl p-10 rounded-3xl font-black uppercase text-slate-200 border-2 border-transparent hover:border-white hover:text-white">Søk nå</button>
                <ChevronDown className="size-40"/>
            </div>
        </div>
    )
}

export default Front;