"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, ArrowUpTrayIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

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

//Icons
const X = ({ className }: { className?: string }) => (
  <XMarkIcon className={className} />
);

const Upload = ({ className }: { className?: string }) => (
  <ArrowUpTrayIcon className={className} />
);

const Type = ({ className }: { className?: string }) => (
  <PencilSquareIcon className={className} />
);

const Trash2 = ({ className }: { className?: string }) => (
  <TrashIcon className={className} />
);

export default function VisionBoardPage() {
  const router = useRouter();
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [draggedBoardItem, setDraggedBoardItem] = useState<BoardItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [boardTitle, setBoardTitle] = useState<string>('');
  const [availableImages, setAvailableImages] = useState<BoardItem[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [draggedGalleryItem, setDraggedGalleryItem] = useState<BoardItem | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Detect changes
  useEffect(() => {
    if (boardItems.length > 0 || availableImages.length > 0 || boardTitle.trim() !== "") {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [boardItems, availableImages, boardTitle]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          setAvailableImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            type: 'image',
            src: result,
            name: file.name,
            x: 0,
            y: 0,
            rotation: 0
          }]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add text to board
  const addTextToBoard = () => {
    if (textInput.trim()) {
      setBoardItems(prev => [...prev, {
        id: Date.now(),
        type: 'text',
        content: textInput,
        x: 30,
        y: 30,
        rotation: 0
      }]);
      setTextInput('');
    }
  };

  // Handle drag start from gallery
  const handleDragStartFromGallery = (item: BoardItem) => {
    setDraggedGalleryItem(item);
  };

  // Remove image from gallery
  const removeImageFromGallery = (id: number) => {
    setAvailableImages(prev => prev.filter(img => img.id !== id));
  };

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
    
    // Adding new item from gallery
    if (draggedGalleryItem && boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setBoardItems(prev => [...prev, {
        ...draggedGalleryItem,
        id: Date.now(),
        x: Math.max(0, Math.min(90, x - 5)),
        y: Math.max(0, Math.min(90, y - 5)),
        rotation: 0
      }]);
      setDraggedGalleryItem(null);
    }
    // Moving existing item on board
    else if (draggedBoardItem && boardRef.current) {
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

  // Save function
  const handleSave = () => {
    // Functionaliteit komt later
  };

  // Back function
  const handleBack = () => {
    if (hasChanges) {
      setShowBackConfirm(true); // Kan aangepast worden naar gebruik met database maar werkt op zich ook zo al
    } else {
      router.push("/create"); 
    }
  };

    // Yes button in modal
  const confirmBack = () => {
    setShowBackConfirm(false);
    router.push("/create");
  };

  // No button in modal
  const cancelBack = () => {
    setShowBackConfirm(false);
  };

  return (
    <div className="min-h-screen bg-bgDefault py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Linkerkolom */}
        <div className="flex flex-col gap-8 md:col-span-2">
          
          {/* Vision Board Card - Grote card */}
          <div className="card h-full">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">Your Vision Board</h1>
            </div>

            <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
              <div
                ref={boardRef}
                className="relative w-full h-[600px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-4 border-dashed border-borderCard overflow-hidden"
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
                          className="w-32 h-32 object-cover rounded-lg shadow-sm border-4 border-white pointer-events-none"
                        />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 bg-colorBtn text-txtColorBtn rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-2 border-borderBtn text-lg font-semibold text-txtDefault pointer-events-none">
                          {item.content}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute -top-2 -right-2 bg-colorBtn text-txtColorBtn rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Smalle card - Vision Board Title */}
          <div className="card">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">Vision Board Title</h1>
            </div>

            <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
              <div className="space-y-2">
                <label htmlFor="boardTitle" className="block text-lg font-semibold text-txtDefault">
                  Give your vision board a name
                </label>
                <input
                  id="boardTitle"
                  type="text"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  placeholder="e.g., My first sweater"
                  className="w-full px-4 py-3 border-2 border-borderCard rounded-lg text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rechterkolom - Tools */}
        <div className="md:col-span-1 h-full flex flex-col gap-8">
          <div className="card h-full flex flex-col">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">Tools</h1>
            </div>

            <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
              
              {/* Image Upload Section */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-txtDefault mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Images
                </h3>
                
                {/* Scrollable Image Gallery */}
                <div className="flex-1 grid grid-cols-2 gap-2 mb-3 max-h-[530px] overflow-y-auto border-2 border-borderCard rounded-lg p-2">
                  {availableImages.length === 0 ? (
                    <div className="col-span-2 flex items-center justify-center h-32 text-stone-400 text-sm">
                      No images uploaded yet
                    </div>
                  ) : (
                    availableImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <div
                          draggable
                          onDragStart={() => handleDragStartFromGallery(img)}
                          className="cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                        >
                          <img
                            src={img.src}
                            alt={img.name}
                            className="w-full h-20 object-cover rounded-lg shadow-sm border-2 border-borderCard hover:border-borderBtn"
                          />
                        </div>
                        <button
                          onClick={() => removeImageFromGallery(img.id)}
                          className="absolute -top-1 -right-1 bg-colorBtn text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-borderBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn text-txtColorBtn flex items-center justify-center py-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Images
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-borderCard"></div>

              {/* Add Text Section */}
              <div>
                <h3 className="text-lg font-semibold text-txtDefault mb-3 flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Add Text
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTextToBoard()}
                    placeholder="Your affirmation..."
                    className="w-full px-3 py-2 border-2 border-borderCard rounded-lg text-sm"
                  />
                  <button
                    onClick={addTextToBoard}
                    className="w-full border border-borderBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn text-txtColorBtn flex items-center justify-center py-2"
                  >
                    <Type className="w-4 h-4" />
                    Add to Board
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Save Button - Onderaan de pagina */}
      <div className="max-w-6xl mx-auto px-6 mt-8 pb-12 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3 border border-borderBtn rounded-lg bg-transparant hover:bg-colorBtn hover:text-txtColorBtn text-txtTransBtn text-lg font-semibold shadow-sm transition-all flex items-center gap-2"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-3 border border-borderBtn rounded-lg bg-colorBtn text-txtColorBtn hover:bg-bgDefault hover:text-txtTransBtn text-lg font-semibold shadow-sm transition-all"
        >
          Save Vision Board
        </button>
      </div>

      {showBackConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to leave?</h2>
            <p className="text-sm text-stone-600 mb-6">
              You already made some changes
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmBack}
                className="px-6 py-2 bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm"
              >
                Yes
              </button>
              <button
                onClick={cancelBack}
                className="px-6 py-2 border border-borderBtn bg-transparant text-txtTransBtn rounded-lg hover:bg-bgDefault transition shadow-sm"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}