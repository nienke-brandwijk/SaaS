import { useEffect, useState, useRef } from "react";
import { PatternQueue } from "../../../src/domain/patternQueue";

export default function Queue( {patternQueueData, onPatternAdded, onWIPAdded,onPatternRemoved, hasPremium, onLimitReached }: { patternQueueData: PatternQueue[], onPatternAdded?: (pattern: PatternQueue) => void, onWIPAdded?: (wip: any) => void, onPatternRemoved?: (patternQueueID: number) => void, hasPremium?: boolean, onLimitReached: () => void } ) {
    const [showPopup, setShowPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState<PatternQueue | null>(null);

    const [patternName, setPatternName] = useState("");
    const [patternLink, setPatternLink] = useState("");
    const [localQueue, setLocalQueue] = useState<PatternQueue[]>(patternQueueData); 

    const [draggedPattern, setDraggedPattern] = useState<PatternQueue | null>(null);
    const [dragOverPattern, setDragOverPattern] = useState<PatternQueue | null>(null);

    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const listContainerRef = useRef<HTMLDivElement | null>(null);

    //check free limit
    const FREE_LIMIT = 3;
    const isLimitReached = localQueue.length >= FREE_LIMIT;

    useEffect(() => {
        setLocalQueue(patternQueueData);
    }, [patternQueueData]);

    // Close dropdown when clicking outside the list container
    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            const target = e.target as Node;
            if (listContainerRef.current && !listContainerRef.current.contains(target)) {
                setOpenDropdownId(null);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleDocClick);
        return () => {
            document.removeEventListener('mousedown', handleDocClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
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

    const handleOpenModal = () => {
        if (isLimitReached && !hasPremium) {
            onLimitReached(); 
        } else {
            setShowPopup(true); 
        }
    };
    
    return (
        <>
            <div className="bg-cover flex flex-col" style={{ maxHeight: 'calc(100vh + 80px)' }}>
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-txtBold text-2xl mb-2 flex-shrink-0">Pattern Queue</h2>
                    <button onClick={handleOpenModal} className="px-2 pb-1 flex items-center justify-center border border-borderAddBtn rounded-lg bg-transparent hover:bg-colorAddBtn hover:text-txtColorAddBtn transition">
                        +
                    </button>
                </div>
                <div className="text-txtDefault mt-2 overflow-y-auto flex-1 min-h-0" ref={listContainerRef}>
                {localQueue.length > 0 && (
                    <ol 
                        className="space-y-2"
                        onDragOver={(e) => e.preventDefault()}
                        style={{ paddingLeft: '1.5rem' }}
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

                                {/* Three-dots button on the right */}
                                <div className="absolute right-2 top-0">
                                    <button
                                        aria-label="Open pattern actions"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation(); // prevent drag
                                            const id = pattern.patternQueueID ?? null;
                                            setOpenDropdownId(openDropdownId === id ? null : id);
                                        }}
                                        onMouseDown={(e) => e.preventDefault()} // avoid starting drag on mousedown
                                        className="rounded hover:bg-zinc-100"
                                    >
                                        <span className="text-xl select-none">⋮</span>
                                    </button>

                                    {/* Dropdown menu */}
                                    {openDropdownId === pattern.patternQueueID && (
                                        <div 
                                            data-dropdown-id={pattern.patternQueueID}
                                            className="absolute right-0 mt-2 w-44 bg-bgDefault border border-borderCard rounded-lg shadow-sm z-50"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                className="w-full text-left text-txtTransBtn px-4 py-2 rounded-lg hover:bg-bgHover"
                                                onClick={() => handleStartWIP(pattern)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                Start as WIP
                                            </button>
                                            <button
                                                className="w-full text-left text-txtSoft px-4 py-2 rounded-lg hover:bg-bgHover"
                                                onClick={() => handleRemoveFromQueue(pattern)}
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                Remove from Queue
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="py-1 pr-10">
                                <div 
                                    className="font-semibold cursor-pointer"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPattern(pattern);
                                    setShowEditPopup(true);
                                    }}
                                >
                                    {pattern.patternName}
                                </div>

                                {/* Styled link card: icon + truncated URL, hover shadow and focus ring */}
                                <a
                                    href={pattern.patternLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-2 inline-flex items-center gap-3 w-full max-w-full rounded-lg border border-borderCard bg-white px-3 py-2 text-xs text-txtDefault hover:shadow-lg hover:border-transparent focus:outline-none focus:ring-2 focus:ring-colorAddBtn transition"
                                >
                                    <svg className="w-4 h-4 text-colorAddBtn flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                        <path d="M3.9 12a5 5 0 017.07-7.07l1.06 1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M20.1 12a5 5 0 01-7.07 7.07l-1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.5 15.5l7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span className="truncate break-words">{pattern.patternLink}</span>
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
                    <div className="bg-bgDefault rounded-lg p-8 max-w-md w-full shadow-sm relative">
                        {/* Kruisje */}
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-txtSoft hover:text-txtTransBtn text-2xl font-bold"
                        >
                            ×
                        </button>

                        {/* Titel */}
                        <h2 className="text-2xl font-bold text-txtBold mb-2">Add Pattern to Queue</h2>
                        <p className="text-txtDefault mb-6 text-sm">
                            Not ready to start a certain pattern yet? Add it to your queue to keep track of projects you want to make!
                        </p>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Pattern Name */}
                            <div>
                                <label htmlFor="patternName" className="block text-sm font-semibold text-txtDefault mb-2">
                                    Pattern Name
                                </label>
                                <input
                                    id="patternName"
                                    type="text"
                                    value={patternName}
                                    onChange={(e) => setPatternName(e.target.value)}
                                    placeholder="e.g., Cozy Cardigan"
                                    className="w-full px-4 py-2 border border-borderCard rounded-lg placeholder:text-txtHint"
                                />
                            </div>

                            {/* Pattern Link */}
                            <div>
                                <label htmlFor="patternLink" className="block text-sm text-txtDefault font-semibold mb-2">
                                    Pattern Link
                                </label>
                                <input
                                    id="patternLink"
                                    type="url"
                                    value={patternLink}
                                    onChange={(e) => setPatternLink(e.target.value)}
                                    placeholder="https://www.ravelry.com/patterns/..."
                                    className="w-full px-4 py-2 border border-borderCard rounded-lg placeholder:text-txtHint"
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={!patternName.trim() || !patternLink.trim()}
                                className="w-full border border-borderBtn text-txtColorBtn px-4 py-2 rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Queue
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}