'use client'
import React from "react";

interface HamburgerMenuProps {
    isOpen: boolean;
    toggleMenu: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, toggleMenu }) => {

    return (
        <button 
            onClick={toggleMenu}
            className="relative z-50 flex flex-col mt-1 gap-1 items-center w-4 h-5 bg-transparent border-none cursor-pointer"
            >
                {/*Top Line*/}
                <div
                className={`h-1 w-6 bg-slate-400 transition-all duration-600 origin-center rounded-xl ${
                isOpen ? "rotate-45 absolute top-1/2 transform -translate-y-1/2 h-1" : ""
                }`}
                ></div>
                {/*Middle Line*/}
                <div
                    className={`h-1 w-6 bg-slate-400 transition-all duration-300 rounded-xl ${
                    isOpen ? "opacity-0" : ""
                    }`}
                ></div>
                {/*Bottom Line*/}
                <div
                    className={`h-1 w-6 bg-slate-400 transition-all duration-300 origin-center rounded-xl ${
                    isOpen ? "-rotate-45 absolute top-1/2 transform -translate-y-1/2 h-1" : ""
                    }`}
                    ></div>
                </button>
    );
};

export default HamburgerMenu;