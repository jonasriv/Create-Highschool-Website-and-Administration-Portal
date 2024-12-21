import Image from 'next/image';
import BackgroundImage from '../../public/images/background_no_logo.jpg'
import Logo from  '../../public/images/logo-header.svg'

const Front = () => {
    return (
        <div 
            className="flex flex-col justify-center items-center h-56 md:h-96 md:min-h-96 overflow-scroll"
            style={{
                backgroundImage: `url(${BackgroundImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                //filter: 'brightness(80%)',
            }}
        >
            <Image alt="image" src={Logo} className="w-52"></Image>
            <button id="apply_big">Søk nå</button>
        </div>
    )
}

export default Front;