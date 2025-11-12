"use client";

import { useState } from 'react';

export default function CalculatorPage() {
    // State for each calculator
    const [yarnInput1, setYarnInput1] = useState('');
    const [yarnInput2, setYarnInput2] = useState('');
    
    const [gaugeInput1, setGaugeInput1] = useState('');
    const [gaugeInput2, setGaugeInput2] = useState('');
    
    const [stitchesInput1, setStitchesInput1] = useState('');
    const [stitchesInput2, setStitchesInput2] = useState('');

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
        const input1 = Number(yarnInput1);
        const input2 = Number(yarnInput2);
        const result = (input1 * input2).toFixed(2);
        
        setModalTitle('Yarn Amount Result');
        setModalResult(`You need ${result} grams of yarn`);
        setCurrentCalculation({
            type: 'Yarn Amount',
            input1,
            input2,
            result: `${result} grams`
        });
        setShowModal(true);
    };

    const calculateGauge = () => {
        const input1 = Number(gaugeInput1);
        const input2 = Number(gaugeInput2);
        const result = (input1 / input2).toFixed(2);
        
        setModalTitle('Gauge Swatch Result');
        setModalResult(`Your gauge is ${result} stitches per cm`);
        setCurrentCalculation({
            type: 'Gauge Swatch',
            input1,
            input2,
            result: `${result} stitches/cm`
        });
        setShowModal(true);
    };

    const calculateStitches = () => {
        const input1 = Number(stitchesInput1);
        const input2 = Number(stitchesInput2);
        const result = (input1 * input2).toFixed(0);
        
        setModalTitle('Picked Stitches Result');
        setModalResult(`You need to pick up ${result} stitches`);
        setCurrentCalculation({
            type: 'Picked Stitches',
            input1,
            input2,
            result: `${result} stitches`
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
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold text-stone-800 mb-6">Knitting Calculators</h1>

            {/* Yarn Amount Calculator */}
            <div className="border-2 border-stone-300 rounded-lg p-6 bg-stone-50">
                <h2 className="text-2xl font-semibold text-stone-800 mb-4">Yarn Amount Calculator</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Weight per ball (grams)
                        </label>
                        <input
                            type="number"
                            value={yarnInput1}
                            onChange={(e) => setYarnInput1(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter weight"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Number of balls
                        </label>
                        <input
                            type="number"
                            value={yarnInput2}
                            onChange={(e) => setYarnInput2(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter number"
                        />
                    </div>
                    <button 
                        onClick={calculateYarn}
                        className="btn btn-primary w-full"
                        disabled={!yarnInput1 || !yarnInput2}
                    >
                        Calculate
                    </button>
                </div>
            </div>

            {/* Gauge Swatch Calculator */}
            <div className="border-2 border-stone-300 rounded-lg p-6 bg-stone-50">
                <h2 className="text-2xl font-semibold text-stone-800 mb-4">Gauge Swatch Calculator</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Number of stitches
                        </label>
                        <input
                            type="number"
                            value={gaugeInput1}
                            onChange={(e) => setGaugeInput1(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter stitches"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Width (cm)
                        </label>
                        <input
                            type="number"
                            value={gaugeInput2}
                            onChange={(e) => setGaugeInput2(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter width"
                        />
                    </div>
                    <button 
                        onClick={calculateGauge}
                        className="btn btn-primary w-full"
                        disabled={!gaugeInput1 || !gaugeInput2}
                    >
                        Calculate
                    </button>
                </div>
            </div>

            {/* Picked Stitches Calculator */}
            <div className="border-2 border-stone-300 rounded-lg p-6 bg-stone-50">
                <h2 className="text-2xl font-semibold text-stone-800 mb-4">Picked Stitches Calculator</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Stitches per cm
                        </label>
                        <input
                            type="number"
                            value={stitchesInput1}
                            onChange={(e) => setStitchesInput1(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter stitches per cm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                            Length (cm)
                        </label>
                        <input
                            type="number"
                            value={stitchesInput2}
                            onChange={(e) => setStitchesInput2(e.target.value)}
                            className="input input-bordered w-full"
                            placeholder="Enter length"
                        />
                    </div>
                    <button 
                        onClick={calculateStitches}
                        className="btn btn-primary w-full"
                        disabled={!stitchesInput1 || !stitchesInput2}
                    >
                        Calculate
                    </button>
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
                    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 z-10">
                        <h3 className="font-bold text-lg mb-2">{modalTitle}</h3>
                        <p className="py-4 text-xl text-center bg-stone-100 rounded-lg font-semibold text-orange-700">
                            {modalResult}
                        </p>
                        
                        <div className="divider">Save Calculation</div>
                        
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Give this calculation a name (optional)</span>
                            </label>
                            <input
                                type="text"
                                value={calculationName}
                                onChange={(e) => setCalculationName(e.target.value)}
                                placeholder="e.g., Sweater front panel"
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="flex gap-2 mt-6 justify-end">
                            <button 
                                className="btn btn-ghost"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                            <button 
                                className="btn btn-primary"
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