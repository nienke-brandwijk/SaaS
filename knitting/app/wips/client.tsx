"use client";

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { VisionBoard } from '../../src/domain/visionboard';
import { Comment } from '../../src/domain/comment';

//Helper functie om states te kunnen vergelijken 
const normalizeString = (str: string) => {
  return str
    .toLowerCase()          
    .replace(/\s+/g, '')     
    .trim();                 
};

// Helper functie om datum te formatteren bij comments
const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  } else if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
};

// Helper functie om comments te groeperen per datum
const groupCommentsByDate = (comments: Comment[]) => {
  const groups: { [key: string]: Comment[] } = {};
  
  comments.forEach(comment => {
    const dateKey = formatDate(comment.created_at);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(comment);
  });
  
  return groups;
};

export default function Wip({user, visionBoardsData}: {user: any, visionBoardsData: VisionBoard[] | null}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [needles, setNeedles] = useState<string[]>([]);
  const [yarns, setYarns] = useState<string[]>([]);
  const [gaugeSwatches, setGaugeSwatches] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [extraMaterials, setExtraMaterials] = useState<string[]>([]);
  const [yarnNeeded, setYarnNeeded] = useState<number>(0);
  const [yarnUsed, setYarnUsed] = useState<number>(0);
  const [chestCircumference, setChestCircumference] = useState<string>('');
  const [ease, setEase] = useState<string>('');

  const [newComment, setNewComment] = useState('');
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [tempComments, setTempComments] = useState<Array<{tempId: string, commentContent: string, created_at: Date}>>([]);

  //States voor image logica
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  //states voor back button
  const router = useRouter();
  const [showBackConfirm, setShowBackConfirm] = useState(false);

  //WIP information
  const [wipName, setWipName] = useState('');
  const [newCurrentPosition, setNewCurrentPosition] = useState('');

  //State voor verplichte name voor opslaan
  const [showNameRequiredModal, setShowNameRequiredModal] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'needle' | 'yarn' | 'gauge' | 'size' | 'material' | null
  >(null);
  const [modalValue, setModalValue] = useState('');

  // voorkomt dubbel klikken
  const [isSaving, setIsSaving] = useState(false);

  //Redirect naar login als geen user
  useEffect(() => {
    if (!user?.id) {
      router.push(`/login`);
    }
  }, [user, router]);

  //Keep JWT session alive based on user activity
  useEffect(() => {
    if (!user?.id) return;

    let lastActivity = Date.now();
    let refreshInterval: NodeJS.Timeout;

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Refresh JWT token every 10 minutes if user was active
    refreshInterval = setInterval(async () => {
      const inactiveDuration = Date.now() - lastActivity;
      const fiveMinutes = 5 * 60 * 1000;

      // Only refresh if user was active in last 5 minutes
      if (inactiveDuration < fiveMinutes) {
        try {
          const response = await fetch('/api/auth/refresh-session', {
            method: 'POST',
            credentials: 'include' // Important for cookies!
          });
          
          if (response.ok) {
            console.log('JWT session refreshed');
          } else if (response.status === 401) {
            // Token expired, redirect to login
            const currentPath = window.location.pathname;
            router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
          }
        } catch (error) {
          console.error('Session refresh failed:', error);
        }
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [user, router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setNewImageFile(file);
    
    // Toon preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    // Als het een nieuwe image is die nog niet opgeslagen is
    if (newImageFile && selectedImage) {
      setSelectedImage(null);
      setNewImageFile(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
  };

  const handleButtonClick = () => {
    if (selectedImage) {
      // Delete image
      setSelectedImage(null);
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      // Upload image
      fileInputRef.current?.click();
    }
  };

    //comment ui
    const handleAddTempComment = () => {
      const content = newComment.trim();
      if (!content) return;

      const tempComment = {
        tempId: `temp-${Date.now()}`,
        commentContent: content,
        created_at: new Date() 
      };

      setTempComments((prev) => [tempComment, ...prev]);
      setNewComment('');
    };

  const handleSave = async () => {
    if (isSaving) return; 

    // Check of wipName leeg is
    if (!wipName.trim()) {
        setShowNameRequiredModal(true);
        return;
    }
    
    setIsSaving(true);

    if(user?.id && wipName ){
      try {
        // Maak de nieuwe WIP aan
        const response = await fetch('/api/wips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wipName: wipName.trim(),
            wipPictureURL: null, 
            wipBoardID: null,
            wipFinished: false,
            wipCurrentPosition: newCurrentPosition.trim() || 'Just started',
            wipSize: sizes.length > 0 ? sizes[0] : null,
            wipChestCircumference: chestCircumference.trim() ? parseFloat(chestCircumference.trim()) : null,
            wipEase: ease.trim() ? parseFloat(ease.trim()) : null,
            userID: user.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create WIP');
        }

        const newWIP = await response.json();
        const wipID = newWIP.wipID;

        //needles
        for(const needle of needles){
            const [sizeInput, partInput] = needle.split(' - ').map(s => s.trim());
            const needleSize = sizeInput?.replace('mm', '').trim() || '';
            const needlePart = partInput || '';
          
          try {
            const response = await fetch('/api/needles', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                needleSize,
                needlePart,
                wipID: wipID,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to save needle');
            }

            const newNeedle = await response.json();
            
            
          } catch (error) {
            console.error("Error saving needle:", error);
            alert("Failed to save needle. Please try again.");
          }
        }

        //yarn
        for(const yarn of yarns){
            const [yarnName, yarnProducer] = yarn.split(' by ').map(s => s.trim());
            try {
                const response = await fetch('/api/yarns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    yarnName,
                    yarnProducer,
                    wipID: wipID,
                }),
                });

                if (!response.ok) {
                throw new Error('Failed to save yarn');
                }

                const newYarn = await response.json();
                
            } catch (error) {
                console.error("Error saving yarn:", error);
                alert("Failed to save yarn. Please try again.");
            }
        }
      

      //gauge
      for(const gauge of gaugeSwatches){
        // Split op ' - ', description is optioneel
        const parts = gauge.split(' - ').map(s => s.trim());
        const mainPart = parts[0];          // bv "10 stitches x 10 rows"
        const description = parts[1] || ''; // bv "test" of ""

        if (!mainPart) continue;

        // Haal stitches en rows eruit met regex
        const match = mainPart.match(/(\d+)\s*stitches\s*x\s*(\d+)\s*rows/i);
        if (!match || !match[1] || !match[2]) continue;

        const gaugeStitches = parseInt(match[1], 10);
        const gaugeRows = parseInt(match[2], 10);

        if (!gaugeStitches || !gaugeRows) continue;

        console.log("Gauge to save:", { gaugeStitches, gaugeRows, description });
            
        try {
          const response = await fetch('/api/gaugeSwatches', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gaugeStitches: gaugeStitches,
              gaugeRows: gaugeRows,
              gaugeDescription: description,
              wipID: wipID,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save gauge swatch');
          }

          const newGauge = await response.json();
          
        } catch (error) {
          console.error("Error saving gauge swatch:", error);
          alert("Failed to save gauge swatch. Please try again.");
        }
      }

    //size
    if(sizes.length > 0 && sizes[0]){
        try {
            const response = await fetch(`/api/wips/${wipID}/size`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wipSize: sizes[0],
            }),
            });

            if (!response.ok) {
            throw new Error('Failed to save size');
            }

        } catch (error) {
            console.error("Error saving size:", error);
            alert("Failed to save size. Please try again.");
        }
    }

      //extra materials
      for(const materials of extraMaterials){
        try {
            const response = await fetch('/api/extraMaterials', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                extraMaterialsDescription: materials,
                wipID: wipID,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to save extra material');
            }

            const newMaterial = await response.json();
            
          } catch (error) {
            console.error("Error saving extra material:", error);
            alert("Failed to save extra material. Please try again.");
          }
      }

      //Comments
      if(newComment.trim() !== ''){
          try {
            const response = await fetch('/api/comments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                commentContent: newComment.trim(),
                wipID: wipID,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to save comment');
            }

            const savedComment = await response.json();

          } catch (error) {
            console.error('Error saving comment:', error);
            alert('Failed to save comment. Please try again.');
          }
      }
            // Save temp comments
      for(const tempComment of tempComments) {
        try {
          const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              commentContent: tempComment.commentContent,
              wipID: wipID,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save comment');
          }
        } catch (error) {
          console.error('Error saving comment:', error);
          alert('Failed to save comment. Please try again.');
        }
      }

      //Current position
      if (newCurrentPosition.trim() !== '') {
        try {
          const response = await fetch(`/api/wips/${wipID}/currentPosition`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wipCurrentPosition: newCurrentPosition.trim() }),
          });

          if (!response.ok) {
            throw new Error('Failed to update current position');
          }
        } catch (error) {
          console.error('Error updating current position:', error);
          alert('Failed to update current position. Please try again.');
        }
      }

      setNewComment('');
      setNewCurrentPosition('');

      //Image handling
      if (selectedImage && wipID && user?.id) {
        // Check if it's a visionboard (URL) or uploaded file
        if (newImageFile) {
          // Uploaded file - use FormData
          try {
            const formData = new FormData();
            formData.append('image', newImageFile);

            const response = await fetch(`/api/wips/${wipID}/picture`, {
              method: 'PUT',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Failed to upload image');
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
          }
        } else {
          // Visionboard URL - send directly as JSON
          try {
            const response = await fetch(`/api/wips/${wipID}/picture`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl: selectedImage
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to save visionboard image');
            }
          } catch (error) {
            console.error('Error saving visionboard image:', error);
            alert('Failed to save visionboard image. Please try again.');
          }
        }
      }
        
        // Navigeer naar create pagina
        router.push("/create");

      } catch (error) {
        console.error(error);
        alert("Failed to save WIP. Please try again.");
        setIsSaving(false); // Reset ook bij error
      }
    } else {
      // Als er geen user is, reset de saving state
      alert("User not found. Please log in again.");
      setIsSaving(false);
    }
  };

  // open modal instead of prompt
  const openModal = (type: 'needle' | 'yarn' | 'gauge' | 'size' | 'material') => {
    setModalType(type);
    setModalValue(''); // reset field
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setModalValue('');
  };

  const saveModal = () => {
    const value = modalValue.trim();
    if (!value) return; // do not save empty

    switch (modalType) {
      case 'needle':
        setNeedles((prev) => [...prev, value]);
        break;
      case 'yarn':
        const [yarnName, yarnProducer] = modalValue.split(' - ').map(s => s.trim());
        setYarns((prev) => [...prev, yarnProducer ? `${yarnName} by ${yarnProducer}` : yarnName || '']);
        break;
      case 'gauge':
        const gaugeParts = modalValue.split(' - ').map(s => s.trim());
        const stitches = gaugeParts[0];
        const rows = gaugeParts[1];
        const description = gaugeParts[2] || '';

        
        const displayText = description 
            ? `${stitches} stitches x ${rows} rows - ${description}`
            : `${stitches} stitches x ${rows} rows`;
          setGaugeSwatches((prev) => [...prev, displayText]);
        break;
      case 'size':
        if (sizes.length >= 1) return; // Prevent adding more than 1

        setSizes([value]);
        break;
      case 'material':
        setExtraMaterials((prev) => [...prev, value]);
        break;
      default:
        break;
    }
    closeModal();
  };

  // convenience wrappers used by buttons
  const addNeedle = () => openModal('needle');
  const addYarn = () => openModal('yarn');
  const addGaugeSwatch = () => openModal('gauge');
  const addSize = () => openModal('size');
  const addMaterial = () => openModal('material');

  // remove handlers
  const removeNeedle = async (index: number) => {
    setNeedles((prev) => prev.filter((_, i) => i !== index));
  };
  const removeYarn = async (index: number) => {
    setYarns((prev) => prev.filter((_, i) => i !== index));
  };
  const removeSize = async (index: number) => {
    setSizes([]);
  };
  const removeMaterial = async (index: number) => {
    setExtraMaterials((prev) => prev.filter((_, i) => i !== index));
  };
  const removeGaugeSwatch = async (index: number) => {
    setGaugeSwatches((prev) => prev.filter((_, i) => i !== index));
  };
    const removeComment = async (commentID: number) => {
      setCommentsList((prev) => prev.filter((c) => c.commentID !== commentID));
  };

    // Back function
    const handleBack = () => {
    // Check of er wijzigingen zijn gemaakt
    const hasAnyChanges = 
        wipName.trim() !== '' ||
        needles.length > 0 ||
        yarns.length > 0 ||
        gaugeSwatches.length > 0 ||
        sizes.length > 0 ||
        extraMaterials.length > 0 ||
        newComment.trim() !== '' ||
        newCurrentPosition.trim() !== '' ||
        selectedImage !== null ||
        yarnNeeded > 0 ||
        yarnUsed > 0 ||
        chestCircumference.trim() !== '' ||
        ease.trim() !== '';

    if (hasAnyChanges) {
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

  //visionboard popup 
  const [visionboardPopupOpen, setVisionboardPopupOpen] = useState(false);

  const openVisionboardPopup = () => {
    setVisionboardPopupOpen(true);
  };

  const closeVisionboardPopup = () => {
    setVisionboardPopupOpen(false);
  };

  const handleVisionboardSelect = (visionBoard: VisionBoard) => {
    if(visionBoardsData){
      if (visionBoard.boardURL) {
      setSelectedImage(visionBoard.boardURL);
      setNewImageFile(null);
      setFileName(visionBoard.boardName || 'Visionboard image');
    }
    }
    closeVisionboardPopup();
  };

  // Close visionboard popup on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visionboardPopupOpen) {
        closeVisionboardPopup();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [visionboardPopupOpen]);

  return (
    // 3 row layout
    <div className='flex flex-col gap-6 max-w-6xl mx-auto py-12'>

      {/* row 1: new project */}
      <h1 className="card-title font-bold text-txtBold text-2xl px-6 py-1">Your new WIP</h1>

      {/* row 2: main content - 2 columns layout */}
      <div className='flex flex-row px-6 gap-8 h-full items-start '>

        {/* left column: title, image, comments - 2 row layout*/}
        <div className='flex flex-col gap-4 flex-1'>

          {/* top row: title and image */}
          <div className="card">
            <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
              <div className="space-y-2">
                <label htmlFor="boardTitle" className="block text-lg font-semibold text-txtDefault">
                  Give your WIP a name
                </label>
                <input
                  id="boardTitle"
                  type="text"
                  placeholder="e.g., Red Cardigan"
                  className="w-full px-4 py-3 border-2 border-borderCard rounded-lg text-lg"
                  value={wipName}
                  onChange={(e) => setWipName(e.target.value)}
                />

                {selectedImage ? (
                  <div className="relative w-2/3 mx-auto">
                  <img
                    src={selectedImage}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  {/* Delete button */}
                  <button
                    onClick={handleDeleteImage}
                    className=" bg-white absolute top-2 right-2 ml-2 w-6 h-6 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover"
                    aria-label='remove picture'
                  >
                    <svg className="w-4 h-4 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
                ) : (
                  <div className="space-y-2">
                    <label htmlFor="boardTitle" className="block text-lg font-semibold text-txtDefault">
                      Add an image
                    </label>
                    <div className="flex flex-col gap-4">
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />

                      {/* Toggle button */}
                      <div className='flex gap-4'>
                        <button
                          onClick={handleButtonClick}
                          className={`flex items-center gap-2 px-4 py-2 border border-borderBtn rounded-lg text-lg w-fit ${
                            selectedImage
                              ? 'bg-transparent text-txtTransBtn hover:bg-colorBtn hover:text-txtColorBtn'
                              : 'bg-colorBtn text-txtColorBtn hover:bg-transparent hover:text-txtTransBtn'
                          }`}
                        >
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload image
                          </>
                        </button>
                        <button
                          onClick={openVisionboardPopup}
                          className={`flex items-center gap-2 px-4 py-2 border border-borderBtn rounded-lg text-lg w-fit ${
                            selectedImage
                              ? 'bg-transparent text-txtTransBtn hover:bg-colorBtn hover:text-txtColorBtn'
                              : 'bg-colorBtn text-txtColorBtn hover:bg-transparent hover:text-txtTransBtn'
                          }`}
                        >
                          <>
                            Select visionboard
                          </>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* bottom row: comments*/}
            <div className="card">
              <div className="flex items-center gap-4 py-2">
                <h1 className="card-title font-bold text-txtBold text-2xl">Comments</h1>
              </div>

              <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
                {/* Toon bestaande comments gegroepeerd per datum */}
                {(commentsList.length > 0 || tempComments.length > 0) && (
                  <div className="space-y-4">
                    {Object.entries(groupCommentsByDate([
                      // Combineer temp comments eerst (meest recent)
                      ...tempComments.map(tc => ({
                        commentID: -1,
                        created_at: tc.created_at,
                        commentContent: tc.commentContent,
                        wipID: 0,
                        isTempComment: true,
                        tempId: tc.tempId
                      })),
                      // Daarna echte comments
                      ...commentsList.map(c => ({
                        ...c,
                        isTempComment: false
                      }))
                    ])).map(([date, dateComments]) => (
                      <div key={date}>
                        {/* Datum header */}
                        <p className="text-xs text-gray-400 mb-2">{date}</p>
                        
                        {/* Comments voor deze datum */}
                        <div className="space-y-2">
                          {dateComments.map((comment: any) => (
                            <div key={comment.isTempComment ? comment.tempId : comment.commentID} className="flex items-center justify-between gap-2">
                              <p className="text-sm text-txtDefault">{comment.commentContent}</p>
                              <button
                                onClick={() => {
                                  if (comment.isTempComment) {
                                    setTempComments(prev => prev.filter(tc => tc.tempId !== comment.tempId));
                                  } else {
                                    removeComment(comment.commentID);
                                  }
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover flex-shrink-0"
                                aria-label="Remove comment"
                              >
                                <svg className="w-4 h-4 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    id="boardTitle"
                    type="text"
                    placeholder="Add some comments here"
                    className="w-full px-4 py-3 border-2 border-borderCard rounded-lg text-lg"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTempComment();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
        </div>

        {/* right column: project details */}
        <div className='card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 space-y-6'>
          <label htmlFor="boardTitle" className="block text-lg font-semibold text-txtDefault">
            WIP details
          </label>

          {/* Needles */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold text-txtDefault'>Needles</h3>
              <button
                onClick={addNeedle}
                className='w-5 h-5 border border-borderCard rounded flex items-center justify-center text-sm hover:bg-gray-100'
                aria-label="Add needle"
              >
                +
              </button>
            </div>
            {needles.length > 0 && (
              <ul className='text-sm text-txtDefault space-y-1 ml-4'>
                {needles.map((needle, index) => (
                  <li key={index} className="flex items-center justify-between gap-2">
                    <span>• {needle}</span>
                    <button
                      onClick={() => removeNeedle(index)}
                      className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover"
                      aria-label={`Remove needle ${needle}`}
                    >
                      <svg className="w-4 h-4 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Yarn */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold text-txtDefault'>Yarn</h3>
              <button
                onClick={addYarn}
                className='w-5 h-5 border border-borderCard rounded flex items-center justify-center text-sm hover:bg-bgHover'
                aria-label="Add yarn"
              >
                +
              </button>
            </div>
            {yarns.length > 0 && (
              <ul className='text-sm text-txtDefault space-y-1 ml-4'>
                {yarns.map((yarn, index) => (
                  <li key={index} className="flex items-center justify-between gap-2">
                    <span>• {yarn}</span>
                    <button
                      onClick={() => removeYarn(index)}
                      className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover"
                      aria-label={`Remove yarn ${yarn}`}
                    >
                      <svg className="w-4 h-4 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Gauge swatch */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold text-txtDefault'>Gauge swatch</h3>
              <button
                onClick={addGaugeSwatch}
                className='w-5 h-5 border border-borderCard rounded flex items-center justify-center text-sm hover:bg-bgHover'
                aria-label="Add gauge swatch"
              >
                +
              </button>
            </div>
            {gaugeSwatches.length > 0 && (
                <ul className='text-sm text-txtDefault space-y-1 ml-4'>
                  {gaugeSwatches.map((gauge, index) => (
                    <li key={index} className="flex items-center justify-between gap-2">
                      <span>• {gauge}</span>
                      <button
                        onClick={() => removeGaugeSwatch(index)}
                        className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover"
                        aria-label={`Remove gauge swatch ${gauge}`}
                      >
                        <svg className="w-4 h-4 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
          </div>

          {/* Size */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-txtDefault'>Size</h3>
                <button
                  onClick={addSize}
                  disabled={sizes.length >= 1}
                  className={`w-5 h-5 border border-borderCard rounded flex items-center justify-center text-sm ${
                    sizes.length >= 1 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-bgHover'
                  }`}
                  aria-label="Add size"
                >
                  +
                </button>
              </div>
              {sizes.length > 0 && (
                <ul className='text-sm text-txtDefault space-y-1 ml-4'>
                  {sizes.map((size, index) => (
                    <li key={index} className="flex items-center justify-between gap-2">
                      <span>• {size}</span>
                      <button
                        onClick={() => removeSize(index)}
                        className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover"
                        aria-label={`Remove size ${size}`}
                      >
                        <svg className="w-4 h-4 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Chest circumference and Ease */}
            <div className='flex gap-4'>
            {/* Chest circumference */}
            <div className='flex-1 space-y-2'>
                <h3 className='font-semibold text-txtDefault'>Chest circumference</h3>
                <input
                    type="number"
                    step="0.1"
                    value={chestCircumference}
                    onChange={(e) => setChestCircumference(e.target.value)}
                    placeholder="e.g., 90"
                    className="w-full px-3 py-2 border border-borderCard rounded-lg text-sm text-txtDefault"
                />
            </div>

            {/* Ease */}
            <div className='flex-1 space-y-2'>
                <h3 className='font-semibold text-txtDefault'>Ease</h3>
                <input
                    type="number"
                    step="0.1"
                    value={ease}
                    onChange={(e) => setEase(e.target.value)}
                    placeholder="e.g., 10"
                    className="w-full px-3 py-2 border border-borderCard rounded-lg text-sm text-txtDefault"
                />
            </div>
            </div>

          {/* Extra materials */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <h3 className='font-semibold text-txtDefault'>Extra materials</h3>
              <button
                onClick={addMaterial}
                className='w-5 h-5 border border-borderCard rounded flex items-center justify-center text-sm hover:bg-bgHover'
                aria-label="Add extra material"
              >
                +
              </button>
            </div>
            {extraMaterials.length > 0 && (
              <ul className='text-sm text-txtDefault space-y-1 ml-4'>
                {extraMaterials.map((material, index) => (
                  <li key={index} className="flex items-center justify-between gap-2">
                    <span>• {material}</span>
                    <button
                      onClick={() => removeMaterial(index)}
                      className="ml-2 w-6 h-6 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover"
                      aria-label={`Remove material ${material}`}
                    >
                      <svg className="w-4 h-4 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7L5 7M10 11v6M14 11v6M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Current position */}
          <div className='space-y-2'>
            <h3 className='font-semibold text-txtDefault'>Current position</h3>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-txtDefault">Creating a new WIP.</p>
            </div>
            <div className='border border-borderCard rounded-lg p-3 bg-bgDefault'>
              <textarea
                placeholder='Add notes about your new current position when applicable...'
                className='w-full text-sm text-txtDefault bg-transparent resize-none border-none focus:outline-none'
                rows={2}
                value={newCurrentPosition}
                onChange={(e) => setNewCurrentPosition(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* row 3: Save and Back Button */}
      <div className="px-6 mt-8 pb-12 max-w-6xl mx-auto w-full flex justify-between">
        <button
          onClick={handleBack}
          disabled={isSaving}
          data-testid="back-button"
          className="px-6 py-3 border border-borderBtn rounded-lg bg-transparent hover:bg-colorBtn hover:text-txtColorBtn text-txtTransBtn text-lg font-semibold shadow transition-all flex items-center gap-2"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save project"
          className="px-6 py-3 border border-borderBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn text-txtColorBtn text-lg font-semibold shadow transition-all"
        >
          {isSaving ? "Saving..." : "Save WIP"}
        </button>
      </div>
    
    

      {/* Modal popup */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeModal}
            />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
              <h2 className="text-lg font-semibold mb-3">
                {modalType === 'needle' && 'Add needle'}
                {modalType === 'yarn' && 'Add yarn'}
                {modalType === 'gauge' && 'Add gauge swatch'}
                {modalType === 'size' && 'Add size'}
                {modalType === 'material' && 'Add extra material'}
              </h2>

              {modalType === 'yarn' ? (
                <>
                  <input
                    autoFocus
                    value={modalValue.split(' - ')[0] || ''}
                    onChange={(e) => {
                      const size = e.target.value;
                      const part = modalValue.split(' - ')[1] || '';
                      setModalValue(part ? `${size} - ${part}` : size);
                    }}
                    className="w-full px-4 py-2 border border-borderCard rounded-lg mb-4"
                    placeholder="Yarn name (e.g., Cozy Wool)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveModal();
                      if (e.key === 'Escape') closeModal();
                    }}
                  />
                  <input
                    value={modalValue.split(' - ')[1] || ''}
                    onChange={(e) => {
                      const size = modalValue.split(' - ')[0] || '';
                      const part = e.target.value || '';
                      setModalValue(`${size} - ${part}`);
                    }}
                    className="w-full px-4 py-2 border border-borderCard rounded-lg mb-4"
                    placeholder="yarn producer (e.g., YarnCo)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveModal();
                      if (e.key === 'Escape') closeModal();
                    }}
                  />
                </>
              ) : modalType === 'needle' ? (
                <>
                  <input
                    autoFocus
                    value={modalValue.split(' - ')[0] || ''}
                    onChange={(e) => {
                      const size = e.target.value;
                      const part = modalValue.split(' - ')[1] || '';
                      setModalValue(part ? `${size} - ${part}` : size);
                    }}
                    className="w-full px-4 py-2 border border-borderCard rounded-lg mb-4"
                    placeholder="Size needle in mm (e.g., 4.0mm)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveModal();
                      if (e.key === 'Escape') closeModal();
                    }}
                  />
                  <input
                    value={modalValue.split(' - ')[1] || ''}
                    onChange={(e) => {
                      const size = modalValue.split(' - ')[0] || '';
                      const part = e.target.value;
                      setModalValue(`${size} - ${part}`);
                    }}
                    className="w-full px-4 py-2 border border-borderCard rounded-lg mb-4"
                    placeholder="Section using this needle (e.g., Body, Sleeves)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveModal();
                      if (e.key === 'Escape') closeModal();
                    }}
                  />
                </>
              ) : modalType === 'gauge' ? (
                <>
                  <div className="flex gap-2 mb-4">
                    <input
                      autoFocus
                      value={modalValue.split(' - ')[0] || ''}
                      onChange={(e) => {
                        const stitches = e.target.value;
                        const rows = modalValue.split(' - ')[1] || '';
                        const desc = modalValue.split(' - ')[2] || '';
                        setModalValue(desc ? `${stitches} - ${rows} - ${desc}` : `${stitches} - ${rows}`);
                      }}
                      className="w-full px-4 py-2 border border-borderCard rounded-lg"
                      placeholder="Stitches"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveModal();
                        if (e.key === 'Escape') closeModal();
                      }}
                    />
                    <span className="flex items-center text-txtDefault">x</span>
                    <input
                      value={modalValue.split(' - ')[1] || ''}
                      onChange={(e) => {
                        const stitches = modalValue.split(' - ')[0] || '';
                        const rows = e.target.value;
                        const desc = modalValue.split(' - ')[2] || '';
                        setModalValue(desc ? `${stitches} - ${rows} - ${desc}` : `${stitches} - ${rows}`);
                      }}
                      className="w-full px-4 py-2 border border-borderCard rounded-lg"
                      placeholder="Rows"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveModal();
                        if (e.key === 'Escape') closeModal();
                      }}
                    />
                  </div>
                  <input
                    value={modalValue.split(' - ')[2] || ''}
                    onChange={(e) => {
                      const stitches = modalValue.split(' - ')[0] || '';
                      const rows = modalValue.split(' - ')[1] || '';
                      const desc = e.target.value;
                      setModalValue(desc ? `${stitches} - ${rows} - ${desc}` : `${stitches} - ${rows}`);
                    }}
                    className="w-full px-4 py-2 border border-borderCard rounded-lg mb-4"
                    placeholder="Description (e.g., stockinette stitch, after blocking)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveModal();
                      if (e.key === 'Escape') closeModal();
                    }}
                  />
                </>
              ): (
                <input
                  autoFocus
                  value={modalValue}
                  onChange={(e) => setModalValue(e.target.value)}
                  className="w-full px-4 py-2 border border-borderCard rounded-lg mb-4"
                  placeholder={
                    ""
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveModal();
                    if (e.key === 'Escape') closeModal();
                  }}
                />
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-borderBtn bg-transparent text-txtTransBtn rounded-lg hover:bg-colorBtn hover:text-txtColorBtn"
                >
                  Cancel
                </button>
                <button
                  onClick={saveModal}
                  className="px-4 py-2 border border-borderBtn bg-colorBtn text-txtColorBtn rounded-lg hover:bg-transparent hover:text-txtTransBtn"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Confirmation Modal */}
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

        {/* Name Required Modal */}
        {showNameRequiredModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4">Name Required</h2>
            <p className="text-sm text-stone-600 mb-6">
                Please enter a name for your WIP to proceed.
            </p>
            <div className="flex justify-center">
                <button
                onClick={() => setShowNameRequiredModal(false)}
                className="px-6 py-2 bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm"
                >
                OK
                </button>
            </div>
            </div>
        </div>
        )}

        {/* Visionboard Selection Modal */}
        {visionboardPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={closeVisionboardPopup}
            />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Select a visionboard</h2>
                <button
                  onClick={closeVisionboardPopup}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-borderCard hover:bg-bgHover"
                  aria-label="Close visionboard selection"
                >
                  <svg className="w-5 h-5 text-txtTransBtn" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!visionBoardsData || visionBoardsData.length === 0 ? (
                <p className="text-center text-txtDefault py-8">No visionboards available</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {visionBoardsData
                    .filter(vb => vb.boardURL) 
                    .map((visionBoard) => (
                      <button
                        key={visionBoard.boardID}
                        onClick={() => handleVisionboardSelect(visionBoard)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={visionBoard.boardURL}
                          alt={visionBoard.boardName || 'Visionboard'}
                          className="h-48 w-auto object-contain rounded-lg"
                        />
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
    </div>

    
  );
}