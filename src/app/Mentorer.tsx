'use client';

const Mentorer = () => {
    const mona = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063126/mentor-mona_eof2rp.jpg';
    const rolf = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063126/mentor-rolf_uu6loe.jpg';
    const ellen = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063126/mentor-ellen_we1acg.jpg';
    const onklP = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738313485/IMG_3728_o0hla2.jpg';
    const makosir = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738313068/Makosir_WMG2_qqtg0h_c_crop_w_2200_jhk6yh.jpg';
    const mathilde = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738063340/storm_ubxp3f.png';
    const synne = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738313128/Synnevo_Presseshoot_Robinboee-5680_y5oxzi_c_crop_w_1000_h_1200_nktmlp.jpg';
    const polsa = 'https://res.cloudinary.com/dtg4y0rod/image/upload/v1738072911/mentor-polsa_hazosj.png';
    

    return (
        <div 
            
            className="flex flex-col justify-center items-center w-screen max-w-screen h-auto"
        >          
            <div className="w-screen h-full gap-20 flex flex-col justify-center items-center max-w-screen pt-16 ">
                <div className="flex flex-col justify-center items-center w-full px-4 font-black gap-2 mt-4 break-keep xl:bg-black/40 xl:max-w-screen-lg xl:rounded-xl xl:pb-12">
                    <h1 className="pb-4 text-2xl md:text-4xl font-mina">Noen av våre mentorer:</h1>
                    <div className="w-auto h-auto max-w-screen-sm lg:max-w-screen-lg grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-8">
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-top bg-no-repeat"
                            style={{
                                backgroundImage: `url(${mona})`,
                            }}
                        >
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Mona Berntsen</p>
                        </div>
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-top bg-no-repeat"
                            style={{
                                backgroundImage: `url(${ellen})`,
                            }}>
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Ellen Andrea Wang</p>
                        </div>
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-bottom bg-no-repeat"
                            style={{
                                backgroundImage: `url(${onklP})`,
                                }}>
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Onkl P</p>
                        </div>
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-top bg-no-repeat"
                            style={{
                                backgroundImage: `url(${makosir})`,
                                
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Makosir</p>
                        </div>
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-top bg-no-repeat"
                            style={{
                                backgroundImage: `url(${rolf})`,
                                
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Rolf Kristian Larsen</p>
                        </div>
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-top bg-no-repeat"
                            style={{
                                backgroundImage: `url(${mathilde})`,
                                
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Mathilde Storm</p>
                        </div> 
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-top bg-no-repeat"
                            style={{
                                backgroundImage: `url(${synne})`,
                                
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Synne Vo</p>
                        </div> 
                        <div className="h-48 w-42 lg:h-56 lg:w-56 rounded-lg flex justify-center items-end bg-cover bg-top bg-no-repeat"
                            style={{
                                backgroundImage: `url(${polsa})`,
                                
                            }}                        >
                            <p className="font-mina w-full min-w-full bg-white/70 text-black text-lg md:text-xl min-h-8 md:min-h-12 rounded-b-lg text-center flex items-center justify-center">Øystein Pettersen</p>
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
