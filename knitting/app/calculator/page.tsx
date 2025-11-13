"use client";

import { use } from 'chai';
import { useState } from 'react';

export default function CalculatorPage() {
    // State for Yarn calculator - 5 inputs
    const [patternGrams, setPatternGrams] = useState('');
    const [patternLength, setPatternLength] = useState('');
    const [patternWeight, setPatternWeight] = useState('');
    const [yourLength, setYourLength] = useState('');
    const [yourWeight, setYourWeight] = useState('');
    
    // State for Gauge calculator - 3 inputs
    const [patternGauge, setPatternGauge] = useState('');
    const [yourGauge, setYourGauge] = useState('');
    const [originalStitches, setOriginalStitches] = useState('');

    // State for Picked stitches calculator - 3 inputs
    const [stitchGauge, setStitchGauge] = useState('');
    const [rowGauge, setRowGauge] = useState('');
    const [edgeLength, setEdgeLength] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalResult, setModalResult] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [calculationName, setCalculationName] = useState('');
    const [currentCalculation, setCurrentCalculation] = useState<{
        type: string;
        input1: number;
        input2: number;
        result: string;
    } | null>(null);

    // Calculate functions
    const calculateYarn = () => {
        // Bereken meters wol nodig voor het patroon
        const metersNeeded = (Number(patternGrams) / Number(patternWeight)) * Number(patternLength);
        
        // Bereken hoeveel bollen van jouw wol je nodig hebt
        const metersPerBall = Number(yourLength);
        const ballsNeeded = Math.ceil(metersNeeded / metersPerBall);
        
        // Bereken totaal gewicht
        const totalWeight = (metersNeeded / Number(yourLength)) * Number(yourWeight);
        
        setModalTitle('Yarn Amount Result');
        setModalResult(`You need ${ballsNeeded} ball(s) of your yarn (approximately ${totalWeight.toFixed(0)} grams total)`);
        setCurrentCalculation({
            type: 'Yarn Amount',
            input1: Number(patternGrams),
            input2: ballsNeeded,
            result: `${ballsNeeded} balls (${totalWeight.toFixed(0)}g)`
        });
        setShowModal(true);
    };

    const calculateGauge = () => {
        // Bereken het aantal steken dat je moet opzetten met jouw gauge
        const adjustedStitches = Math.round((Number(originalStitches) * Number(yourGauge)) / Number(patternGauge));
        
        setModalTitle('Gauge Swatch Result');
        setModalResult(`You need to cast on ${adjustedStitches} stitches with your gauge`);
        setCurrentCalculation({
            type: 'Gauge Swatch',
            input1: Number(patternGauge),
            input2: Number(yourGauge),
            result: `${adjustedStitches} stitches`
        });
        setShowModal(true);
    };

    const calculateStitches = () => {
        // Bereken de pick-up ratio
        const ratio = Number(stitchGauge)/Number(rowGauge);

        // Bereken totale aantal steken dat opgenomen moet worden
        const totalStitches = Number(edgeLength) * (Number(rowGauge)/10) * ratio;
        
        setModalTitle('Picked Stitches Result');
        setModalResult(`You need to pick up ${totalStitches.toFixed(0)} stitches in total with a pick up ratio of ${ratio.toFixed(2)}`);
        setCurrentCalculation({
            type: 'Picked Stitches',
            input1: Number(edgeLength),
            input2: ratio,
            result: `${totalStitches.toFixed(0)} stitches (${ratio.toFixed(2)})`
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (currentCalculation && calculationName.trim()) {
            console.log('Saving:', {
                name: calculationName,
                ...currentCalculation,
                timestamp: new Date().toLocaleString()
            });
            
            setCalculationName('');
            setShowModal(false);
        }
    };

    const handleClose = () => {
        setCalculationName('');
        setShowModal(false);
        setCurrentCalculation(null);
    };

    return (
        <div className="flex flex-col space-y-16">
            {/* YARN AMOUNT CALCULATOR */}
            <div className="card">
                <div className="flex items-center gap-4 py-2">
                    <h1 className="card-title font-bold">Yarn Amount Calculator</h1>
                </div>
                <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8">
                    {/* Pattern yarn info */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-stone-800 mb-3">Pattern Yarn Information</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Required amount (grams)
                                </label>
                                <input
                                    type="number"
                                    value={patternGrams}
                                    onChange={(e) => setPatternGrams(e.target.value)}
                                    className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="e.g., 500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Length per ball (meters)
                                </label>
                                <input
                                    type="number"
                                    value={patternLength}
                                    onChange={(e) => setPatternLength(e.target.value)}
                                    className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="e.g., 200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Weight per ball (grams)
                                </label>
                                <input
                                    type="number"
                                    value={patternWeight}
                                    onChange={(e) => setPatternWeight(e.target.value)}
                                    className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="e.g., 100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Your yarn info */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-stone-800 mb-3">Your Yarn Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Length per ball (meters)
                                </label>
                                <input
                                    type="number"
                                    value={yourLength}
                                    onChange={(e) => setYourLength(e.target.value)}
                                    className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="e.g., 150"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Weight per ball (grams)
                                </label>
                                <input
                                    type="number"
                                    value={yourWeight}
                                    onChange={(e) => setYourWeight(e.target.value)}
                                    className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="e.g., 50"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            onClick={calculateYarn}
                            className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition"
                            disabled={!patternGrams || !patternLength || !patternWeight || !yourLength || !yourWeight}
                        >
                            Calculate
                        </button>
                    </div>
                </div>
            </div>

            {/* GAUGE SWATCH CALCULATOR */}
            <div className="card">
                <div className="flex items-center gap-4 py-2">
                    <h1 className="card-title font-bold">Gauge Swatch Calculator</h1>
                </div>
                <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Pattern gauge (stitches per 10cm)
                            </label>
                            <input
                                type="number"
                                value={patternGauge}
                                onChange={(e) => setPatternGauge(e.target.value)}
                                className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Your gauge (stitches per 10cm)
                            </label>
                            <input
                                type="number"
                                value={yourGauge}
                                onChange={(e) => setYourGauge(e.target.value)}
                                className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 22"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Original cast on stitches
                            </label>
                            <input
                                type="number"
                                value={originalStitches}
                                onChange={(e) => setOriginalStitches(e.target.value)}
                                className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 100"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={calculateGauge}
                            className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition"
                            disabled={!patternGauge || !yourGauge || !originalStitches}
                        >
                            Calculate
                        </button>
                    </div>
                </div>
            </div>

            {/* PICKED STITCHES CALCULATOR */}
            <div className="card">
                <div className="flex items-center gap-4 py-2">
                    <h1 className="card-title font-bold">Picked Stitches Calculator</h1>
                </div>
                <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Stitch gauge (stitches per 10cm)
                            </label>
                            <input
                                type="number"
                                value={stitchGauge}
                                onChange={(e) => setStitchGauge(e.target.value)}
                                className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 18"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Row gauge (rows per 10cm)
                            </label>
                            <input
                                type="number"
                                value={rowGauge}
                                onChange={(e) => setRowGauge(e.target.value)}
                                className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 22"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Edge length (cm)
                            </label>
                            <input
                                type="number"
                                value={edgeLength}
                                onChange={(e) => setEdgeLength(e.target.value)}
                                className="input input-bordered w-full bg-stone-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="e.g., 40"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={calculateStitches}
                            className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition"
                            disabled={!rowGauge || !stitchGauge || !edgeLength}
                        >
                            Calculate
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for results with save option */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={handleClose}
                    ></div>
                    
                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 z-10 border border-stone-300">
                        <h3 className="font-bold text-lg mb-2">{modalTitle}</h3>
                        <p className="py-4 text-xl text-center bg-stone-100 rounded-lg font-semibold text-orange-700 mb-3">
                            {modalResult}
                        </p>
                        
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Give this calculation a name (optional)</span>
                            </label>
                            <input
                                type="text"
                                value={calculationName}
                                onChange={(e) => setCalculationName(e.target.value)}
                                placeholder="e.g., Sweater front panel"
                                className="input input-bordered w-full bg-stone-100"
                            />
                        </div>

                        <div className="flex gap-2 mt-6 justify-end">
                            <button 
                                className="border border-orange-700 text-orange-700 px-4 py-2 rounded-lg bg-transparent hover:bg-orange-700 hover:text-orange-100 transition"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                            <button 
                                className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition"
                                onClick={handleSave}
                                disabled={!calculationName.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}