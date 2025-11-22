"use client";

import { useState, useRef } from 'react';
import { WIPDetails } from '../../../src/domain/wipDetails';
import { Comment } from '../../../src/domain/comment';

export default function Wip({user, wipData, comments }: { user: any, wipData: WIPDetails | null , comments: Comment[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [needles, setNeedles] = useState<string[]>(wipData?.needles?.map(n => `${n.needleSize}mm - ${n.needlePart}`) || []);
  const [yarns, setYarns] = useState<string[]>(wipData?.yarns?.map(y => `${y.yarnName} by ${y.yarnProducer}`) || []);
  const [gaugeSwatches, setGaugeSwatches] = useState<string[]>(wipData?.gaugeSwatches?.map(g => g.gaugeDescription ? `${g.gaugeStitches} stitches x ${g.gaugeRows} rows - ${g.gaugeDescription}`: `${g.gaugeStitches} stitches x ${g.gaugeRows} rows`) || []);  
  const [sizes, setSizes] = useState<string[]>(wipData?.wipSize ? [wipData.wipSize] : []);
  const [extraMaterials, setExtraMaterials] = useState<string[]>(wipData?.extraMaterials?.map(m => m.extraMaterialsDescription) || []);
  const [commentsList, setCommentsList] = useState<Comment[]>(comments || []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    'needle' | 'yarn' | 'gauge' | 'size' | 'material' | null
  >(null);
  const [modalValue, setModalValue] = useState('');

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
  const handleSave = () => {
    // Functionaliteit komt later
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
        const [sizeInput, partInput] = modalValue.split(' - ').map(s => s.trim());
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
          
          // Update lokale state
          setNeedles((prev) => [...prev, value]);
        } catch (error) {
          console.error("Error saving needle:", error);
          alert("Failed to save needle. Please try again.");
        }
        break;
      case 'yarn':
        const [yarnName, yarnProducer] = modalValue.split(' - ').map(s => s.trim());
  
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
          setYarns((prev) => [...prev, `${yarnName} by ${yarnProducer}`]);
        } catch (error) {
          console.error("Error saving yarn:", error);
          alert("Failed to save yarn. Please try again.");
        }
        break;
      case 'gauge':
        const gaugeParts = modalValue.split(' - ').map(s => s.trim());
        const stitches = gaugeParts[0];
        const rows = gaugeParts[1];
        const description = gaugeParts[2] || '';
        
        if (!stitches || !rows) return;
        
        try {
          const response = await fetch('/api/gaugeSwatches', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gaugeStitches: parseInt(stitches),
              gaugeRows: parseInt(rows),
              gaugeDescription: description,
              wipID: wipData?.wipID,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save gauge swatch');
          }

          const newGauge = await response.json();
          const displayText = description 
            ? `${stitches} stitches x ${rows} rows - ${description}`
            : `${stitches} stitches x ${rows} rows`;
          setGaugeSwatches((prev) => [...prev, displayText]);
        } catch (error) {
          console.error("Error saving gauge swatch:", error);
          alert("Failed to save gauge swatch. Please try again.");
        }
        break;
      case 'size':
        if (sizes.length >= 1) return; // Prevent adding more than 1
  
        try {
          const response = await fetch(`/api/wips/${wipData?.wipID}/size`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              wipSize: value,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save size');
          }

          setSizes([value]);
        } catch (error) {
          console.error("Error saving size:", error);
          alert("Failed to save size. Please try again.");
        }
        break;
      case 'material':
        try {
          const response = await fetch('/api/extraMaterials', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              extraMaterialsDescription: value,
              wipID: wipData?.wipID,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save extra material');
          }

          const newMaterial = await response.json();
          setExtraMaterials((prev) => [...prev, value]);
        } catch (error) {
          console.error("Error saving extra material:", error);
          alert("Failed to save extra material. Please try again.");
        }
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
    const needle = wipData?.needles?.[index];
    if (!needle?.needleID) return;

    try {
      const response = await fetch(`/api/needles/${needle.needleID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete needle');
      }

      setNeedles((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting needle:", error);
      alert("Failed to delete needle. Please try again.");
    }
  };
  const removeYarn = async (index: number) => {
    const yarn = wipData?.yarns?.[index];
    if (!yarn?.yarnID) return;

    try {
      const response = await fetch(`/api/yarns/${yarn.yarnID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete yarn');
      }

      setYarns((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting yarn:", error);
      alert("Failed to delete yarn. Please try again.");
    }
  };
  const removeSize = async (index: number) => {
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

      setSizes([]);
    } catch (error) {
      console.error("Error removing size:", error);
      alert("Failed to remove size. Please try again.");
    }
  };
  const removeMaterial = async (index: number) => {
    const material = wipData?.extraMaterials?.[index];
    if (!material?.extraMaterialsID) return;

    try {
      const response = await fetch(`/api/extraMaterials/${material.extraMaterialsID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete extra material');
      }

      setExtraMaterials((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting extra material:", error);
      alert("Failed to delete extra material. Please try again.");
    }
  };
  const removeGaugeSwatch = async (index: number) => {
    const gauge = wipData?.gaugeSwatches?.[index];
    if (!gauge?.gaugeID) return;

    try {
      const response = await fetch(`/api/gaugeSwatches/${gauge.gaugeID}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete gauge swatch');
      }

      setGaugeSwatches((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting gauge swatch:", error);
      alert("Failed to delete gauge swatch. Please try again.");
    }
  };

  if(wipData) {
    return (
      <div className='flex flex-row p-8 gap-6 h-full items-start'>
        <div className='flex flex-col gap-4 flex-1'>
          <div className="card">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">{wipData.wipName}</h1>
            </div>

            <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
              <img
                src={wipData.wipPictureURL}
                alt={wipData.wipName}
                className = "w-2/3 h-auto mx-auto object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4 py-2">
              <h1 className="card-title font-bold text-txtBold text-2xl">Comments</h1>
            </div>

            <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 flex flex-col gap-6">
              {/* Toon bestaande comments */}
              {commentsList.length > 0 && (
                <div className="space-y-2">
                  {commentsList.map((comment) => (
                    <div key={comment.commentID} className="flex items-center justify-between gap-2">
                      <p className="text-sm text-txtDefault">{comment.commentContent}</p>
                      <button
                        onClick={() => {/* delete handler komt later */}}
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
              )}
              <div className="space-y-2">
                <input
                  id="boardTitle"
                  type="text"
                  placeholder="Add some comments here"
                  className="w-full px-4 py-3 border-2 border-borderCard rounded-lg text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 flex-1'>
          <h1 className='card-title font-bold text-txtBold text-2xl'>Project details</h1>
          <div className='card-body border border-borderCard bg-white rounded-lg py-6 px-8 flex-1 space-y-6'>

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
              <div className='border border-borderCard rounded-lg p-3 bg-bgDefault'>
                <textarea
                  placeholder='Add notes about your current position...'
                  className='w-full text-sm text-txtDefault bg-transparent resize-none border-none focus:outline-none'
                  rows={3}
                />
              </div>
            </div>

            {/* Recent calculations */}
            <div className='space-y-2'>
              <h3 className='font-semibold text-txtDefault'>Recent calculations</h3>
              <div className='text-sm text-txtSoft ml-4'>
                No recent calculations
              </div>
            </div>
          </div>
            {/* Save Button placed under project details (not fixed) */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              aria-label="Save project"
              className="px-6 py-3 border border-borderBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn text-txtColorBtn text-lg font-semibold shadow transition-all"
            >
              Save Project
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
                      const part = e.target.value;
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
      </div>

      
    );
  }
  
}