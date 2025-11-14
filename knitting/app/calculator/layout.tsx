"use client";

import { useState } from 'react';

export default function CalculatorLayout({children}: {children: React.ReactNode}) {
    const [isOpen, setIsOpen] = useState(true);
    const [savedCalculations, setSavedCalculations] = useState<Array<{
        type: string;
        input1: number;
        input2: number;
        result: string;
        timestamp: string;
    }>>([]);

    // Function to save a calculation (will be passed to children via context or props)
    const saveCalculation = (type: string, input1: number, input2: number, result: string) => {
        const newCalc = {
            type,
            input1,
            input2,
            result,
            timestamp: new Date().toLocaleString()
        };
        setSavedCalculations(prev => [newCalc, ...prev]);
    };

    return (
        <div className="flex md:overflow-hidden relative">
            {/* Main content area */}
            <div className="flex-1 grow p-6 md:p-12 bg-stone-50">
                {/* PAGE CONTENT */}
                {children}
            </div>

            {/* Toggle button - RIGHT SIDE */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`btn absolute top-2 z-10 px-4 py-2 ${isOpen ? 'right-[calc(20%-4rem)]' : 'right-2'}`}
            >
                {isOpen ? '❯❯❯' : '❮❮❮'}
            </button>
            
            {/* Sidebar - 1/5 width */}
            {isOpen && (
                <aside className="w-1/5 flex-none bg-stone-100 bg-[url('/background.svg')] p-6">
                    <div className="mb-4 border-b border-stone-300 pb-4">
                        <h2 className="text-xl font-bold mt-8 text-stone-800">Saved Calculations</h2>
                    </div>
                    
                    {/* Scrollable calculations list */}
                    <div className="flex-1 overflow-y-auto">
                        {savedCalculations.length > 0 ? (
                            <ul className="space-y-3">
                                {savedCalculations.map((calc, index) => (
                                    <li key={index} className="bg-white p-3 rounded shadow-sm border border-stone-200">
                                        <p className="font-semibold text-sm text-orange-700">{calc.type}</p>
                                        <p className="text-xs text-stone-600 mt-1">
                                            Input: {calc.input1} × {calc.input2}
                                        </p>
                                        <p className="text-sm text-stone-800 mt-1">
                                            Result: {calc.result}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-1">{calc.timestamp}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-stone-500 italic text-sm">No saved calculations yet</p>
                        )}
                    </div>

                    {/* Clear button */}
                    {savedCalculations.length > 0 && (
                        <button 
                            onClick={() => setSavedCalculations([])}
                            className="btn btn-sm btn-outline w-full mt-4"
                        >
                            Clear All
                        </button>
                    )}
                </aside>
            )}
        </div>    
    );
}