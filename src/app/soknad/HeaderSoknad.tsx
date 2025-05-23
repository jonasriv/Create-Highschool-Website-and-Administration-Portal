'use client'
import Image from 'next/image';
import logo from '../../../public/images/logo-header.svg';
import Link from "next/link";

const Header = () => {


    return (
        <header>
            <div 
                className='flex fixed flex-row gap-1 justify-center items-center w-screen max-w-screen bg-black/60 h-20 p-4 z-50 backdrop-blur-lg'
            >
                <div className="flex justify-between items-center max-w-screen-lg w-screen h-full">
                    <div className="cursor-pointer">
                        <Link href ="/">
                        <Image 
                            src={logo}
                            alt="Create logo..."
                            id="logo"
                        />
                        </Link>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
