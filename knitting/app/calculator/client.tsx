"use client";

import { usePathname, useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";
import { WIPS } from "../../src/domain/wips";
import { Calculation } from "../../src/domain/calculation";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

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

export default function CalculatorPage({ user, wipsData, calculationsData }: { user: any, wipsData: WIPS[], calculationsData: Calculation[] }) {
  // Sidebar + saved calculations
  const [isOpen, setIsOpen] = useState(true);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalc[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  //state voor dropdown 
  const [dropdownView, setDropdownView] = useState<"actions" | "wips">("actions");

  //state voor user popup
  const [popupType, setPopupType] = useState<"not-logged-in" | "add-to-wip" | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setPopupType("not-logged-in");
    }
  }, [user]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (listContainerRef.current && !listContainerRef.current.contains(target)) {
        setOpenDropdownId(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdownId(null);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (calculationsData && calculationsData.length > 0) {
      const converted = calculationsData.map(convertToSavedCalc);
      setSavedCalculations(converted);
    }
  }, [calculationsData]);

  const convertToSavedCalc = (calc: Calculation): SavedCalc => {
    // Bepaal het type op basis van de input strings
    let type = calc.calculationName;
    if (calc.calculationInputX.includes("Required amount")) {
      type = "Yarn Amount";
    } else if (calc.calculationInputX.includes("Pattern gauge")) {
      type = "Gauge Swatch";
    } else if (calc.calculationInputX.includes("Edge length")) {
      type = "Picked Stitches";
    }

    // Extraheer input waarden (simplified - je kan dit verfijnen)
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

  const saveCalculation = (type: string, input1: number, input2: number, result: string, name?: string) => {
    const newCalc: SavedCalc = {
      id: Date.now(),
      name: name && name.trim() ? name.trim() : type,
      type,
      input1,
      input2,
      result,
      timestamp: new Date().toLocaleString(),
      wipIDs: null, 
    };
    setSavedCalculations((prev) => [newCalc, ...prev]);
    setOpenDropdownId(null);
  };

  const handleDeleteCalculation = async (id: number) => {
    if (user) {
      // Als ingelogd, verwijder uit database
      try {
        const response = await fetch(`/api/calculations?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete calculation');
        }

        // Verwijder uit lokale state
        setSavedCalculations((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        console.error('Error deleting calculation:', error);
      }
    } else {
      // Als niet ingelogd, alleen lokaal verwijderen
      setSavedCalculations((prev) => prev.filter((c) => c.id !== id));
    }
    setOpenDropdownId(null);
  };

  const handleAddToPattern = (calc: SavedCalc) => {
    if (!user) {
      setPopupType("add-to-wip");
      setOpenDropdownId(null);
      return;
    }
    setDropdownView("wips");
  };

  const handleSelectWIP = async (wip: WIPS, calc: SavedCalc) => {
    try {
      const response = await fetch('/api/calculations', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          calculationID: calc.id,
          wipID: wip.wipID,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add calculation to WIP');
      }

      const updatedCalculation = await response.json();

      setSavedCalculations((prev) => 
        prev.map((c) =>  
          c.id === calc.id 
            ? { 
                ...c, 
                wipIDs: c.wipIDs 
                  ? [...c.wipIDs, wip.wipID].filter((id): id is number => id !== undefined)
                  : [wip.wipID].filter((id): id is number => id !== undefined)
              }
            : c
        )
      );
      
    } catch (error) {
      console.error('Error adding calculation to WIP:', error);
    }
    
    setOpenDropdownId(null);
    setDropdownView("actions");
  };

  const getWipNamesForCalculation = (wipIDs: number[] | null): JSX.Element | null => {
    if (!wipIDs || wipIDs.length === 0) return null; 
    
    const wipNames = wipIDs
      .map(id => wipsData.find(wip => wip.wipID === id)?.wipName)
      .filter(Boolean);
    
    if (wipNames.length === 0) return null;
    
    return (
      <>
        {wipNames.map((name, index) => (
          <div key={index}>{name}</div>
        ))}
      </>
    );
  };

  // --- Calculator state ---
  const [selectedCalculator, setSelectedCalculator] = useState<"yarn" | "gauge" | "stitches">("yarn");

  // Yarn
  const [patternGrams, setPatternGrams] = useState("");
  const [patternLength, setPatternLength] = useState("");
  const [patternWeight, setPatternWeight] = useState("");
  const [yourLength, setYourLength] = useState("");
  const [yourWeight, setYourWeight] = useState("");

  // Gauge
  const [patternGauge, setPatternGauge] = useState("");
  const [yourGauge, setYourGauge] = useState("");
  const [originalStitches, setOriginalStitches] = useState("");

  // Picked stitches
  const [stitchGauge, setStitchGauge] = useState("");
  const [rowGauge, setRowGauge] = useState("");
  const [edgeLength, setEdgeLength] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalResult, setModalResult] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [calculationName, setCalculationName] = useState("");
  const [currentCalculation, setCurrentCalculation] = useState<{
    type: string;
    input1: number;
    input2: number;
    result: string;
  } | null>(null);

  const isValidPositive = (value: string) => {
    const n = Number(value);
    return value !== "" && !isNaN(n) && n > 0;
  };

  const isYarnCalculatorValid = () =>
    isValidPositive(patternGrams) &&
    isValidPositive(patternLength) &&
    isValidPositive(patternWeight) &&
    isValidPositive(yourLength) &&
    isValidPositive(yourWeight);

  const isGaugeCalculatorValid = () => isValidPositive(patternGauge) && isValidPositive(yourGauge) && isValidPositive(originalStitches);

  const isStitchesCalculatorValid = () => isValidPositive(stitchGauge) && isValidPositive(rowGauge) && isValidPositive(edgeLength);

  const getInputClassName = (value: string, isTouched: boolean) => {
    const base = "input input-bordered w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
    if (!isTouched || value === "") return `${base} bg-stone-100`;
    const n = Number(value);
    if (isNaN(n) || n <= 0) return `${base} bg-red-50 border-red-300`;
    return `${base} bg-stone-100`;
  };

  // Calculations
  const calculateYarn = () => {
    if (!isYarnCalculatorValid()) return;
    const metersNeeded = (Number(patternGrams) / Number(patternWeight)) * Number(patternLength);
    const metersPerBall = Number(yourLength);
    const ballsNeeded = Math.ceil(metersNeeded / metersPerBall);
    const totalWeight = (metersNeeded / Number(yourLength)) * Number(yourWeight);
    setModalTitle("Yarn Amount Result");
    setModalResult(`You need ${ballsNeeded} ball(s) of your yarn (approximately ${totalWeight.toFixed(0)} grams total)`);
    setCurrentCalculation({ type: "Yarn Amount", input1: Number(patternGrams), input2: ballsNeeded, result: `${ballsNeeded} balls (${totalWeight.toFixed(0)}g)` });
    setPatternGrams("");
    setPatternLength("");
    setPatternWeight("");
    setYourLength("");
    setYourWeight("");
    setShowModal(true);
  };

  const calculateGauge = () => {
    if (!isGaugeCalculatorValid()) return;
    const adjustedStitches = Math.round((Number(originalStitches) * Number(yourGauge)) / Number(patternGauge));
    setModalTitle("Gauge Swatch Result");
    setModalResult(`You need to cast on ${adjustedStitches} stitches with your gauge`);
    setCurrentCalculation({ type: "Gauge Swatch", input1: Number(patternGauge), input2: Number(yourGauge), result: `${adjustedStitches} stitches` });
    setPatternGauge("");
    setYourGauge("");
    setOriginalStitches("");
    setShowModal(true);
  };

  const calculateStitches = () => {
    if (!isStitchesCalculatorValid()) return;
    const ratio = Number(stitchGauge) / Number(rowGauge);
    const totalStitches = Number(edgeLength) * (Number(rowGauge) / 10) * ratio;
    setModalTitle("Picked Stitches Result");
    setModalResult(`You need to pick up ${totalStitches.toFixed(0)} stitches in total with a pick up ratio of ${ratio.toFixed(2)}`);
    setCurrentCalculation({ type: "Picked Stitches", input1: Number(edgeLength), input2: ratio, result: `${totalStitches.toFixed(0)} stitches (${ratio.toFixed(2)})` });
    setStitchGauge("");
    setRowGauge("");
    setEdgeLength("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (currentCalculation && user) {
      // Bouw de input strings op basis van calculator type
      let inputX = "";
      let inputY = "";

      if (currentCalculation.type === "Yarn Amount") {
        inputX = `Required amount (grams): ${currentCalculation.input1}`;
        inputY = `Number of balls needed: ${currentCalculation.input2}`;
      } else if (currentCalculation.type === "Gauge Swatch") {
        inputX = `Pattern gauge (stitches per 10cm): ${currentCalculation.input1}`;
        inputY = `Your gauge (stitches per 10cm): ${currentCalculation.input2}`;
      } else if (currentCalculation.type === "Picked Stitches") {
        inputX = `Edge length (cm): ${currentCalculation.input1}`;
        inputY = `Pick up ratio: ${currentCalculation.input2}`;
      }

      try {
        const response = await fetch("/api/calculations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            calculationInputX: inputX,
            calculationInputY: inputY,
            calculationOutput: currentCalculation.result,
            calculationName: calculationName || currentCalculation.type,
            userID: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save calculation");
        }

        const savedCalculation = await response.json();
        console.log("Calculation saved to database:", savedCalculation);

        // Converteer de database calculation en voeg toe aan state
        const newSavedCalc = convertToSavedCalc(savedCalculation);
        setSavedCalculations((prev) => [newSavedCalc, ...prev]);
      } catch (error) {
        console.error("Error saving calculation:", error);
      }

      setCalculationName("");
      setShowModal(false);
    } else if (currentCalculation && !user) {
      // Als niet ingelogd, alleen lokaal opslaan
      saveCalculation(
        currentCalculation.type,
        currentCalculation.input1,
        currentCalculation.input2,
        currentCalculation.result,
        calculationName
      );
      setCalculationName("");
      setShowModal(false);
    }
  };

  const handleClose = () => {
    setCalculationName("");
    setShowModal(false);
    setCurrentCalculation(null);
  };

  const handleClearAll = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/calculations?all=true&userID=${user.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete all calculations from database');
        }

        setSavedCalculations([]);
      } catch (error) {
        console.error('Error deleting all calculations:', error);
      }
    } else {
      setSavedCalculations([]);
    }
    setOpenDropdownId(null);
  };

  return (
    <div className="flex relative">
      {/* Toggle button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute top-6 z-40 bg-bgSidebar p-2 rounded-l-lg hover:bg-stone-200 transition-all duration-300
                ${isOpen ? "right-[calc(20%-0rem)]" : "right-0"}`}
      >
        {isOpen ? (
          <ChevronRightIcon className="w-6 h-6 text-txtDefault" />
        ) : (
          <ChevronLeftIcon className="w-6 h-6 text-txtDefault" />
        )}
      </button>

      {/* Main content area */}
      <div className="flex-1 grow p-6 md:p-12 bg-bgDefault min-h-screen">
        <div className="flex flex-col items-center space-y-8">
          <div className="w-4/5">
            <label className="block text-sm font-medium text-txtDefault mb-2">Select Calculator</label>
            <select className="select select-bordered w-full bg-white" value={selectedCalculator} onChange={(e) => setSelectedCalculator(e.target.value as any)}>
              <option value="yarn">Yarn Amount Calculator</option>
              <option value="gauge">Gauge Swatch Calculator</option>
              <option value="stitches">Picked Stitches Calculator</option>
            </select>
          </div>

          {/* YARN */}
          {selectedCalculator === "yarn" && (
            <div className="card w-4/5 relative">
              <div className="flex items-center gap-4 py-2">
                <h1 className="card-title font-bold text-txtBold text-2xl">Yarn Amount Calculator</h1>
              </div>
              <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8">
                <div className="mb-6">
                  <h3 className="font-bold text-txtBold italic mb-3">Pattern Yarn Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-txtDefault mb-1">Required amount (grams)</label>
                      <input type="number" value={patternGrams} onChange={(e) => setPatternGrams(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(patternGrams, patternGrams !== "")}`} placeholder="e.g., 500" />
                      {patternGrams !== "" && Number(patternGrams) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-txtDefault mb-1">Length per ball (meters)</label>
                      <input type="number" value={patternLength} onChange={(e) => setPatternLength(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(patternLength, patternLength !== "")}`} placeholder="e.g., 200" />
                      {patternLength !== "" && Number(patternLength) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-txtDefault mb-1">Weight per ball (grams)</label>
                      <input type="number" value={patternWeight} onChange={(e) => setPatternWeight(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(patternWeight, patternWeight !== "")}`} placeholder="e.g., 100" />
                      {patternWeight !== "" && Number(patternWeight) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-txtBold italic mb-3">Your Yarn Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-txtDefault mb-1">Length per ball (meters)</label>
                      <input type="number" value={yourLength} onChange={(e) => setYourLength(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(yourLength, yourLength !== "")}`} placeholder="e.g., 150" />
                      {yourLength !== "" && Number(yourLength) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-txtDefault mb-1">Weight per ball (grams)</label>
                      <input type="number" value={yourWeight} onChange={(e) => setYourWeight(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(yourWeight, yourWeight !== "")}`} placeholder="e.g., 50" />
                      {yourWeight !== "" && Number(yourWeight) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={calculateYarn} className="border border-borderBtn text-txtColorBtn px-4 py-2 rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isYarnCalculatorValid()}>
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GAUGE */}
          {selectedCalculator === "gauge" && (
            <div className="card w-4/5 relative">
              <div className="flex items-center gap-4 py-2">
                <h1 className="card-title font-bold text-txtBold text-2xl">Gauge Swatch Calculator</h1>
              </div>
              <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-txtDefault mb-1">Pattern gauge (stitches per 10cm)</label>
                    <input type="number" value={patternGauge} onChange={(e) => setPatternGauge(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(patternGauge, patternGauge !== "")}`} placeholder="e.g., 20" />
                    {patternGauge !== "" && Number(patternGauge) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txtDefault mb-1">Your gauge (stitches per 10cm)</label>
                    <input type="number" value={yourGauge} onChange={(e) => setYourGauge(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(yourGauge, yourGauge !== "")}`} placeholder="e.g., 22" />
                    {yourGauge !== "" && Number(yourGauge) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txtDefault mb-1">Original cast on stitches</label>
                    <input type="number" value={originalStitches} onChange={(e) => setOriginalStitches(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(originalStitches, originalStitches !== "")}`} placeholder="e.g., 100" />
                    {originalStitches !== "" && Number(originalStitches) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={calculateGauge} className="border border-borderBtn text-txtColorBtn px-4 py-2 rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isGaugeCalculatorValid()}>
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PICKED STITCHES */}
          {selectedCalculator === "stitches" && (
            <div className="card w-4/5 relative">
              <div className="flex items-center gap-4 py-2">
                <h1 className="card-title font-bold text-txtBold text-2xl">Picked Stitches Calculator</h1>
              </div>
              <div className="card-body border border-borderCard bg-white rounded-lg py-6 px-8">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-txtDefault mb-1">Stitch gauge (stitches per 10cm)</label>
                    <input type="number" value={stitchGauge} onChange={(e) => setStitchGauge(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(stitchGauge, stitchGauge !== "")}`} placeholder="e.g., 18" />
                    {stitchGauge !== "" && Number(stitchGauge) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txtDefault mb-1">Row gauge (rows per 10cm)</label>
                    <input type="number" value={rowGauge} onChange={(e) => setRowGauge(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(rowGauge, rowGauge !== "")}`} placeholder="e.g., 22" />
                    {rowGauge !== "" && Number(rowGauge) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-txtDefault mb-1">Edge length (cm)</label>
                    <input type="number" value={edgeLength} onChange={(e) => setEdgeLength(e.target.value)} className={`rounded-lg placeholder:p-2 ${getInputClassName(edgeLength, edgeLength !== "")}`} placeholder="e.g., 40" />
                    {edgeLength !== "" && Number(edgeLength) <= 0 && <p className="text-txtLogo text-xs mt-1">Must be greater than 0</p>}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={calculateStitches} className="border border-borderBtn text-txtColorBtn px-4 py-2 rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={!isStitchesCalculatorValid()}>
                    Calculate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose} />
              <div className="relative bg-bgDefault rounded-lg shadow-sm p-6 mx-4 w-full max-w-md z-10 border border-borderCard">
                <h2 className="font-semibold text-2xl text-txtBold mb-2">{modalTitle}</h2>
                <p className="p-2 text-lg text-center bg-white rounded-lg text-txtDefault mb-3">{modalResult}</p>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold text-txtBold">Give this calculation a name (optional)</span>
                  </label>
                  <input type="text" value={calculationName} onChange={(e) => setCalculationName(e.target.value)} placeholder="e.g., Sweater front panel" className="input input-bordered w-full bg-white rounded-lg placeholder:p-2 placeholder:text-txtHint" />
                </div>

                <div className="flex gap-2 mt-6 justify-end">
                  <button className="border border-orange-700 text-orange-700 px-4 py-2 rounded-lg bg-transparent hover:bg-orange-700 hover:text-orange-100 transition" onClick={handleClose}>Close</button>
                  <button className="border border-orange-700 text-orange-100 px-4 py-2 rounded-lg bg-orange-700 hover:bg-transparent hover:text-orange-700 transition" onClick={handleSave}>Save</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Toggleable */}
      {isOpen && (
        <aside className="w-1/5 px-8 py-8 bg-bgSidebar bg-[url('/background.svg')] flex flex-col h-screen overflow-hidden">
          <div className="mb-4 border-b border-stone-300 pb-4">
            <h2 className="font-bold text-txtBold text-2xl">Saved Calculations</h2>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 mb-4" ref={listContainerRef} onClick={(e) => {if (!(e.target as HTMLElement).closest('[data-dropdown-id]') && !(e.target as HTMLElement).closest('button[aria-label="Open calculation actions"]')) {setOpenDropdownId(null);setDropdownView("actions");}}}>
            {savedCalculations.length > 0 ? (
              <ul className="space-y-3">
                {savedCalculations.map((calc) => (
                  <li key={calc.id} className="mt-2 inline-flex items-center gap-3 w-full max-w-full rounded-lg border border-borderCard bg-white px-3 py-2 text-xs text-txtDefault transition relative group">
                    <div className="flex-1 pr-10">
                      <div className="font-semibold text-sm text-txtDefault">{calc.name}</div>
                      <div className="text-sm text-txtDefault mt-1">{calc.result}</div>
                      <div className="text-xs text-stone-400 mt-1">{calc.timestamp}</div>
                      {calc.wipIDs && calc.wipIDs.length > 0 && (
                        <div className="text-xs text-stone-400 mt-1">
                          WIPs: {getWipNamesForCalculation(calc.wipIDs)}
                        </div>
                      )}
                    </div>

                    <div className="absolute right-2 top-2">
                      <button aria-label="Open calculation actions" onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          if (openDropdownId === calc.id) {
                            setOpenDropdownId(null);
                            setDropdownView("actions"); 
                          } else {
                            setOpenDropdownId(calc.id);
                            setDropdownView("actions"); 
                          }
                        }} onMouseDown={(e) => e.preventDefault()} className="rounded hover:bg-zinc-100 p-1">                        
                        <span className="text-xl select-none">⋮</span>
                      </button>

                      {openDropdownId === calc.id && (
                        <div data-dropdown-id={calc.id} className="absolute right-0 mt-2 w-44 bg-bgDefault border border-borderCard rounded-lg shadow-sm z-50" onClick={(e) => e.stopPropagation()}>
                          {dropdownView === "actions" ? (
                            <>
                              <button className="w-full text-left text-txtTransBtn px-4 py-2 rounded-t-lg hover:bg-bgHover" onClick={() => handleAddToPattern(calc)} onMouseDown={(e) => e.preventDefault()}>Add to WIP</button>
                              <button className="w-full text-left text-txtSoft px-4 py-2 rounded-b-lg hover:bg-bgHover" onClick={() => handleDeleteCalculation(calc.id)} onMouseDown={(e) => e.preventDefault()}>Delete</button>
                            </>
                          ) : (
                            <>
                              {/* WIP Lijst */}
                              {wipsData && wipsData.length > 0 ? (
                                wipsData.map((wip) => (
                                  <button
                                    key={wip.wipID}
                                    className="w-full text-left text-txtSoft px-4 py-2 hover:bg-bgHover truncate"
                                    onClick={() => handleSelectWIP(wip, calc)}
                                    onMouseDown={(e) => e.preventDefault()}
                                  >
                                    {wip.wipName}
                                  </button>
                                ))
                              ) : (
                                <div className="text-txtSoft px-4 py-2 text-sm italic">No active WIPs found.</div>
                              )}
                            </>
                          )}

                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-stone-400 text-sm">No saved calculations yet</p>
            )}
          </div>

          {savedCalculations.length > 0 && (
            <div className="pt-4 border-t border-stone-300">
              <button onClick={handleClearAll} className="w-full border border-orange-700 text-orange-700 px-4 py-2 rounded-lg bg-transparent hover:bg-orange-700 hover:text-orange-100 transition">Clear All</button>
            </div>
          )}
        </aside>
      )}

      {/* Popup overlay */}
      {popupType && !user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-bgDefault rounded-lg p-8 max-w-md mx-4 shadow-sm border border-borderCard">
            {popupType === "not-logged-in" ? (
              <>
                <h2 className="text-2xl font-bold text-txtBold mb-2">Not Logged In</h2>
                <p className="text-txtDefault mb-6">
                  You are not logged in. Your saved calculations will be lost when you leave this page.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                    className="w-full px-4 py-2 border border-borderBtn bg-colorBtn text-txtColorBtn rounded-lg hover:bg-transparent hover:text-txtTransBtn transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setPopupType(null)}
                    className="text-sm text-txtSoft underline hover:text-txtTransBtn"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-txtBold mb-2">Login Required</h2>
                <p className="text-txtDefault mb-6">
                  You need to be logged in to add calculations to a WIP.
                </p>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
                    className="w-full px-4 py-2 border border-borderBtn bg-colorBtn text-txtColorBtn rounded-lg hover:bg-transparent hover:text-txtTransBtn transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setPopupType(null)}
                    className="text-sm text-txtSoft underline hover:text-txtTransBtn"
                  >
                    Continue
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>

  );
}