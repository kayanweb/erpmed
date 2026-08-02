import React, { useState, useRef, useEffect } from "react";
import { 
  X, ZoomIn, ZoomOut, RotateCw, FlipHorizontal, FlipVertical, Sliders, 
  Ruler, Eye, Sun, Maximize2, Play, Pause, Grid, Layers, Move, Contrast,
  Activity, ArrowRight, Download, Share2, Tag, ShieldCheck, Box, RefreshCw
} from "lucide-react";
import { RadiologyStudy } from "../../types/radiology";
import { toast } from "sonner";

interface PacsViewerProps {
  study: RadiologyStudy;
  isAr: boolean;
  onClose: () => void;
  onLaunchReporting?: () => void;
}

export const PacsViewerModal: React.FC<PacsViewerProps> = ({
  study,
  isAr,
  onClose,
  onLaunchReporting
}) => {
  // Viewer state
  const [activeLayout, setActiveLayout] = useState<"1x1" | "2x1" | "2x2" | "mpr">("1x1");
  const [currentSeries, setCurrentSeries] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(1);
  const totalFrames = study.instanceCount || 120;

  // Window / Level Presets
  const [windowPreset, setWindowPreset] = useState<"SoftTissue" | "Lung" | "Bone" | "Brain" | "Angio" | "Abdomen">("SoftTissue");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isInverted, setIsInverted] = useState(false);

  // Geometry
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Tools
  const [activeTool, setActiveTool] = useState<"pan" | "ruler" | "roi" | "angle" | "magnify" | "none">("pan");
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null);

  // Cine Playback
  const [isPlayingCine, setIsPlayingCine] = useState(false);
  const [fps, setFps] = useState(15);

  // Metadata Panel
  const [showMetadata, setShowMetadata] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cine playback loop
  useEffect(() => {
    let interval: any = null;
    if (isPlayingCine) {
      interval = setInterval(() => {
        setCurrentFrame(prev => (prev % totalFrames) + 1);
      }, 1000 / fps);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingCine, fps, totalFrames]);

  // Apply Window/Level Presets
  const handlePresetChange = (preset: "SoftTissue" | "Lung" | "Bone" | "Brain" | "Angio" | "Abdomen") => {
    setWindowPreset(preset);
    switch (preset) {
      case "SoftTissue":
        setBrightness(100);
        setContrast(110);
        break;
      case "Lung":
        setBrightness(130);
        setContrast(180);
        break;
      case "Bone":
        setBrightness(90);
        setContrast(220);
        break;
      case "Brain":
        setBrightness(105);
        setContrast(140);
        break;
      case "Angio":
        setBrightness(120);
        setContrast(200);
        break;
      case "Abdomen":
        setBrightness(100);
        setContrast(125);
        break;
    }
  };

  // Render Medical Image Canvas Frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
    ctx.scale(zoom * (flipH ? -1 : 1), zoom * (flipV ? -1 : 1));
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw simulated medical DICOM cross-section
    const size = Math.min(canvas.width, canvas.height) * 0.7;
    const isLungOrCT = study.modality === "CT";
    const isMRI = study.modality === "MRI";

    // Draw base anatomical slice simulation
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);
    
    // Gradient simulating tissue contrast
    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, size / 2);
    if (isInverted) {
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.5, "#cbd5e1");
      grad.addColorStop(1, "#020617");
    } else {
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.4, isMRI ? "#334155" : "#1e293b");
      grad.addColorStop(0.7, isLungOrCT ? "#475569" : "#334155");
      grad.addColorStop(0.9, "#94a3b8");
      grad.addColorStop(1, "#0f172a");
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Internal organs / bone structure simulation lines
    ctx.strokeStyle = isInverted ? "#020617" : "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Internal detail rings (simulating slice frame features)
    const frameOffset = (currentFrame % 20) * 1.5;
    ctx.beginPath();
    ctx.ellipse(0, -10 + frameOffset, size * 0.25, size * 0.18, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = isInverted ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(-size * 0.2, 0, size * 0.15, size * 0.2, 0.2, 0, 2 * Math.PI);
    ctx.ellipse(size * 0.2, 0, size * 0.15, size * 0.2, -0.2, 0, 2 * Math.PI);
    ctx.strokeStyle = isInverted ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)";
    ctx.stroke();

    ctx.restore();

    // Render active drawing measurement
    if (drawStart && drawCurrent) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(drawStart.x, drawStart.y);
      ctx.lineTo(drawCurrent.x, drawCurrent.y);
      ctx.stroke();

      const dx = drawCurrent.x - drawStart.x;
      const dy = drawCurrent.y - drawStart.y;
      const lengthMm = (Math.sqrt(dx * dx + dy * dy) * 0.45).toFixed(1);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(`${lengthMm} mm`, drawCurrent.x + 8, drawCurrent.y - 8);
    }

    // Render saved measurements
    measurements.forEach((m, idx) => {
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(m.x1, m.y1);
      ctx.lineTo(m.x2, m.y2);
      ctx.stroke();

      ctx.fillStyle = "#f59e0b";
      ctx.font = "bold 11px monospace";
      ctx.fillText(`#${idx + 1}: ${m.val}`, m.x2 + 6, m.y2 - 6);
    });

  }, [currentFrame, zoom, rotation, flipH, flipV, pan, isInverted, windowPreset, brightness, contrast, drawStart, drawCurrent, measurements, study]);

  // Canvas Mouse Events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "ruler" || activeTool === "angle" || activeTool === "roi") {
      setIsDrawing(true);
      setDrawStart({ x, y });
      setDrawCurrent({ x, y });
    } else if (activeTool === "pan") {
      setIsDrawing(true);
      setDrawStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (activeTool === "ruler" || activeTool === "angle" || activeTool === "roi") {
      setDrawCurrent({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    } else if (activeTool === "pan" && drawStart) {
      setPan({
        x: e.clientX - drawStart.x,
        y: e.clientY - drawStart.y
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if ((activeTool === "ruler" || activeTool === "roi") && drawStart && drawCurrent) {
      const dx = drawCurrent.x - drawStart.x;
      const dy = drawCurrent.y - drawStart.y;
      const lengthMm = (Math.sqrt(dx * dx + dy * dy) * 0.45).toFixed(1);
      const huValue = Math.floor(Math.random() * 80) + 10; // Hounsfield units
      
      setMeasurements(prev => [
        ...prev,
        {
          x1: drawStart.x,
          y1: drawStart.y,
          x2: drawCurrent.x,
          y2: drawCurrent.y,
          val: activeTool === "roi" ? `Area: ${(Number(lengthMm) * 3.14).toFixed(1)} mm² (Mean HU: ${huValue})` : `${lengthMm} mm`
        }
      ]);
      toast.success(isAr ? "تم تسجيل القياس في دراسة الصور" : "Measurement logged to DICOM overlay");
    }
    setDrawStart(null);
    setDrawCurrent(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 text-slate-100 flex flex-col font-sans backdrop-blur-md animate-in fade-in duration-200">
      {/* Top DICOM Header Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold">
            <Box className="w-5 h-5" />
            <span>PACS WEB VIEWER v4.2</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-3">
            <span className="font-bold text-white text-sm">{study.patientName}</span>
            <span className="text-slate-400">MRN: {study.mrn}</span>
            <span className="px-2 py-0.5 bg-blue-900/60 text-blue-300 border border-blue-700/50 rounded font-mono font-bold">
              {study.modality}
            </span>
            <span className="text-slate-400">{study.procedureName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLaunchReporting && (
            <button 
              onClick={onLaunchReporting}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all text-xs"
            >
              <Activity className="w-4 h-4" />
              {isAr ? "كتابة التقرير التشخيصي" : "Open Diagnostic Reporter"}
            </button>
          )}

          <button 
            onClick={() => setShowMetadata(!showMetadata)}
            className={`p-2 rounded-lg border transition-all ${showMetadata ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
            title="DICOM Header Metadata"
          >
            <Tag className="w-4 h-4" />
          </button>

          <button 
            onClick={onClose}
            className="p-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main PACS Workstation Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar Controls */}
        <div className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 gap-2 overflow-y-auto">
          {/* Layout Selectors */}
          <div className="w-full px-2 flex flex-col gap-1 pb-2 border-b border-slate-800">
            <button 
              onClick={() => setActiveLayout("1x1")}
              className={`p-2 rounded flex flex-col items-center text-[9px] font-bold ${activeLayout === '1x1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              title="1x1 Full Screen"
            >
              <Grid className="w-4 h-4" /> 1x1
            </button>
            <button 
              onClick={() => setActiveLayout("2x1")}
              className={`p-2 rounded flex flex-col items-center text-[9px] font-bold ${activeLayout === '2x1' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              title="Dual Compare Mode"
            >
              <Layers className="w-4 h-4" /> 2x1
            </button>
            <button 
              onClick={() => setActiveLayout("mpr")}
              className={`p-2 rounded flex flex-col items-center text-[9px] font-bold ${activeLayout === 'mpr' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              title="MPR (Axial/Coronal/Sagittal)"
            >
              <Box className="w-4 h-4" /> MPR
            </button>
          </div>

          {/* Tools */}
          <div className="w-full px-2 flex flex-col gap-1 pb-2 border-b border-slate-800">
            <button 
              onClick={() => setActiveTool("pan")}
              className={`p-2 rounded text-slate-300 ${activeTool === 'pan' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
              title="Pan / Drag"
            >
              <Move className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTool("ruler")}
              className={`p-2 rounded text-slate-300 ${activeTool === 'ruler' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
              title="Distance Measurement (mm)"
            >
              <Ruler className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTool("roi")}
              className={`p-2 rounded text-slate-300 ${activeTool === 'roi' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
              title="ROI Area & HU Units"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Geometry Manipulations */}
          <div className="w-full px-2 flex flex-col gap-1 pb-2 border-b border-slate-800">
            <button 
              onClick={() => setZoom(z => Math.min(z + 0.25, 4))}
              className="p-2 rounded text-slate-300 hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
              className="p-2 rounded text-slate-300 hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="p-2 rounded text-slate-300 hover:bg-slate-800"
              title="Rotate 90° Clockwise"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setFlipH(f => !f)}
              className={`p-2 rounded text-slate-300 ${flipH ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsInverted(i => !i)}
              className={`p-2 rounded text-slate-300 ${isInverted ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
              title="Invert Colors"
            >
              <Contrast className="w-4 h-4" />
            </button>
          </div>

          {/* Reset */}
          <button 
            onClick={() => {
              setZoom(1);
              setRotation(0);
              setFlipH(false);
              setFlipV(false);
              setPan({ x: 0, y: 0 });
              setMeasurements([]);
              setIsInverted(false);
              setWindowPreset("SoftTissue");
            }}
            className="p-2 rounded text-slate-400 hover:bg-slate-800"
            title="Reset All View Transforms"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Center DICOM Canvas Viewport */}
        <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          {/* Window / Level Preset Bar */}
          <div className="h-10 bg-slate-900/80 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">W/L Preset:</span>
              {(["SoftTissue", "Lung", "Bone", "Brain", "Angio", "Abdomen"] as const).map(p => (
                <button 
                  key={p}
                  onClick={() => handlePresetChange(p)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${windowPreset === p ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
              <span>Slice: {currentFrame} / {totalFrames}</span>
              <span>Series: {currentSeries}</span>
            </div>
          </div>

          {/* Display Viewport Canvas */}
          <div className="flex-1 flex items-center justify-center relative p-2">
            <canvas 
              ref={canvasRef}
              width={720}
              height={560}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%)`
              }}
              className="bg-slate-950 border border-slate-800 shadow-2xl cursor-crosshair rounded-lg"
            />

            {/* Viewport Overlay Info Text (Top Left & Top Right) */}
            <div className="absolute top-4 left-6 pointer-events-none text-[11px] font-mono text-emerald-400 space-y-0.5 bg-slate-950/60 p-2 rounded border border-slate-800/50">
              <div>PATIENT: {study.patientName}</div>
              <div>AGE/SEX: {study.patientAge}Y / {study.patientGender}</div>
              <div>ACC: {study.id}</div>
              <div>MODALITY: {study.modality}</div>
            </div>

            <div className="absolute top-4 right-6 pointer-events-none text-[11px] font-mono text-emerald-400 space-y-0.5 text-right bg-slate-950/60 p-2 rounded border border-slate-800/50">
              <div>INST: {study.dicomAeTitle || "PACS_SERVER"}</div>
              <div>BODY: {study.bodyPart}</div>
              <div>KVp: 120 / mA: 250</div>
              <div>SLICE THICKNESS: 1.25 mm</div>
            </div>

            {/* Bottom Controls - Cine Player & Frame Slider */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-2xl flex items-center gap-4 shadow-xl backdrop-blur-md">
              <button 
                onClick={() => setIsPlayingCine(!isPlayingCine)}
                className={`p-2 rounded-xl text-white font-bold transition-all ${isPlayingCine ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'}`}
              >
                {isPlayingCine ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">FRAME</span>
                <input 
                  type="range"
                  min={1}
                  max={totalFrames}
                  value={currentFrame}
                  onChange={e => setCurrentFrame(Number(e.target.value))}
                  className="w-48 accent-blue-500 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-white w-12">{currentFrame}/{totalFrames}</span>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
                <span className="text-[10px] font-bold text-slate-400">FPS</span>
                <input 
                  type="number"
                  min={1}
                  max={60}
                  value={fps}
                  onChange={e => setFps(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-center text-xs font-bold text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Metadata / DICOM Inspector Panel */}
        {showMetadata && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto space-y-4 text-xs animate-in slide-in-from-right duration-200">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Tag className="w-4 h-4 text-blue-400" />
              DICOM 3.0 Header Tags
            </h3>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500">(0008,0020) Study Date</div>
                <div className="text-slate-200 font-bold">{study.orderDate.split('T')[0]}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500">(0008,0050) Accession Number</div>
                <div className="text-blue-400 font-bold">{study.id}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500">(0010,0010) Patient Name</div>
                <div className="text-slate-200 font-bold">{study.patientName}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500">(0010,0020) Patient ID (MRN)</div>
                <div className="text-slate-200 font-bold">{study.mrn}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500">(0020,000D) Study Instance UID</div>
                <div className="text-slate-400 text-[9px] break-all">{study.studyInstanceUid}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500">(0018,0015) Body Part Examined</div>
                <div className="text-slate-200 font-bold">{study.bodyPart}</div>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <div className="text-slate-500">(0018,1151) Exposure Dose (DLP)</div>
                <div className="text-amber-400 font-bold">{study.doseDlpMgyCm || 0} mGy·cm</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
