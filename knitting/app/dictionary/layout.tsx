"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DictionaryLayout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const pathname = usePathname();

    // Sample dictionary words
    const dictionaryWords = [
        'knit stitch', 'purl stitch', 'italian cast on', 'W1R', 'W1L',
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
        <div className="flex h-screen relative">
            {/* Toggle button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`btn absolute top-2 z-10 px-4 py-2 ${isOpen ? 'left-[calc(20%-4rem)]' : 'left-2'}`}
            >
                {isOpen ? '❮❮❮' : '❯❯❯'}
            </button>
            
            {/* Sidebar - 1/5 width */}
            {isOpen && (
                <aside className="w-1/5 h-full flex-none bg-stone-100 p-6 px-1">
                    <div className="p-4 border-b border-stone-300">
                        <h2 className="text-xl font-bold mb-3 text-stone-800">Dictionary</h2>
                        
                        {/* Search bar */}
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search words..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="grow"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                            </svg>
                        </label>
                    </div>
                    
                    {/* Scrollable word list */}
                    <div className="flex-1 overflow-y-auto">
                        <ul className="p-2">
                            {filteredWords.length > 0 ? (
                                filteredWords.map((word, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => handleWordClick(word)}
                                            className={`w-full text-left px-4 py-2 rounded transition-colors ${
                                                isWordSelected(word)
                                                    ? 'bg-orange-700 text-white'
                                                    : 'hover:bg-stone-200 text-stone-700'
                                            }`}
                                        >
                                            {word}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-stone-500 italic">
                                    No words found
                                </li>
                            )}
                        </ul>
                    </div>
                </aside>
            )}

            {/* Main content area */}
            <main className={`relative flex-1 bg-white p-6 overflow-y-auto transition-all ${
                isOpen ? '' : 'ml-20'
            }`}>
                {children}
            </main>
        </div>    
    );
}