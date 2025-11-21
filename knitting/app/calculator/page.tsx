"use client";

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

    // Validation helper
    const isValidPositive = (value: string) => {
        const num = Number(value);
        return value !== '' && !isNaN(num) && num > 0;
    };

    // Check if all yarn calculator inputs are valid
    const isYarnCalculatorValid = () => {
        return isValidPositive(patternGrams) &&
               isValidPositive(patternLength) &&
               isValidPositive(patternWeight) &&
               isValidPositive(yourLength) &&
               isValidPositive(yourWeight);
    };

    // Check if all gauge calculator inputs are valid
    const isGaugeCalculatorValid = () => {
        return isValidPositive(patternGauge) &&
               isValidPositive(yourGauge) &&
               isValidPositive(originalStitches);
    };

    // Check if all picked stitches calculator inputs are valid
    const isStitchesCalculatorValid = () => {
        return isValidPositive(stitchGauge) &&
               isValidPositive(rowGauge) &&
               isValidPositive(edgeLength);
    };

    // Get error message for invalid input
    const getInputClassName = (value: string, isTouched: boolean) => {
        const baseClass = "input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
        if (!isTouched || value === '') {
            return `${baseClass} bg-stone-100`;
        }
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
            return `${baseClass} bg-red-50 border-red-300`;
        }
        return `${baseClass} bg-stone-100`;
    };

    // Calculate functions
    const calculateYarn = () => {
        if (!isYarnCalculatorValid()) return;
        
        const metersNeeded = (Number(patternGrams) / Number(patternWeight)) * Number(patternLength);
        const metersPerBall = Number(yourLength);
        const ballsNeeded = Math.ceil(metersNeeded / metersPerBall);
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
        if (!isGaugeCalculatorValid()) return;
        
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
        if (!isStitchesCalculatorValid()) return;
        
        const ratio = Number(stitchGauge)/Number(rowGauge);
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
                                    className={getInputClassName(patternGrams, patternGrams !== '')}
                                    placeholder="e.g., 500"
                                />
                                {patternGrams !== '' && Number(patternGrams) <= 0 && (
                                    <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Length per ball (meters)
                                </label>
                                <input
                                    type="number"
                                    value={patternLength}
                                    onChange={(e) => setPatternLength(e.target.value)}
                                    className={getInputClassName(patternLength, patternLength !== '')}
                                    placeholder="e.g., 200"
                                />
                                {patternLength !== '' && Number(patternLength) <= 0 && (
                                    <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Weight per ball (grams)
                                </label>
                                <input
                                    type="number"
                                    value={patternWeight}
                                    onChange={(e) => setPatternWeight(e.target.value)}
                                    className={getInputClassName(patternWeight, patternWeight !== '')}
                                    placeholder="e.g., 100"
                                />
                                {patternWeight !== '' && Number(patternWeight) <= 0 && (
                                    <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                                )}
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
                                    className={getInputClassName(yourLength, yourLength !== '')}
                                    placeholder="e.g., 150"
                                />
                                {yourLength !== '' && Number(yourLength) <= 0 && (
                                    <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Weight per ball (grams)
                                </label>
                                <input
                                    type="number"
                                    value={yourWeight}
                                    onChange={(e) => setYourWeight(e.target.value)}
                                    className={getInputClassName(yourWeight, yourWeight !== '')}
                                    placeholder="e.g., 50"
                                />
                                {yourWeight !== '' && Number(yourWeight) <= 0 && (
                                    <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end">
                        <button 
                            onClick={calculateYarn}
                            className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-700 disabled:hover:text-orange-100"
                            disabled={!isYarnCalculatorValid()}
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
                                className={getInputClassName(patternGauge, patternGauge !== '')}
                                placeholder="e.g., 20"
                            />
                            {patternGauge !== '' && Number(patternGauge) <= 0 && (
                                <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Your gauge (stitches per 10cm)
                            </label>
                            <input
                                type="number"
                                value={yourGauge}
                                onChange={(e) => setYourGauge(e.target.value)}
                                className={getInputClassName(yourGauge, yourGauge !== '')}
                                placeholder="e.g., 22"
                            />
                            {yourGauge !== '' && Number(yourGauge) <= 0 && (
                                <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Original cast on stitches
                            </label>
                            <input
                                type="number"
                                value={originalStitches}
                                onChange={(e) => setOriginalStitches(e.target.value)}
                                className={getInputClassName(originalStitches, originalStitches !== '')}
                                placeholder="e.g., 100"
                            />
                            {originalStitches !== '' && Number(originalStitches) <= 0 && (
                                <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={calculateGauge}
                            className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-700 disabled:hover:text-orange-100"
                            disabled={!isGaugeCalculatorValid()}
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
                                className={getInputClassName(stitchGauge, stitchGauge !== '')}
                                placeholder="e.g., 18"
                            />
                            {stitchGauge !== '' && Number(stitchGauge) <= 0 && (
                                <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Row gauge (rows per 10cm)
                            </label>
                            <input
                                type="number"
                                value={rowGauge}
                                onChange={(e) => setRowGauge(e.target.value)}
                                className={getInputClassName(rowGauge, rowGauge !== '')}
                                placeholder="e.g., 22"
                            />
                            {rowGauge !== '' && Number(rowGauge) <= 0 && (
                                <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                                Edge length (cm)
                            </label>
                            <input
                                type="number"
                                value={edgeLength}
                                onChange={(e) => setEdgeLength(e.target.value)}
                                className={getInputClassName(edgeLength, edgeLength !== '')}
                                placeholder="e.g., 40"
                            />
                            {edgeLength !== '' && Number(edgeLength) <= 0 && (
                                <p className="text-red-600 text-xs mt-1">Must be greater than 0</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={calculateStitches}
                            className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-700 disabled:hover:text-orange-100"
                            disabled={!isStitchesCalculatorValid()}
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
                                className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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