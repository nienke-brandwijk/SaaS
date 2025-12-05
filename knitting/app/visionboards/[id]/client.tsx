"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, ArrowUpTrayIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ComponentData } from '../../../src/domain/component';
import { VisionBoard } from '../../../src/domain/visionboard';
import { Image as ImageType } from '../../../src/domain/image';
import { domToPng } from 'modern-screenshot';

  interface BoardItem {
    id: number;
    type: 'image' | 'text';
    x: number;
    y: number;
    rotation: number;
    src?: string;
    name?: string;
    content?: string;
    file?: File;
    width?: number;
    height?: number;
    componentID?: number;
    imageID?: number;
    originalImageId?: number;
    usedAsComponent?: boolean;
  }

  // Helper functie om strings te normaliseren voor vergelijking
  const normalizeString = (str: string | undefined) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\s+/g, '').trim();
  };

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

interface Props {
  user: any;
  board: VisionBoard;
  components: any[];
  images: ImageType[];
}

export default function VisionBoardPage({ user, board, components, images }: Props) {
  const router = useRouter();
  const boardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [boardTitle, setBoardTitle] = useState<string>(board.boardName);
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [availableImages, setAvailableImages] = useState<BoardItem[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [draggedBoardItem, setDraggedBoardItem] = useState<BoardItem | null>(null);
  const [draggedGalleryItem, setDraggedGalleryItem] = useState<BoardItem | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showNameRequiredModal, setShowNameRequiredModal] = useState(false);

  // Track original state voor change detection
  const [originalBoardTitle] = useState<string>(board.boardName);
  const [originalBoardItems] = useState<BoardItem[]>(() => {
    return components.map((comp) => {
      if (comp.componentType === 'image') {
        return {
          id: comp.componentID,
          componentID: comp.componentID,
          type: 'image' as const,
          x: comp.positionX,
          y: comp.positionY,
          rotation: comp.componentRotation || 0,
          src: comp.componentURL,
          name: 'Component Image',
          width: comp.componentWidth,
          height: comp.componentHeight
        };
      } else {
        return {
          id: comp.componentID,
          componentID: comp.componentID,
          type: 'text' as const,
          x: comp.positionX,
          y: comp.positionY,
          rotation: comp.componentRotation || 0,
          content: comp.componentContent
        };
      }
    });
  });
  const [originalAvailableImages] = useState<BoardItem[]>(() => {
    return images.map((img, index) => ({
      id: Date.now() + index,
      type: 'image' as const,
      src: img.imageURL,
      name: `Image ${index + 1}`,
      x: 0,
      y: 0,
      rotation: 0,
      width: img.imageWidth,
      height: img.imageHeight,
      imageID: img.imageID
    }));
  });

  // Track wat er veranderd is
  const [deletedComponentIDs, setDeletedComponentIDs] = useState<number[]>([]);
  const [deletedImageIDs, setDeletedImageIDs] = useState<number[]>([]);
  const [newlyAddedImages, setNewlyAddedImages] = useState<BoardItem[]>([]);
  const [newlyAddedComponents, setNewlyAddedComponents] = useState<BoardItem[]>([]);

  const boardItemToComponentData = (
    item: BoardItem,
    imageURL?: string
  ): ComponentData => {
    return {
      componentURL: item.type === 'image' ? (imageURL || item.src) : undefined,
      positionX: item.x,
      positionY: item.y,
      componentType: item.type,
      componentContent: item.type === 'text' ? item.content : undefined,
      componentWidth: item.width,
      componentHeight: item.height,
      componentZ: 0,
      componentRotation: item.rotation,
      componentFontSize: undefined,
      componentFontWeight: undefined,
      componentColor: undefined,
    };
  };

  // Initialize: Convert images naar availableImages
  useEffect(() => {
    const imageItems: BoardItem[] = images.map((img, index) => ({
      id: Date.now() + index,
      type: 'image' as const,
      src: img.imageURL,
      name: `Image ${index + 1}`,
      x: 0,
      y: 0,
      rotation: 0,
      width: img.imageWidth,
      height: img.imageHeight,
      imageID: img.imageID
    }));
    setAvailableImages(imageItems);
  }, [images]);

  // Initialize: Convert components naar boardItems
  useEffect(() => {
    const items: BoardItem[] = components.map((comp) => {
      if (comp.componentType === 'image') {
        return {
          id: comp.componentID,
          componentID: comp.componentID,
          type: 'image' as const,
          x: comp.positionX,
          y: comp.positionY,
          rotation: comp.componentRotation || 0,
          src: comp.componentURL,
          name: 'Component Image',
          width: comp.componentWidth,
          height: comp.componentHeight
        };
      } else {
        return {
          id: comp.componentID,
          componentID: comp.componentID,
          type: 'text' as const,
          x: comp.positionX,
          y: comp.positionY,
          rotation: comp.componentRotation || 0,
          content: comp.componentContent
        };
      }
    });
    setBoardItems(items);
  }, [components]);


  // Detect changes
  useEffect(() => {
    const changes = getChanges();
    setHasChanges(
      changes.hasChanges || 
      deletedComponentIDs.length > 0 || 
      deletedImageIDs.length > 0  
    );
  }, [boardTitle, boardItems, availableImages, deletedComponentIDs, deletedImageIDs]);  

  const captureBoardAsBlob = async (): Promise<Blob | null> => {
    const boardElement = boardRef.current;
    if (!boardElement) {
      console.error('Board element not found');
      return null;
    }

    try {
      // Wacht tot alle afbeeldingen geladen zijn
      const images = boardElement.querySelectorAll('img');
      await Promise.all(
        Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
            setTimeout(resolve, 5000);
          });
        })
      );

      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await domToPng(boardElement, {
        quality: 0.95,
        scale: 2,
        backgroundColor: '#FEF3C7',
        fetch: {
          requestInit: {
            mode: 'cors',
          },
        },
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      console.log('Board screenshot captured successfully');
      return blob;

    } catch (error) {
      console.error('Error capturing board:', error);
      return null;
    }
  };

  const uploadBoardImage = async (blob: Blob, userID: string, boardID: number): Promise<string> => {
    const formData = new FormData();
    formData.append('image', blob, 'vision-board.png');
    formData.append('userID', userID);
    formData.append('boardID', boardID.toString());

    const response = await fetch('/api/visionboard-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload board image');
    }

    const result = await response.json();
    return result.imageURL;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          // Create an Image object to get dimensions
          const img = new window.Image();
          img.onload = () => {
            const newImage: BoardItem = {
              id: Date.now() + Math.random(),
              type: 'image',
              src: result,
              name: file.name,
              x: 0,
              y: 0,
              rotation: 0,
              file: file,
              width: img.width,
              height: img.height,
              usedAsComponent: false
            };
            
            setAvailableImages(prev => [...prev, newImage]);
            setNewlyAddedImages(prev => [...prev, newImage]);
          };
          img.src = result;
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add text to board
  const addTextToBoard = () => {
    if (textInput.trim()) {
      const newTextItem: BoardItem = {
        id: Date.now(),
        type: 'text',
        content: textInput,
        x: 30,
        y: 30,
        rotation: 0
      };
      
      setBoardItems(prev => [...prev, newTextItem]);
      setNewlyAddedComponents(prev => [...prev, newTextItem]);
      setTextInput('');
    }
  };

  // Handle drag start from gallery
  const handleDragStartFromGallery = (item: BoardItem) => {
    setDraggedGalleryItem(item);
  };

  // Remove image from gallery
  const removeImageFromGallery = (id: number, imageID?: number) => {
    const isUsedOnBoard = boardItems.some(
      item => item.type === 'image' && item.originalImageId === id
    );

    setAvailableImages(prev => prev.filter(img => img.id !== id));
    
    if (imageID && !isUsedOnBoard) {
      setDeletedImageIDs(prev => [...prev, imageID]);
    }

    setNewlyAddedImages(prev => prev.filter(img => img.id !== id));
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
    if (draggedGalleryItem && boardRef.current && draggedGalleryItem.src) {
      const rect = boardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const existingComponentWithSameImage = boardItems.find(
        item => item.type === 'image' && item.originalImageId === draggedGalleryItem.id
      );

      const newItem: BoardItem = {
        ...draggedGalleryItem,
        id: Date.now() + Math.random(),
        originalImageId: draggedGalleryItem.id,
        x: Math.max(0, Math.min(90, x - 5)),
        y: Math.max(0, Math.min(90, y - 5)),
        rotation: 0,
        src: existingComponentWithSameImage?.src || draggedGalleryItem.src,
        usedAsComponent: true
      };
      
      setBoardItems(prev => [...prev, newItem]);
      setNewlyAddedComponents(prev => [...prev, newItem]);
      setAvailableImages(prev => 
        prev.map(img => 
          img.id === draggedGalleryItem.id 
            ? { ...img, usedAsComponent: true }
            : img
        )
      );
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
  const removeItem = (id: number, componentID?: number) => {
    setBoardItems(prev => prev.filter(item => item.id !== id));
    
    // Als het een bestaand component is (heeft componentID), track voor deletion
    if (componentID) {
      setDeletedComponentIDs(prev => [...prev, componentID]);
    }
  };

  const getChanges = () => {
    // Title changed
    const titleChanged = normalizeString(boardTitle) !== normalizeString(originalBoardTitle);

    // Components position changed
    const componentsPositionChanged = boardItems
      .filter(item => item.componentID) // Alleen bestaande components
      .filter(item => {
        const original = originalBoardItems.find(o => o.componentID === item.componentID);
        if (!original) return false;
        return item.x !== original.x || 
              item.y !== original.y || 
              item.rotation !== original.rotation;
    });

    // New components to add
    const componentsToAdd = boardItems.filter(item => !item.componentID);

    // Images deleted from gallery
    const imagesDeletedFromGallery = originalAvailableImages.filter(
      orig => !availableImages.some(img => img.imageID === orig.imageID)
    );

    // New images added to gallery
    const newImagesInGallery = availableImages.filter(img => {
      const isNew = !originalAvailableImages.some(orig => orig.imageID === img.imageID);
      return isNew && !img.usedAsComponent;  
    });

    const hasChanges = 
      titleChanged ||
      componentsPositionChanged.length > 0 ||
      componentsToAdd.length > 0 ||
      deletedComponentIDs.length > 0 ||
      imagesDeletedFromGallery.length > 0 ||
      newImagesInGallery.length > 0;

    return {
      titleChanged,
      componentsPositionChanged,
      componentsToAdd,
      imagesDeletedFromGallery,
      newImagesInGallery,
      hasChanges
    };
  };

// Save function
const handleSave = async () => {
  if (isSaving) return;

  // Check if title is filled
  if (!boardTitle.trim()) {
    setShowNameRequiredModal(true);
    return;
  }

  setIsSaving(true);

  try {
    // Haal eerst alle veranderingen op
    const changes = getChanges();

    if (!changes.hasChanges && deletedComponentIDs.length === 0 && deletedImageIDs.length === 0) {
      router.push("/create");
      return;
    }

    // UPDATE BOARD TITLE
    if (changes.titleChanged) {
      try {
        const response = await fetch(`/api/visionboards/${board.boardID}/title`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ boardName: boardTitle.trim() }),
        });

        if (!response.ok) {
          throw new Error('Failed to update board title');
        }

      } catch (error) {
        console.error('Error updating board title:', error);
        throw error;
      }
    }

    // UPDATE COMPONENT POSITIONS
    if (changes.componentsPositionChanged.length > 0) {
      try {
        const positionUpdates = changes.componentsPositionChanged.map(item => ({
          componentID: item.componentID!,
          positionX: item.x,
          positionY: item.y,
          rotation: item.rotation
        }));

        const response = await fetch('/api/components/positions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates: positionUpdates }),
        });

        if (!response.ok) {
          throw new Error('Failed to update component positions');
        }

      } catch (error) {
        console.error('Error updating component positions:', error);
        throw error;
      }
    }

    // DELETE COMPONENTS
    if (deletedComponentIDs.length > 0) {
      try {
        
        const deletePromises = deletedComponentIDs.map(async (componentID) => {
          const response = await fetch(`/api/components/${componentID}`, { 
            method: 'DELETE' 
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to delete component ${componentID}:`, errorData);
            return { ok: false, componentID, error: errorData };
          }
          
          return { ok: true, componentID };
        });

        const results = await Promise.all(deletePromises);
        
        const failedDeletes = results.filter(r => !r.ok);
        if (failedDeletes.length > 0) {
          console.error('Failed deletions:', failedDeletes);
          throw new Error(`Failed to delete ${failedDeletes.length} component(s)`);
        }

      } catch (error) {
        console.error('Error deleting components:', error);
        throw error;
      }
    }

    // ADD NEW COMPONENTS 
    if (changes.componentsToAdd.length > 0) {
      try {
        const imageURLMap = new Map<number, string>();
        
        // Eerst: Upload elk uniek image slechts 1 keer
        const uniqueImageComponents = changes.componentsToAdd.filter(
          item => item.type === 'image' && item.file
        );
        
        const uniqueImageIds = new Set<number>();
        const imagesToUpload: BoardItem[] = [];
        
        for (const item of uniqueImageComponents) {
          const imageId = item.originalImageId || item.id;
          if (!uniqueImageIds.has(imageId)) {
            uniqueImageIds.add(imageId);
            imagesToUpload.push(item);
          }
        }
        
        // Upload alleen unieke images
        for (const item of imagesToUpload) {
          try {
            const formData = new FormData();
            formData.append('image', item.file!);
            formData.append('userID', user.id);
            formData.append('imageHeight', (item.height || 0).toString());
            formData.append('imageWidth', (item.width || 0).toString());
            formData.append('boardID', board.boardID.toString());

            const imageResponse = await fetch('/api/images', {
              method: 'POST',
              body: formData,
            });

            if (!imageResponse.ok) {
              const errorData = await imageResponse.json();
              throw new Error(errorData.error || 'Failed to upload image');
            }

            const result = await imageResponse.json();
            const imageId = item.originalImageId || item.id;
            imageURLMap.set(imageId, result.imageURL);
            
          } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
        }

        // Dan: Create components met de ge-upload-e imageURLs
        const componentsToCreate = changes.componentsToAdd.map(item => {
          let imageURL: string | undefined = undefined;
          
          if (item.type === 'image') {
            const imageId = item.originalImageId || item.id;
            imageURL = imageURLMap.get(imageId);
          }
          
          return boardItemToComponentData(item, imageURL);
        });

        const componentsResponse = await fetch('/api/components', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            boardID: board.boardID,
            components: componentsToCreate
          }),
        });

        if (!componentsResponse.ok) {
          const errorData = await componentsResponse.json();
          throw new Error(errorData.error || 'Failed to save components');
        }

      } catch (error) {
        console.error('Error adding new components:', error);
        throw error;
      }
    }

    // DELETE IMAGES FROM GALLERY
    if (deletedImageIDs.length > 0) {
      try {
        
        const deletePromises = deletedImageIDs.map(async (imageID) => {
          const response = await fetch(`/api/images/${imageID}`, { 
            method: 'DELETE' 
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Failed to delete image ${imageID}:`, errorData);
            return { ok: false, imageID, error: errorData };
          }
          
          return { ok: true, imageID };
        });

        const results = await Promise.all(deletePromises);
        
        const failedDeletes = results.filter(r => !r.ok);
        if (failedDeletes.length > 0) {
          console.error('Failed image deletions:', failedDeletes);
          throw new Error(`Failed to delete ${failedDeletes.length} image(s)`);
        }

      } catch (error) {
        console.error('Error deleting images:', error);
        throw error;
      }
    }

    // ADD NEW IMAGES TO GALLERY (alleen nieuwe images die niet al geupload zijn)
    if (changes.newImagesInGallery.length > 0) {
      try {
        
        for (const img of changes.newImagesInGallery) {
          if (img.file) {
            const formData = new FormData();
            formData.append('image', img.file);
            formData.append('userID', user.id);
            formData.append('imageHeight', (img.height || 0).toString());
            formData.append('imageWidth', (img.width || 0).toString());
            formData.append('boardID', board.boardID.toString());

            const imageResponse = await fetch('/api/images', {
              method: 'POST',
              body: formData,
            });

            if (!imageResponse.ok) {
              const errorData = await imageResponse.json();
              throw new Error(errorData.error || 'Failed to upload image');
            }

          }
        }
      } catch (error) {
        console.error('Error uploading new gallery images:', error);
        throw error;
      }
    }

    // 7. UPDATE BOARD SCREENSHOT
    try {
      console.log('📸 Capturing new board screenshot...');
      
      // Capture nieuwe screenshot
      const boardImageBlob = await captureBoardAsBlob();
      
      if (!boardImageBlob) {
        throw new Error('Failed to capture board image');
      }
      
      // Upload nieuwe screenshot
      const newBoardImageURL = await uploadBoardImage(boardImageBlob, user.id, board.boardID);
      console.log('✅ New board screenshot uploaded:', newBoardImageURL);
      
      // Verwijder oude screenshot via API
      if (board.boardURL) {
        const deleteResponse = await fetch(`/api/visionboards/${board.boardID}/screenshot`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ boardURL: board.boardURL }),
        });

        if (!deleteResponse.ok) {
          console.error('Failed to delete old screenshot');
        } else {
          console.log('✅ Old board screenshot deleted');
        }
      }
      
      // Update boardURL in database via API
      const updateResponse = await fetch(`/api/visionboards/${board.boardID}/url`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardURL: newBoardImageURL }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update board URL');
      }

      console.log('✅ Board screenshot updated successfully');
    } catch (error) {
      console.error('Error updating board screenshot:', error);
    }

    router.push("/create");
    
  } catch (error) {
    console.error('Error saving vision board:', error);
    alert('Failed to save vision board. Please try again.');
  } finally {
    setIsSaving(false);
  }
};

  // Back function
  const handleBack = () => {
    if (hasChanges) {
      setShowBackConfirm(true);
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

  // Delete function
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/visionboards/${board.boardID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete vision board');
      }

      setShowDeleteConfirm(false);
      router.push("/create");
    } catch (error) {
      console.error('Error deleting vision board:', error);
      alert('Failed to delete vision board. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  // No button in delete modal
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-bgDefault py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Linkerkolom */}
        <div className="flex flex-col gap-8 md:col-span-2">
          
          {/* Vision Board Card - Grote card */}
          <div className="card h-full">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">{boardTitle}</h1>
            </div>

            <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
              <div
                ref={boardRef}
                data-board-capture="true"
                className="relative w-full h-[600px] bg-orange-50 rounded-xl border-4 border-dashed border-borderCard overflow-hidden"
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
                          crossOrigin="anonymous"
                          className="w-32 h-32 object-cover rounded-lg shadow-sm border-4 border-white pointer-events-none"
                        />
                        <button
                          onClick={() => removeItem(item.id, item.componentID)}
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
                          onClick={() => removeItem(item.id, item.componentID)}
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
                <div className="flex-1 grid grid-cols-2 auto-rows-min gap-2 mb-3 max-h-[530px] overflow-y-auto border-2 border-borderCard rounded-lg p-2">
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
                          onClick={() => removeImageFromGallery(img.id, img.imageID)}
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
                  <Upload className="w-4 h-4 mr-2" />
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
                    <Type className="w-4 h-4 r-2" />
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
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="px-6 py-3 border border-borderBtn rounded-lg bg-transparant hover:bg-colorBtn hover:text-txtColorBtn text-txtTransBtn text-lg font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            Delete Vision Board
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 border border-borderBtn rounded-lg bg-colorBtn text-txtColorBtn hover:bg-bgDefault hover:text-txtTransBtn text-lg font-semibold shadow-sm transition-all"
          >
            {isSaving ? 'Saving...' : 'Save Vision Board'}
          </button>
        </div>
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
                className="px-6 py-2 border border-borderBtn bg-transparent text-txtTransBtn rounded-lg hover:bg-colorBtn hover:text-txtColorBtn transition shadow-sm"
              >
                Yes
              </button>
              <button
                onClick={cancelBack}
                className="px-6 py-2 border border-colorBtn bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm hover:bg-transparent hover:text-txtTransBtn"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this visionboard?</h2>
            <p className="text-sm text-stone-600 mb-6">
              This action cannot be undone. All data will be permanently deleted.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 border border-borderBtn bg-transparent text-txtTransBtn rounded-lg hover:bg-colorBtn hover:text-txtColorBtn transition shadow-sm"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-6 py-2 border border-colorBtn bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm hover:bg-transparent hover:text-txtTransBtn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showNameRequiredModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Name Required</h2>
            <p className="text-sm text-stone-600 mb-6">
              Please give your vision board a name before saving.
            </p>
            <button
              onClick={() => setShowNameRequiredModal(false)}
              className="px-6 py-2 bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}