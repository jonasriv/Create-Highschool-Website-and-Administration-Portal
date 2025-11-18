'use client'


const Footer = () => {
    const date = new Date();
    const Year = date.getFullYear();

    return (
        <footer>
        <div 
            className='w-screen bg-black/60 h-24 lg:h-32 z-50 backdrop-blur-lg flex justify-center'
        >
            <div className="flex h-full flex-col justify-center items-center w-full max-w-screen-lg gap-2 font-roboto normal-case">
                <div>
                    <p className="font-roboto text-md pt-4">
                        &copy; Create {Year}
                    </p>           
                </div>
                <div>
                    <p className="text-sm pb-4">
                        Lillehammer kreative videregående skole
                    </p>
                </div>
            </div>            
        </div>

    </footer>
    )
}

export default Footer;