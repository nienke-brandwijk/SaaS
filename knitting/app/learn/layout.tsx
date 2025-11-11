'use client'

import Contents from "../ui/learn/contents";
import Buttons from "../ui/learn/buttons";
import { useState } from "react";

export default function Layout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex h-screen relative">
            {/* Toggle button - altijd zichtbaar */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`btn absolute top-2 z-10 px-4 py-2 ${isOpen ? 'left-[calc(20%-4rem)]' : 'left-2'}`}
            >
                {isOpen ? '❮❮❮' : '❯❯❯'}
            </button>
            
            {/* table of contents - 1/5 width */}
            {isOpen && (
                <aside className="w-1/5 h-full flex-none bg-stone-100 p-6 px-1">
                    <Contents />
                </aside>
            )}

            {/* content - 4/5 width */}
            <main className="relative w-4/5 bg-white flex-1 grow p-6">
                <Buttons />
                {children}  
            </main>
        </div>    
    );
}