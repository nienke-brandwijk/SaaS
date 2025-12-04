'use client'

import Contents from "../ui/learn/contents";
import Buttons from "../ui/learn/buttons";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';

export default function Layout({user, children}: { user: any, children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    let [progress, setProgress] = useState(user?.learn_process - 1 || 0);
    if (progress == -1) {
        progress = 0;
    }
    const progressPercent = Math.round((progress / 8) * 100);
    return (
        <div className="flex h-screen relative">
            {/* Toggle button - altijd zichtbaar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`btn text-txtDefault
                absolute border-none rounded-none shadow-none top-6 z-40 bg-bgSidebar p-2
                ${isOpen ? 'left-[18rem]' : 'left-4'}`}
            >
                {isOpen ? (
                    // Pijl naar links (sidebar sluiten)
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" 
                        strokeWidth={2} stroke="currentColor" 
                        className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                ) : (
                    // Pijl naar rechts (sidebar openen)
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        fill="none" viewBox="0 0 24 24" 
                        strokeWidth={2} stroke="currentColor" 
                        className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>  
                )}
            </button>
            
            {/* table of contents - 1/5 width */}
            {isOpen && (
                <aside className="w-1/5 h-full flex-none bg-bgSidebar bg-[url('/background.svg')] p-6 px-1 flex flex-col">
                    {/* Table of Contents */}
                    <div className="flex-1 overflow-y-auto mt-1">
                        <Contents progress={progress}/>
                    </div>
                    <div className="mt-4 flex flex-col items-center">
                        {user ? (
                            <div className="relative w-3/4 bg-gray-300 rounded-full h-6">
                                <div
                                    className="bg-colorBtn h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-center text-txtDefault font-semibold text-sm">
                                    {progressPercent}%
                                </span>
                            </div>
                        ) : (
                            <div className="text-center text-txtDefault text-sm p-2">
                                Want to see your progress?{' '}
                                <button onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                                    className="text-txtTransBtn underline">
                                    Sign in
                                </button>
                            </div>
                        )}
                    </div>  
                </aside>
            )}

            {/* content - 4/5 width */}
             <main className="relative w-4/5 bg-white flex-1 grow overflow-y-auto">
                <div className="min-h-full flex flex-col p-6">
                    {/* content flows naturally */}
                    <div className="flex-1 min-w-full">
                        {children}
                    </div>
                    {/* Buttons below the content, pushed to bottom when content is short */}
                    <div className="mt-8">
                        <Buttons user={user} setProgress={setProgress} />
                    </div>
                </div>
            </main>
        </div>    
    );
}