'use client'
import React, { useState } from "react";
import { SunDim, Moon } from "lucide-react";
import { useElevStore } from "@/app/elev/store";

const DarkSlider: React.FC = () => {
    const dark = useElevStore((s) => s.dark);
    const toggleDark = useElevStore((s) => s.actions.toggleDark);
    const [spinning, setSpinning] = useState(false);
    
    function handleClick() {
        setSpinning(true);
        setTimeout(() => {
            toggleDark();
            setSpinning(false);    
        }, 500);
        
    }
    return (
        <div 
            title="Dark mode"
            onClick={() => handleClick()}
            className={`w-7 h-7 bg-white/40 rounded-full flex items-center justify-center cursor-pointer ${spinning && "animate-spin animation-duration:0.1s] [animation-timing-function:linear]"} `}
        >
        {dark === true ? <Moon color="lightblue" size="14"/> : <SunDim color="gold" size="16"/>}
        </div>
    )
}

export default DarkSlider;