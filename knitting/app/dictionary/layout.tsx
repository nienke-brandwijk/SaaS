"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function DictionaryLayout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    // Sample dictionary words
    const dictionaryWords = [
        'knit stitch',
        'purl stitch',
        'italian cast on',
        'W1R',
        'W1L',
        'long tail cast on',
        'provisional cast on',
        'bind off',
        'k2tog',
        'ssk',
        'yo',
        'm1l',
        'm1r',
        'tink',
        'frog',
        'gauge',
        'blocking',
        'short rows',
        'stockinette stitch',
        'garter stitch',
        'ribbing',
        'seed stitch',
        'cable stitch',
        'slip stitch',
        'selvedge stitch',
        'lace knitting',
        'fair isle',
        'intarsia',
        'magic loop',
        'dpn',
        'blocking mats',
        'notions',
    ];

    const filteredWords = dictionaryWords.filter(word =>
        word.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Convert word to URL-friendly slug
    const wordToSlug = (word: string) => {
        return word.toLowerCase().replace(/\s+/g, '-');
    };

    // Check if a word is currently selected based on URL
    const isWordSelected = (word: string) => {
        const slug = wordToSlug(word);
        return pathname === `/dictionary/${slug}`;
    };

    const handleWordClick = (word: string) => {
        const slug = wordToSlug(word);
        router.push(`/dictionary/${slug}`);
    };

    return (
        <div className="flex h-[calc(100vh-100vh/9)] overflow-hidden relative">
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
            
            {/* Sidebar - 1/5 width */}
            {isOpen && (
                <aside className="w-1/5 h-full flex-none bg-bgSidebar bg-[url('/background.svg')] p-6 flex flex-col gap-6">
                    <div className="border-deviderNavbar">
                        <h2 className="font-bold text-txtBold text-2xl mb-2">Dictionary</h2>
                        
                        {/* Search bar */}
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search words..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="grow"
                            />
                            <MagnifyingGlassIcon className="w-4 h-4 opacity-70" />
                        </label>
                    </div>
                    
                    {/* Scrollable word list */}
                    <div className="flex-1 overflow-y-auto">
                        <ul>
                            {filteredWords.length > 0 ? (
                                filteredWords.map((word, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => handleWordClick(word)}
                                            className={`w-full text-left px-4 py-2 rounded ${
                                                isWordSelected(word)
                                                    ? 'bg-colorBtn text-txtColorBtn'
                                                    : 'text-txtDefault hover:bg-bgHover'
                                            }`}
                                        >
                                            {word}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="text-txtSoft">
                                    No words found
                                </li>
                            )}
                        </ul>
                    </div>
                </aside>
            )}

            {/* Main content area */}
            <main className="relative flex-1 bg-white p-6 overflow-y-auto flex justify-center mx-auto">
                <div className="w-full max-w-4xl">
                    {children}
                </div>
            </main>
        </div>    
    );
}