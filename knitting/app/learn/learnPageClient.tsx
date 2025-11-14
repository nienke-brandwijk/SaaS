'use client'

import Contents from "../ui/learn/contents";
import Buttons from "../ui/learn/buttons";
import { useState } from "react";
import Link from "next/link";

export default function Layout({user, children}: { user: any, children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);
    const progress = user?.learn_process

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
                <aside className="w-1/5 h-full flex-none bg-stone-100 p-6 px-1 flex flex-col">
                    {/* Table of Contents */}
                    <div className="flex-1 overflow-y-auto">
                        <Contents />
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                        {progress !== undefined ? (
                            <div className="relative w-3/4 bg-gray-300 rounded-full h-6">
                                <div
                                    className="bg-orange-700 h-6 rounded-full text-white flex items-center justify-center transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                >
                                    <span className="text-white font-semibold text-sm">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-700 text-sm p-2">
                                Want to see your progress?{' '}
                                <Link href="/login">
                                    <a className="text-orange-700 underline">Sign in</a>
                                </Link>
                            </div>
                        )}
                    </div>  
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