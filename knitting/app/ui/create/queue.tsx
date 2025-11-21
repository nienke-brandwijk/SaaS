import { useEffect, useState } from "react";
import { PatternQueue } from "../../../src/domain/patternQueue";

export default function Queue( {patternQueueData, onPatternAdded, onWIPAdded,onPatternRemoved }: { patternQueueData: PatternQueue[], onPatternAdded?: (pattern: PatternQueue) => void, onWIPAdded?: (wip: any) => void, onPatternRemoved?: (patternQueueID: number) => void }) {
    const [showPopup, setShowPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState<PatternQueue | null>(null);

    const [patternName, setPatternName] = useState("");
    const [patternLink, setPatternLink] = useState("");
    const [localQueue, setLocalQueue] = useState<PatternQueue[]>(patternQueueData); 

    const [draggedPattern, setDraggedPattern] = useState<PatternQueue | null>(null);
    const [dragOverPattern, setDragOverPattern] = useState<PatternQueue | null>(null);

    useEffect(() => {
        setLocalQueue(patternQueueData);
    }, [patternQueueData]);
    
    const handleSave = async () => {
        try {
            const nextPosition = localQueue.length > 0  
                ? Math.max(...localQueue.map(q => q.patternPosition)) + 1 
                : 1;

            const response = await fetch('/api/patternQueue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patternName,
                    patternLink,
                    patternPosition: nextPosition,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save pattern');
            }

            const newPattern = await response.json();

            // Update lokale state direct
            setLocalQueue([...localQueue, newPattern]);

            // Update parent state
            if (onPatternAdded) {
                onPatternAdded(newPattern);
            }

            // Reset form en sluit popup
            setPatternName("");
            setPatternLink("");
            setShowPopup(false);
        } catch (error) {
            console.error("Error saving pattern:", error);
            alert("Failed to save pattern. Please try again.");
        }
    };

    const handleClose = () => {
        // Reset form en sluit popup zonder opslaan
        setPatternName("");
        setPatternLink("");
        setShowPopup(false);
    };

    const handleRemoveFromQueue = async (pattern: PatternQueue) => {
        try {
            const response = await fetch(`/api/patternQueue/${pattern.patternQueueID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete pattern');
            }

            setLocalQueue(localQueue.filter(p => p.patternQueueID !== pattern.patternQueueID));

            if (onPatternRemoved && pattern.patternQueueID) {
                onPatternRemoved(pattern.patternQueueID);
            }

            setShowEditPopup(false);
            setSelectedPattern(null);
        } catch (error) {
            console.error("Error removing pattern:", error);
            alert("Failed to remove pattern. Please try again.");
        }
    };

    const handleStartWIP = async (pattern: PatternQueue) => {
        try {
            const response = await fetch('/api/wips/from-pattern', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patternName: pattern.patternName,
                    patternQueueID: pattern.patternQueueID,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start WIP');
            }

            const newWIP = await response.json();

            setLocalQueue(localQueue.filter(p => p.patternQueueID !== pattern.patternQueueID));

            if (onWIPAdded) {
                onWIPAdded(newWIP);
            }
            if (onPatternRemoved && pattern.patternQueueID) {
                onPatternRemoved(pattern.patternQueueID);
            }

            setShowEditPopup(false);
            setSelectedPattern(null);
        } catch (error) {
            console.error("Error starting WIP:", error);
            alert("Failed to start WIP. Please try again.");
        }
    };

    const handleDragStart = (pattern: PatternQueue) => {
        setDraggedPattern(pattern);
    };

    const handleDragOver = (e: React.DragEvent, pattern: PatternQueue) => {
        e.preventDefault();
        setDragOverPattern(pattern);
    };

    const handleDrop = async (e: React.DragEvent, targetPattern: PatternQueue) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!draggedPattern || draggedPattern.patternQueueID === targetPattern.patternQueueID) {
            setDraggedPattern(null);
            setDragOverPattern(null);
            return;
        }

        // Vind oude en nieuwe index
        const oldIndex = localQueue.findIndex(p => p.patternQueueID === draggedPattern.patternQueueID);
        const newIndex = localQueue.findIndex(p => p.patternQueueID === targetPattern.patternQueueID);

        // Maak nieuwe array met verplaatst item
        const newQueue = [...localQueue];
        newQueue.splice(oldIndex, 1);
        newQueue.splice(newIndex, 0, draggedPattern);

        // BELANGRIJK: Update ook de patternPosition waarden in de objecten zelf!
        const updatedQueue = newQueue.map((pattern, index) => ({
            ...pattern,
            patternPosition: index + 1
        }));

        // Update lokale state met de nieuwe posities
        setLocalQueue(updatedQueue);

        // Bereken updates voor database
        const updates = updatedQueue.map((pattern) => ({
            patternQueueID: pattern.patternQueueID!,
            patternPosition: pattern.patternPosition
        }));

        // Verstuur naar backend
        try {
            const response = await fetch('/api/patternQueue/reorder', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ updates }),
            });

            if (!response.ok) {
            throw new Error('Failed to reorder patterns');
            }
        } catch (error) {
            console.error('Error reordering patterns:', error);
            // Rollback bij fout
            setLocalQueue(patternQueueData);
            alert('Failed to reorder patterns. Please try again.');
        }

        setDraggedPattern(null);
        setDragOverPattern(null);
    };

    const handleDragEnd = () => {
        setDraggedPattern(null);
        setDragOverPattern(null);
    };
    
    return (
        <>
            <div className="bg-cover flex h-full flex-col">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-txtBold text-2xl">Pattern Queue</h1>
                    <button onClick={() => setShowPopup(true)} className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition">
                        +
                    </button>
                </div>
                <div className="text-txtDefault mt-4">
                {localQueue.length > 0 && (
                    <ol 
                        className="space-y-2"
                        onDragOver={(e) => e.preventDefault()}
                        style={{ paddingLeft: '1.5rem' }} /* Minder padding */
                        >
                        {localQueue
                            .sort((a, b) => a.patternPosition - b.patternPosition)
                            .map((pattern) => (
                            <li 
                                key={pattern.patternQueueID} 
                                draggable
                                onDragStart={() => handleDragStart(pattern)}
                                onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDragOverPattern(pattern);
                                }}
                                onDrop={(e) => handleDrop(e, pattern)}
                                onDragEnd={handleDragEnd}
                                className={`text-sm transition-all relative group ${
                                draggedPattern?.patternQueueID === pattern.patternQueueID 
                                    ? 'opacity-50' 
                                    : ''
                                } ${
                                dragOverPattern?.patternQueueID === pattern.patternQueueID 
                                    ? 'bg-stone-200 rounded' 
                                    : ''
                                }`}
                                style={{
                                listStyleType: 'none',
                                }}
                            >
                                {/* Custom bullet - verdwijnt bij hover */}
                                <span className="absolute -left-5 top-1 text-txtDefault text-sm font-normal group-hover:opacity-0 transition-opacity">
                                {localQueue.findIndex(p => p.patternQueueID === pattern.patternQueueID) + 1}.
                                </span>
                                
                                {/* Drag handle - verschijnt bij hover */}
                                <span className="absolute -left-5 top-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 select-none opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                                ⋮⋮
                                </span>
                                
                                <div className="py-1">
                                <div 
                                    className="font-semibold hover:underline hover:font-bold cursor-pointer"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPattern(pattern);
                                    setShowEditPopup(true);
                                    }}
                                >
                                    {pattern.patternName}
                                </div>
                                <a 
                                    href={pattern.patternLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-xs break-all"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {pattern.patternLink}
                                </a>
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
                </div>
            </div>


            {/* Popup overlay */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl relative">
                        {/* Kruisje */}
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                        >
                            ×
                        </button>

                        {/* Titel */}
                        <h2 className="text-2xl font-bold mb-2">Add Pattern to Queue</h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Not ready to start a certain pattern yet? Add it to your queue to keep track of projects you want to make!
                        </p>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Pattern Name */}
                            <div>
                                <label htmlFor="patternName" className="block text-sm font-semibold mb-2">
                                    Pattern Name
                                </label>
                                <input
                                    id="patternName"
                                    type="text"
                                    value={patternName}
                                    onChange={(e) => setPatternName(e.target.value)}
                                    placeholder="e.g., Cozy Cardigan"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 placeholder:text-gray-400"
                                />
                            </div>

                            {/* Pattern Link */}
                            <div>
                                <label htmlFor="patternLink" className="block text-sm font-semibold mb-2">
                                    Pattern Link
                                </label>
                                <input
                                    id="patternLink"
                                    type="url"
                                    value={patternLink}
                                    onChange={(e) => setPatternLink(e.target.value)}
                                    placeholder="https://www.ravelry.com/patterns/..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 placeholder:text-gray-400"
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={!patternName.trim() || !patternLink.trim()}
                                className="w-full px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Add to Queue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Popup overlay */}
                {showEditPopup && selectedPattern && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl relative">
                            {/* Kruisje */}
                            <button 
                                onClick={() => {
                                    setShowEditPopup(false);
                                    setSelectedPattern(null);
                                }}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                            >
                                ×
                            </button>

                            {/* Titel */}
                            <h2 className="text-2xl font-bold mb-2">Edit your pattern in the queue</h2>
                            <p className="text-gray-600 mb-6 text-sm">
                                Pattern: <span className="font-semibold">{selectedPattern.patternName}</span>
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                {/* Start WIP Button */}
                                <button
                                    onClick={() => {
                                        handleStartWIP(selectedPattern)
                                    }}
                                    className="flex-1 px-4 py-3 bg-stone-700 text-white rounded-lg hover:bg-stone-800 transition"
                                >
                                    Start New WIP
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => {
                                        handleRemoveFromQueue(selectedPattern)
                                    }}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                >
                                    Remove from Queue
                                </button>
                            </div>
                        </div>
                    </div>
                )}

        </>
    );
}