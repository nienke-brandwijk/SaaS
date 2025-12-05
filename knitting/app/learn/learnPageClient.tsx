'use client'

import Contents from "../ui/learn/contents";
import Buttons from "../ui/learn/buttons";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Layout({user, children}: { user: any, children: React.ReactNode}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    let [progress, setProgress] = useState(user?.learn_process - 1 || 0);
    if (progress == -1) {
        progress = 0;
    }
    let progressPercent = Math.round((progress / 7) * 100);
    if (progressPercent > 100) {
        progressPercent = 100;
    }
    return (
        <div className="flex h-screen relative">
            {/* Toggle button - altijd zichtbaar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`absolute top-6 z-40 bg-bgSidebar p-2 hover:bg-stone-200 transition-all duration-300 rounded-r-lg
                        ${isOpen ? "left-[calc(20%-0rem)]" : "left-0"}`}
            >
                {isOpen ? (
                <ChevronLeftIcon className="w-6 h-6 text-txtDefault" />
                ) : (
                <ChevronRightIcon className="w-6 h-6 text-txtDefault" />
                )}
            </button>
            
            {/* table of contents - 1/5 width */}
            {isOpen && (
                <aside className="w-1/5 h-full flex-none bg-bgSidebar bg-[url('/background.svg')] px-1 flex flex-col">
                    {/* Table of Contents */}
                    <div className="flex-1 overflow-y-auto">
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