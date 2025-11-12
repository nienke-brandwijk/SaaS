'use client'

import Contents from "../ui/learn/contents";
import Buttons from "../ui/learn/buttons";
import { useState } from "react";

export default function Layout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex h-screen relative">    {/* h-screen = use full height of screen (buttons are at the bottom) */}
            {/* Toggle button - altijd zichtbaar */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`btn absolute top-2 px-4 py-2 ${isOpen ? 'left-[calc(20%-4rem)]' : 'left-2'}`}
            >
                {isOpen ? '❮❮❮' : '❯❯❯'}
            </button>
            
            {/* table of contents - 1/5 width */}
            {isOpen && (
                <aside className="w-1/5 bg-bgSidebar p-8 overflow-y-auto">  {/* overflow-y-auto so content can scroll independently */}
                    <Contents />
                </aside>
            )}

            {/* content - 4/5 width */}
            <main className="bg-white flex-1 grow py-8 px-16 flex flex-col overflow-y-auto"> {/* overflow-y-auto so content can scroll independently */}
                 <div className="flex-1 mb-8">
                    {children}
                </div>
                <Buttons />
            </main>
        </div>    
    );
}