'use client'

import Queue from "../ui/create/queue";
import { useState } from "react";

export default function Layout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <div className="flex relative">
            <div className="relative w-4/5 bg-bgDefault flex-1 grow px-8 py-2">
                {/* PAGE CONTENT */}
                {children}
            </div>

            {/* Toggle button - altijd zichtbaar */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`btn absolute top-2 px-2 ${isOpen ? 'right-60' : 'right-2'}`}
            >
                {isOpen ? '❯❯❯' : '❮❮❮'}
            </button>

            {isOpen && (
                <div className="w-1/5 flex-none bg-bgSidebar p-8 bg-[url('/background.svg')]">
                    <Queue />
                </div>
            )}
        </div>
    );

        {/*<div className="flex h-screen md:flex-row md:overflow-hidden">
            
            <div className="flex-1 grow p-6 md:overflow-y-auto md:p-12">
                {children}
            </div>
            <div className="top-0 right-0 w-full flex-none md:w-64">
                <Queue />
            </div>
        </div>*/}

        
    
}