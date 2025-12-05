"use client";

import { useState, useRef, useEffect} from 'react';
import { WIPDetails } from '../../../src/domain/wipDetails';
import { Comment } from '../../../src/domain/comment';
import { useRouter } from 'next/navigation';
import { Calculation } from '../../../src/domain/calculation';
import { VisionBoard } from '../../../src/domain/visionboard';

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

//Helper functie om states te kunnen vergelijken 
const normalizeString = (str: string) => {
  return str
    .toLowerCase()          
    .replace(/\s+/g, '')     
    .trim();                 
};

type SavedCalc = {
  id: number;
  name: string;
  type: string;
  input1: number;
  input2: number;
  result: string;
  timestamp: string;
  wipIDs: number[] | null;
};

const convertToSavedCalc = (calc: Calculation): SavedCalc => {
  let type = calc.calculationName;
  if (calc.calculationInputX.includes("Required amount")) {
    type = "Yarn Amount";
  } else if (calc.calculationInputX.includes("Pattern gauge")) {
    type = "Gauge Swatch";
  } else if (calc.calculationInputX.includes("Edge length")) {
    type = "Picked Stitches";
  }

  const input1Match = calc.calculationInputX.match(/[\d.]+/);
  const input2Match = calc.calculationInputY.match(/[\d.]+/);

  return {
    id: calc.calculationID,
    name: calc.calculationName,
    type: type,
    input1: input1Match ? parseFloat(input1Match[0]) : 0,
    input2: input2Match ? parseFloat(input2Match[0]) : 0,
    result: calc.calculationOutput,
    timestamp: new Date(calc.created_at).toLocaleString(),
    wipIDs: calc.wipID ? [calc.wipID] : null,
  };
};


export default function Wip({user, wipData, comments, calculations, visionBoardsData }: { user: any, wipData: WIPDetails | null , comments: Comment[], calculations: Calculation[], visionBoardsData: VisionBoard[] | null}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  //finish WIP button
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);

  //delete WIP button
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); 

  //States voor image logica
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [originalImage] = useState(wipData?.wipPictureURL || null);

  //Vul data met data van db
  const [needles, setNeedles] = useState<string[]>(wipData?.needles?.map(n => `${n.needleSize}mm - ${n.needlePart}`) || []);
  const [yarns, setYarns] = useState<string[]>(wipData?.yarns?.map(y => `${y.yarnName} by ${y.yarnProducer}`) || []);
  const [gaugeSwatches, setGaugeSwatches] = useState<string[]>(wipData?.gaugeSwatches?.map(g => g.gaugeDescription ? `${g.gaugeStitches} stitches x ${g.gaugeRows} rows - ${g.gaugeDescription}`: `${g.gaugeStitches} stitches x ${g.gaugeRows} rows`) || []);  
  const [sizes, setSizes] = useState<string[]>(wipData?.wipSize ? [wipData.wipSize] : []);
  const [extraMaterials, setExtraMaterials] = useState<string[]>(wipData?.extraMaterials?.map(m => m.extraMaterialsDescription) || []);
  const [commentsList, setCommentsList] = useState<Comment[]>(comments || []);
  const [chestCircumference, setChestCircumference] = useState<string>(wipData?.wipChestCircumference?.toString() || '');
  const [ease, setEase] = useState<string>(wipData?.wipEase?.toString() || '');

  const [newComment, setNewComment] = useState('');
  const [newCurrentPosition, setNewCurrentPosition] = useState('');
  const [tempComments, setTempComments] = useState<Array<{tempId: string, commentContent: string, created_at: Date}>>([]);

  //Behoud data bij start van pagina voor latere vergelijking
  const [originalNeedles] = useState(needles);
  const [originalYarns] = useState(yarns);
  const [originalGaugeSwatches] = useState(gaugeSwatches);
  const [originalSizes] = useState(sizes);
  const [originalExtraMaterials] = useState(extraMaterials);
  const [originalComments] = useState(commentsList);
  const [originalChestCircumference] = useState(chestCircumference);
  const [originalEase] = useState(ease);

  //states voor back button
  const router = useRouter();
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  //states voor calculations
  const [calculationsList, setCalculationsList] = useState<SavedCalc[]>(
    calculations.map(convertToSavedCalc) 
  );
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const calculationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calculationsRef.current && !calculationsRef.current.contains(event.target as Node)) {
        if (openDropdownId !== null) {
          setOpenDropdownId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId]);

  const getChanges = () => {
    const needlesToAdd = needles.filter(
      n => !originalNeedles.some(orig => normalizeString(orig) === normalizeString(n))
    );
    const needlesToRemove = originalNeedles.filter(
      orig => !needles.some(n => normalizeString(orig) === normalizeString(n))
    );

    const yarnsToAdd = yarns.filter(
      y => !originalYarns.some(orig => normalizeString(orig) === normalizeString(y))
    );
    const yarnsToRemove = originalYarns.filter(
      orig => !yarns.some(y => normalizeString(orig) === normalizeString(y))
    );

    const gaugesToAdd = gaugeSwatches.filter(
      g => !originalGaugeSwatches.some(orig => normalizeString(orig) === normalizeString(g))
    );
    const gaugesToRemove = originalGaugeSwatches.filter(
      orig => !gaugeSwatches.some(g => normalizeString(orig) === normalizeString(g))
    );

    const sizesToUpdate =
      normalizeString(sizes[0] || '') !== normalizeString(originalSizes[0] || '')
        ? sizes[0]
        : null;

    const materialsToAdd = extraMaterials.filter(
      m => !originalExtraMaterials.some(orig => normalizeString(orig) === normalizeString(m))
    );
    const materialsToRemove = originalExtraMaterials.filter(
      orig => !extraMaterials.some(m => normalizeString(orig) === normalizeString(m))
    );

    const commentsToRemove = originalComments.filter(
      orig => !commentsList.some(c => c.commentID === orig.commentID)
    );

    const commentsToAdd = tempComments.length > 0 || normalizeString(newComment || '') !== '';

    const currentPositionChanged = normalizeString(newCurrentPosition || '') !== '';

    const imageChanged = newImageFile !== null || imageToDelete !== null ||(selectedImage !== null && selectedImage !== originalImage);

    const chestCircChanged = normalizeString(chestCircumference) !== normalizeString(originalChestCircumference);

    const easeChanged = normalizeString(ease) !== normalizeString(originalEase);

    const hasChanges =
      needlesToAdd.length > 0 ||
      needlesToRemove.length > 0 ||
      yarnsToAdd.length > 0 ||
      yarnsToRemove.length > 0 ||
      gaugesToAdd.length > 0 ||
      gaugesToRemove.length > 0 ||
      sizesToUpdate !== null ||
      materialsToAdd.length > 0 ||
      materialsToRemove.length > 0 ||
      commentsToRemove.length > 0 ||
      currentPositionChanged ||
      chestCircChanged ||      
      easeChanged ||
      commentsToAdd ||
      imageChanged;

    return {
      needlesToAdd,
      needlesToRemove,
      yarnsToAdd,
      yarnsToRemove,
      gaugesToAdd,
      gaugesToRemove,
      sizesToUpdate,
      materialsToAdd,
      materialsToRemove,
      commentsToRemove,
      currentPositionChanged,
      imageChanged,
      chestCircChanged,
      easeChanged,
      commentsToAdd,
      hasChanges,
    };
  };

  // Finish WIP function
  const handleFinishWIP = () => {
    setShowFinishConfirm(true);
  };

  // Yes button in finish modal
  const confirmFinish = async () => {
    try {
      const response = await fetch(`/api/wips/${wipData?.wipID}/finish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to finish WIP');
      }

      setShowFinishConfirm(false);
      router.push("/create");
    } catch (error) {
      console.error('Error finishing WIP:', error);
      alert('Failed to finish WIP. Please try again.');
      setShowFinishConfirm(false);
    }
  };

  // No button in finish modal
  const cancelFinish = () => {
    setShowFinishConfirm(false);
  };

  const handleDeleteWIP = () => {
  setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/wips/${wipData?.wipID}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete WIP');
      }

      setShowDeleteConfirm(false);
      router.push("/create");
    } catch (error) {
      console.error('Error deleting WIP:', error);
      alert('Failed to delete WIP. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // voorkomt dubbel klikken
  const [isSaving, setIsSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'needle' | 'yarn' | 'gauge' | 'size' | 'material' | null
  >(null);
  const [modalValue, setModalValue] = useState('');

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

    // Als het een bestaande image uit database is
    if (wipData?.wipPictureURL) {
      setImageToDelete(wipData.wipPictureURL);
      setSelectedImage(null); 
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

  // Save function
  const handleSave = async () => {
    if (isSaving) return; 
    setIsSaving(true);

    try{
      //Haal eerst alle veranderingen op
      const changes = getChanges();

      if (!changes.hasChanges) {
        router.push("/create");
        return;
      }

      //measurements
      if (changes.chestCircChanged || changes.easeChanged) {
        try {
          // Parse strings naar numbers, lege strings worden null
          const chestCirc = chestCircumference.trim() !== '' 
            ? parseFloat(chestCircumference) 
            : null;
          const easeValue = ease.trim() !== '' 
            ? parseFloat(ease) 
            : null;

          const response = await fetch(`/api/wips/${wipData?.wipID}/measurements`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              wipChestCircumference: chestCirc, 
              wipEase: easeValue 
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update measurements');
          }
        } catch (error) {
          console.error('Error updating measurements:', error);
          alert('Failed to update measurements. Please try again.');
        }
      }

      //needles
      for(const needle of changes.needlesToAdd){
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
                wipID: wipData?.wipID,
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
      for(const needle of changes.needlesToRemove){
        const [sizeInput, partInput] = needle.split(' - ').map(s => s.trim());
        const needleSize = sizeInput?.replace('mm', '').trim() || '';
        const needlePart = partInput || '';

        const needleObj = wipData?.needles?.find(n => 
          n.needleSize.toString() === needleSize &&
          (n.needlePart || '').trim() === needlePart
        );
        if (!needleObj?.needleID) continue;

        try {
          const response = await fetch(`/api/needles/${needleObj.needleID}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete needle');
          }

          
        } catch (error) {
          console.error("Error deleting needle:", error);
          alert("Failed to delete needle. Please try again.");
        }
      }

      //yarn 
      for(const yarn of changes.yarnsToAdd){
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
                wipID: wipData?.wipID,
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
      for(const yarn of changes.yarnsToRemove){
        const [yarnName, yarnProducer] = yarn.split(' by ').map(s => s.trim());

        const yarnObj = wipData?.yarns?.find(y => 
          y.yarnName === yarnName && y.yarnProducer === yarnProducer
        );

        if (!yarnObj?.yarnID) return;

        try {
          const response = await fetch(`/api/yarns/${yarnObj.yarnID}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete yarn');
          }

          
        } catch (error) {
          console.error("Error deleting yarn:", error);
          alert("Failed to delete yarn. Please try again.");
        }
      }

      //gauge
      for(const gauge of changes.gaugesToAdd){
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
              wipID: wipData?.wipID,
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
      for(const gauge of changes.gaugesToRemove){
        const parts = gauge.split(' - ').map(s => s.trim());
        const mainPart = parts[0];          
        const description = parts[1] || ''; 

        if (!mainPart) continue;

        const match = mainPart.match(/(\d+)\s*stitches\s*x\s*(\d+)\s*rows/i);
        if (!match || !match[1] || !match[2]) continue;

        const gaugeStitches = parseInt(match[1], 10);
        const gaugeRows = parseInt(match[2], 10);

        const gaugeObj = wipData?.gaugeSwatches?.find(g =>
          g.gaugeStitches === gaugeStitches &&
          g.gaugeRows === gaugeRows &&
          (g.gaugeDescription || '') === description
        );

        if (!gaugeObj?.gaugeID) continue; 

        try {
          const response = await fetch(`/api/gaugeSwatches/${gaugeObj.gaugeID}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete gauge swatch');
          }

          
        } catch (error) {
          console.error("Error deleting gauge swatch:", error);
          alert("Failed to delete gauge swatch. Please try again.");
        }

      }

      //size
      if(originalSizes[0] && (!sizes[0] || sizes[0].trim() === '')){
        try {
          const response = await fetch(`/api/wips/${wipData?.wipID}/size`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              wipSize: null,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to remove size');
          }

          
        } catch (error) {
          console.error("Error removing size:", error);
          alert("Failed to remove size. Please try again.");
        }
      }
      else if(changes.sizesToUpdate !== null){
        try {
            const response = await fetch(`/api/wips/${wipData?.wipID}/size`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                wipSize: changes.sizesToUpdate,
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
      for(const materials of changes.materialsToAdd){
        try {
            const response = await fetch('/api/extraMaterials', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                extraMaterialsDescription: materials,
                wipID: wipData?.wipID,
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
      for(const materials of changes.materialsToRemove){
        const materialObj = wipData?.extraMaterials?.find(m => 
          m.extraMaterialsDescription === materials
        );
        if (!materialObj?.extraMaterialsID) return;

        try {
          const response = await fetch(`/api/extraMaterials/${materialObj.extraMaterialsID}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete extra material');
          }

          
        } catch (error) {
          console.error("Error deleting extra material:", error);
          alert("Failed to delete extra material. Please try again.");
        }
      }

      //Comments
      for(const comment of changes.commentsToRemove){
          try {
          const response = await fetch(`/api/comments/${comment.commentID}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to delete comment');
          }

          
        } catch (error) {
          console.error("Error deleting comment:", error);
          alert("Failed to delete comment. Please try again.");
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
              wipID: wipData?.wipID,
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

      if(newComment.trim() !== ''){
          try {
            const response = await fetch('/api/comments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                commentContent: newComment.trim(),
                wipID: wipData?.wipID,
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

      //Current position
      if (newCurrentPosition.trim() !== '') {
        try {
          const response = await fetch(`/api/wips/${wipData?.wipID}/currentPosition`, {
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

      // Image handling
      if (selectedImage && wipData?.wipID && user?.id) {
        // Check if it's a visionboard (URL) or uploaded file
        if (newImageFile) {
          // Uploaded file scenarios
          if (imageToDelete) {
            // Replace: delete old + upload new
            try {
              const formData = new FormData();
              formData.append('image', newImageFile);
              formData.append('deleteUrl', imageToDelete);

              const response = await fetch(`/api/wips/${wipData.wipID}/picture`, {
                method: 'PUT',
                body: formData,
              });

              if (!response.ok) {
                throw new Error('Failed to replace image');
              }
            } catch (error) {
              console.error('Error replacing image:', error);
              alert('Failed to replace image. Please try again.');
            }
          } else {
            // Only upload (no old image to delete)
            try {
              const formData = new FormData();
              formData.append('image', newImageFile);

              const response = await fetch(`/api/wips/${wipData.wipID}/picture`, {
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
          }
        } else {
          // Visionboard URL - send directly as JSON
          try {
            const response = await fetch(`/api/wips/${wipData.wipID}/picture`, {
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
      } else if (imageToDelete && wipData?.wipID) {
        // Only delete scenario
        try {
          const formData = new FormData();
          formData.append('deleteUrl', imageToDelete);

          const response = await fetch(`/api/wips/${wipData.wipID}/picture`, {
            method: 'DELETE',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to delete image');
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          alert('Failed to delete image. Please try again.');
        }
      }

      router.push("/create");
    }catch (error) {
      console.error(error);
      alert("Failed to save. Please try again.");
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

  const saveModal = async () => {
    const value = modalValue.trim();
    if (!value) return; // do not save empty

    switch (modalType) {
      case 'needle':
        // Update lokale state
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
    const { hasChanges } = getChanges();
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

  //helpers for caluclations dropdown
 const closeCalculationMenu = () => {
    setOpenDropdownId(null);
  };

  const handleRemoveFromWip = async (calculationID: number) => {
    closeCalculationMenu();
    try {
      const response = await fetch(`/api/calculations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculationID: calculationID, wipID: null }), 
      });

      if (!response.ok) {
        throw new Error('Failed to remove calculation from WIP');
      }

      setCalculationsList((prev) => 
        prev.filter((calc) => calc.id !== calculationID)
      );
    } catch (error) {
      console.error('Error removing calculation from WIP:', error);
      alert('Fout bij het verwijderen van de berekening uit de WIP.');
    }
  };

  const handleDeleteCalculation = async (calculationID: number) => {
    closeCalculationMenu();
    try {
      const response = await fetch(`/api/calculations?id=${calculationID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete calculation');
      }

      setCalculationsList((prev) => 
        prev.filter((calc) => calc.id !== calculationID)
      );
    } catch (error) {
      console.error('Error deleting calculation:', error);
      alert('Fout bij het permanent verwijderen van de berekening.');
    }
  };

  if(wipData) {
    return (
      // 3 row layout
      <div className='flex flex-col gap-6 max-w-6xl mx-auto py-12'>

        {/* row 1: project name */}
        <div className='max-w-6xl mx-auto w-full flex justify-between px-6 items-center'>
          <h1 className="card-title font-bold text-txtBold text-2xl">{wipData.wipName}</h1>

          <button
              onClick={handleFinishWIP}
              aria-label="Finish WIP"
              className="px-6 py-3 border border-borderBtn rounded-lg bg-transparent hover:bg-colorBtn hover:text-txtColorBtn text-txtTransBtn text-lg font-semibold shadow transition-all flex items-center gap-2"
            >
              Finish WIP  
            </button>
        </div>
        
        {/* row 2: main content - 2 columns layout */}
        <div className='flex flex-row px-6 gap-8 h-full items-start'>

          {/* left column: image, comments - 2 row layout */}
          <div className='flex flex-col gap-4 flex-1'>

            {/* top row: image*/}
            <div className="card">
              <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
                {(wipData.wipPictureURL && !imageToDelete) || selectedImage ? (
                  <div className="relative w-2/3 mx-auto">
                  <img
                    src={selectedImage || wipData.wipPictureURL}
                    alt={wipData.wipName}
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
                        wipID: wipData?.wipID || 0,
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
          {/* <div className='flex flex-col gap-4 flex-1'> */}
          <div className='card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 space-y-6'>
            <label htmlFor="boardTitle" className="block text-lg font-semibold text-txtDefault">
              Project details
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
              <div className='space-y-4'>
                {/* Input velden voor nieuwe measurements */}
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
                {/* Toon huidige current position als die bestaat */}
                {wipData?.wipCurrentPosition && (
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-txtDefault">{wipData.wipCurrentPosition}</p>
                  </div>
                )}
                <div className='border border-borderCard rounded-lg p-3 bg-bgDefault'>
                  <textarea
                    placeholder='Add notes about your new current position when applicable...'
                    className='w-full text-sm text-txtDefault bg-transparent resize-none border-none focus:outline-none'
                    rows={2}
                    onChange={(e) => setNewCurrentPosition(e.target.value)}
                  />
                </div>
              </div>

              {/* Recent calculations */}
              <div className='mt-8' ref={calculationsRef}>
                <h2 className='font-semibold text-xl text-txtBold mb-4'>Recent Calculations</h2>
                
                {calculationsList.length > 0 ? (
                    <ul className='space-y-3'>
                        {calculationsList.map((calc) => (
                            // *** LIJN TOEVOEGEN: Exacte styling van de Calculator Client ***
                            <li key={calc.id} className="mt-2 inline-flex items-center gap-3 w-full max-w-full rounded-lg border border-borderCard bg-white px-3 py-2 text-xs text-txtDefault transition relative group">
                                <div className="flex-1 pr-10">
                                    <div className="font-semibold text-sm text-txtDefault">{calc.name}</div>
                                    <div className="text-sm text-txtDefault mt-1">{calc.result}</div>
                                    <div className="text-xs text-stone-400 mt-1">{calc.timestamp}</div>
                                </div>

                                <div className="absolute right-2 top-2">
                                    {/* 3-puntjes knop */}
                                    <button 
                                        aria-label="Open calculation actions" 
                                        onClick={(e) => { 
                                            e.preventDefault(); 
                                            e.stopPropagation(); 
                                            setOpenDropdownId(openDropdownId === calc.id ? null : calc.id);
                                        }} 
                                        onMouseDown={(e) => e.preventDefault()} 
                                        className="rounded hover:bg-zinc-100 p-1"
                                    >                        
                                        <span className="text-xl select-none">⋮</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {openDropdownId === calc.id && (
                                        <div data-dropdown-id={calc.id} className="absolute right-0 mt-2 w-44 bg-bgDefault border border-borderCard rounded-lg shadow-sm z-50" onClick={(e) => e.stopPropagation()}>
                                            {/* Remove from WIP Actie */}
                                            <button 
                                                className="w-full text-left text-txtTransBtn px-4 py-2 rounded-t-lg hover:bg-bgHover" 
                                                onClick={() => handleRemoveFromWip(calc.id)} 
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                Remove from WIP
                                            </button>
                                            {/* Delete Actie */}
                                            <button 
                                                className="w-full text-left text-txtSoft px-4 py-2 rounded-b-lg hover:bg-bgHover" 
                                                onClick={() => handleDeleteCalculation(calc.id)} 
                                                onMouseDown={(e) => e.preventDefault()}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className='text-sm text-txtSoft ml-4'>
                        No recent calculations
                    </div>
                )}
            </div>
          </div>
        </div>
        {/* row 3: action buttons */}
          <div className="px-6 mt-8 pb-12 max-w-6xl mx-auto w-full flex justify-between">
            <button
              onClick={handleBack}
              disabled={isSaving}
              className="px-6 py-3 border border-borderBtn rounded-lg bg-transparent hover:bg-colorBtn hover:text-txtColorBtn text-txtTransBtn text-lg font-semibold shadow transition-all flex items-center gap-2"
            >
              Back
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteWIP}
                aria-label="Finish WIP"
                className="px-6 py-3 border border-borderBtn rounded-lg bg-transparent hover:bg-colorBtn hover:text-txtColorBtn text-txtTransBtn text-lg font-semibold shadow transition-all flex items-center gap-2"
              >
                Delete WIP 
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                aria-label="Save project"
                className="px-6 py-3 border border-borderBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn text-txtColorBtn text-lg font-semibold shadow transition-all"
              >
                {isSaving ? "Saving..." : "Save Project"}
              </button>
            </div>
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
                    className="px-6 py-2 bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelBack}
                    className="px-6 py-2 border border-borderBtn bg-transparent text-txtTransBtn rounded-lg hover:bg-bgDefault transition shadow-sm"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Finish Confirmation Modal */}
          {showFinishConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                <h2 className="text-xl font-bold mb-4">Are you sure you want to finish this WIP?</h2>
                <p className="text-sm text-stone-600 mb-6">
                  This will mark the project as completed
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmFinish}
                    className="px-6 py-2 bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelFinish}
                    className="px-6 py-2 border border-borderBtn bg-transparent text-txtTransBtn rounded-lg hover:bg-bgDefault transition shadow-sm"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {/*Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this WIP?</h2>
                <p className="text-sm text-stone-600 mb-6">
                  This action cannot be undone. All data will be permanently deleted.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-2 bg-colorBtn text-txtColorBtn border border-borderBtn rounded-lg shadow-sm hover:bg-white hover:text-txtTransBtn transition"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-6 py-2 border border-borderBtn bg-transparent text-txtTransBtn rounded-lg shadow-sm hover:bg-colorBtn hover:text-txtColorBtn transition"
                  >
                    Cancel
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
}