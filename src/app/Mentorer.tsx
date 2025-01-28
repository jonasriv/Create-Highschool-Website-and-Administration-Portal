'use client';

const Mentorer = () => {
    const mona = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063126/mentor-mona_eof2rp.jpg';
    const rolf = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063126/mentor-rolf_uu6loe.jpg';
    const ellen = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063126/mentor-ellen_we1acg.jpg';
    const onklP = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063126/mentor-onklp_ijov8y.jpg';
    const makosir = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063269/Makosir_WMG2_qqtg0h.jpg';
    const mathilde = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063340/storm_ubxp3f.png';
    

    return (
        <div 
            
            className="flex flex-col justify-center items-center w-screen max-w-screen h-auto"
        >          
            <div className="w-screen h-full gap-20 flex flex-col justify-center items-center max-w-screen pt-16">
                <div className="flex flex-col justify-center items-center w-full px-4 font-black gap-2 break-keep">
                    <h1 className="pb-4 text-2xl md:text-4xl font-mina">Noen av våre mentorer:</h1>
                    <div className="w-auto h-auto max-w-screen-sm lg:max-w-screen-md grid grid-cols-2 md:grid-cols-3 gap-2 justify-center items-center rounded-3xl">
                        <div className="h-48 w-42 md:h-56 md:w-56 rounded-none flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${mona})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <p className="font-mina w-full min-w-full bg-white/50 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-none text-center flex items-center justify-center">Mona Berntsen</p>
                        </div>
                        <div  className="h-48 w-42 md:h-56 md:w-56 rounded-none flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${ellen})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                backgroundRepeat: 'no-repeat'
                            }}>
                            <p className="font-mina w-full min-w-full bg-white/50 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-none text-center flex items-center justify-center">Ellen Andrea Wang</p>
                        </div>
                        <div className="h-48 w-42 md:h-56 md:w-56 rounded-none flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${onklP})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                backgroundRepeat: 'no-repeat'
                            }}>
                            <p className="font-mina w-full min-w-full bg-white/50 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-none text-center flex items-center justify-center">Onkl P</p>
                        </div>
                        <div className="h-48 w-42 md:h-56 md:w-56 rounded-none flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${makosir})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                backgroundRepeat: 'no-repeat'
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/50 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-none text-center flex items-center justify-center">Makosir</p>
                        </div>
                        <div className="h-48 w-42 md:h-56 md:w-56 rounded-none flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${rolf})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                backgroundRepeat: 'no-repeat'
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/50 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-none text-center flex items-center justify-center">Rolf Kristian Larsen</p>
                        </div>
                        <div className="h-48 w-42 md:h-56 md:w-56 rounded-none flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${mathilde})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'top',
                                backgroundRepeat: 'no-repeat'
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/50 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-none text-center flex items-center justify-center">Mathilde Storm</p>
                        </div> 
                    </div>                       
                </div>


                <div className="flex flex-col w-96 items-center justify-around gap-8"
 >
                </div>
            </div>  
        </div>
    )
}

export default Mentorer;
