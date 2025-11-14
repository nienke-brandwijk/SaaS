"use client";

import { useState, useRef } from 'react';

// Types
interface BoardItem {
  id: number;
  type: 'image' | 'text';
  x: number;
  y: number;
  rotation: number;
  src?: string;
  name?: string;
  content?: string;
}

// SVG Icons
const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function VisionBoardPage() {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [draggedBoardItem, setDraggedBoardItem] = useState<BoardItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle drag start from board (moving existing items)
  const handleDragStartFromBoard = (e: React.DragEvent<HTMLDivElement>, item: BoardItem) => {
    e.stopPropagation();
    setDraggedBoardItem(item);
    
    if (!boardRef.current) return;
    
    const rect = boardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - (item.x * rect.width / 100);
    const offsetY = e.clientY - rect.top - (item.y * rect.height / 100);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  // Handle drop on board (moving items)
  const handleDropOnBoard = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (draggedBoardItem && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
      const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

      setBoardItems(prev => prev.map(item => 
        item.id === draggedBoardItem.id 
          ? { ...item, x: Math.max(0, Math.min(90, x)), y: Math.max(0, Math.min(90, y)) }
          : item
      ));
      setDraggedBoardItem(null);
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleDragEnd = () => {
    setDraggedBoardItem(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Remove item from board
  const removeItem = (id: number) => {
    setBoardItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 mb-6">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Linkerkolom */}
        <div className="flex flex-col gap-8 md:col-span-2">
          
          {/* Vision Board Card - Grote card */}
          <div className="card h-full">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold">Your Vision Board</h1>
            </div>

            <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8 h-full">
              <div
                ref={boardRef}
                className="relative w-full h-[600px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-4 border-dashed border-stone-300 overflow-hidden"
                onDrop={handleDropOnBoard}
                onDragOver={(e) => e.preventDefault()}
              >
                {boardItems.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-lg pointer-events-none">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Your vision board will appear here</p>
                      <p className="text-sm mt-2">Drag images and text to create your board</p>
                    </div>
                  </div>
                )}

                {boardItems.map((item) => (
                  <div
                    key={item.id}
                    className="absolute group cursor-move select-none"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: `rotate(${item.rotation}deg)`,
                    }}
                    draggable
                    onDragStart={(e) => handleDragStartFromBoard(e, item)}
                    onDragEnd={handleDragEnd}
                  >
                    {item.type === 'image' ? (
                      <div className="relative">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-lg shadow-lg border-4 border-white pointer-events-none"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-orange-300 text-lg font-semibold text-stone-800 pointer-events-none">
                          {item.content}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Smalle card - placeholder */}
          <div className="card">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold">Smalle Card</h1>
            </div>

            <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8">
              <p className="text-stone-700">Inhoud van de smalle card.</p>
            </div>
          </div>

        </div>

        {/* Rechterkolom - placeholder */}
        <div className="md:col-span-1 h-full flex flex-col gap-8">
          <div className="card h-full">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold">Rechter Card (Volledige Hoogte)</h1>
            </div>

            <div className="card-body border border-stone-300 bg-white rounded-lg py-6 px-8 h-full">
              <p className="text-stone-700">Tools komen hier</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}