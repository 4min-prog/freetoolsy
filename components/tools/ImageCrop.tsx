"use client";

import { exceedsCanvasLimit, MAX_CANVAS_PIXELS } from "@/lib/canvasLimit";
import { faArrowRotateLeft, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type CropBox = { x: number; y: number; width: number; height: number };
type Transform = { rotation: 0 | 90 | 180 | 270; flipH: boolean; flipV: boolean };
type ExportFormat = "image/png" | "image/jpeg" | "image/webp";
type InteractionMode = "select" | "pan";
type RatioValue =
  | "free"
  | "1:1"
  | "4:5"
  | "9:16"
  | "16:9"
  | "4:3"
  | "3:2"
  | "1.91:1"
  | "2.63:1"
  | "4:1";
type CropSnapshot = {
  crop: CropBox | null;
  panOffset: { x: number; y: number };
  transform: Transform;
  ratioValue: RatioValue;
};
type PersistedEditorState = {
  source: string;
  sourceName: string;
  crop: CropBox | null;
  transform: Transform;
  ratioValue: RatioValue;
  zoom: number;
  format: ExportFormat;
  quality: number;
  panOffset: { x: number; y: number };
  interactionMode: InteractionMode;
  exportUrl: string;
};
type ResizeHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

const RATIOS = [
  { value: "free", label: "ratioFree", ratio: null },
  { value: "1:1", label: "ratioSquare", ratio: 1 },
  { value: "4:5", label: "ratioPortrait", ratio: 4 / 5 },
  { value: "9:16", label: "ratioStory", ratio: 9 / 16 },
  { value: "16:9", label: "ratioLandscape", ratio: 16 / 9 },
  { value: "4:3", label: "ratioClassic", ratio: 4 / 3 },
  { value: "3:2", label: "ratioPhoto", ratio: 3 / 2 },
  { value: "1.91:1", label: "ratioLinkPreview", ratio: 1.91 },
  { value: "2.63:1", label: "ratioFacebookCover", ratio: 2.63 },
  { value: "4:1", label: "ratioLinkedinCover", ratio: 4 },
] as const;
const RESIZE_HANDLES: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

const FORMATS: { value: ExportFormat; extension: string; label: string }[] = [
  { value: "image/png", extension: "png", label: "PNG" },
  { value: "image/jpeg", extension: "jpg", label: "JPEG" },
  { value: "image/webp", extension: "webp", label: "WebP" },
];
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2;
const INITIAL_ZOOM = 0.5;

const buttonClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:border-accent hover:text-accent disabled:opacity-50";

const PERSISTENCE_DB = "freetoolsy-image-crop";
const PERSISTENCE_STORE = "editor";
const PERSISTENCE_KEY = "current";

function openPersistenceDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not available"));
      return;
    }
    const request = indexedDB.open(PERSISTENCE_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PERSISTENCE_STORE)) {
        request.result.createObjectStore(PERSISTENCE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open local storage"));
  });
}

async function readPersistedState(): Promise<PersistedEditorState | undefined> {
  const db = await openPersistenceDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PERSISTENCE_STORE, "readonly");
    const request = transaction.objectStore(PERSISTENCE_STORE).get(PERSISTENCE_KEY);
    request.onsuccess = () => {
      db.close();
      resolve(request.result as PersistedEditorState | undefined);
    };
    request.onerror = () => {
      db.close();
      reject(request.error ?? new Error("Could not read local editor state"));
    };
  });
}

async function writePersistedState(state: PersistedEditorState): Promise<void> {
  const db = await openPersistenceDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PERSISTENCE_STORE, "readwrite");
    transaction.objectStore(PERSISTENCE_STORE).put(state, PERSISTENCE_KEY);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Could not save local editor state"));
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error ?? new Error("Saving local editor state was aborted"));
    };
  });
}

function isPersistedEditorState(value: unknown): value is PersistedEditorState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<PersistedEditorState>;
  const isPoint = (point: unknown): point is { x: number; y: number } =>
    !!point &&
    typeof point === "object" &&
    Number.isFinite((point as { x?: number }).x) &&
    Number.isFinite((point as { y?: number }).y);
  const isCrop = (crop: unknown): crop is CropBox =>
    !!crop &&
    typeof crop === "object" &&
    Number.isFinite((crop as CropBox).x) &&
    Number.isFinite((crop as CropBox).y) &&
    Number.isFinite((crop as CropBox).width) &&
    Number.isFinite((crop as CropBox).height);
  const validRatios: RatioValue[] = [
    "free", "1:1", "4:5", "9:16", "16:9", "4:3", "3:2", "1.91:1", "2.63:1", "4:1",
  ];

  return (
    typeof state.source === "string" &&
    typeof state.sourceName === "string" &&
    (state.crop === null || isCrop(state.crop)) &&
    !!state.transform &&
    [0, 90, 180, 270].includes(state.transform.rotation) &&
    typeof state.transform.flipH === "boolean" &&
    typeof state.transform.flipV === "boolean" &&
    validRatios.includes(state.ratioValue as RatioValue) &&
    typeof state.zoom === "number" &&
    state.zoom >= MIN_ZOOM &&
    state.zoom <= MAX_ZOOM &&
    typeof state.format === "string" &&
    ["image/png", "image/jpeg", "image/webp"].includes(state.format) &&
    typeof state.quality === "number" &&
    state.quality >= 0 &&
    state.quality <= 1 &&
    isPoint(state.panOffset) &&
    (state.interactionMode === "select" || state.interactionMode === "pan") &&
    typeof state.exportUrl === "string"
  );
}

function SectionToggle({
  id,
  label,
  open,
  onClick,
  trailing,
}: {
  id: string;
  label: string;
  open: boolean;
  onClick: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={id}
      onClick={onClick}
      className="flex min-h-8 w-full items-center justify-between gap-2 text-left"
    >
      <span className="text-sm font-semibold text-text">{label}</span>
      <span className="flex items-center gap-2">
        {trailing}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

function createRatioCrop(width: number, height: number, ratio: number | null): CropBox {
  if (ratio === null) return { x: 0, y: 0, width, height };
  const cropWidth = Math.min(width, height * ratio);
  const cropHeight = cropWidth / ratio;
  return {
    x: (width - cropWidth) / 2,
    y: (height - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  };
}

function resizeCropFromHandle(
  crop: CropBox,
  handle: ResizeHandle,
  point: { x: number; y: number },
  bounds: { width: number; height: number },
  ratio: number | null
): CropBox {
  const hasWest = handle.includes("w");
  const hasEast = handle.includes("e");
  const hasNorth = handle.includes("n");
  const hasSouth = handle.includes("s");
  const anchorX = hasWest ? crop.x + crop.width : hasEast ? crop.x : crop.x + crop.width / 2;
  const anchorY = hasNorth ? crop.y + crop.height : hasSouth ? crop.y : crop.y + crop.height / 2;
  const rawWidth = hasWest || hasEast ? Math.abs(point.x - anchorX) : crop.width;
  const rawHeight = hasNorth || hasSouth ? Math.abs(point.y - anchorY) : crop.height;
  const directionX = point.x < anchorX ? -1 : 1;
  const directionY = point.y < anchorY ? -1 : 1;
  const maxWidth = hasWest || hasEast
    ? directionX < 0 ? anchorX : bounds.width - anchorX
    : 2 * Math.min(anchorX, bounds.width - anchorX);
  const maxHeight = hasNorth || hasSouth
    ? directionY < 0 ? anchorY : bounds.height - anchorY
    : 2 * Math.min(anchorY, bounds.height - anchorY);
  let width = rawWidth;
  let height = rawHeight;

  if (ratio !== null) {
    if (hasWest || hasEast) {
      width = hasNorth || hasSouth
        ? Math.max(rawWidth, rawHeight * ratio)
        : rawWidth;
    } else {
      width = rawHeight * ratio;
    }
    width = Math.min(width, maxWidth, maxHeight * ratio);
    height = width / ratio;
  } else {
    width = hasWest || hasEast ? Math.min(rawWidth, maxWidth) : crop.width;
    height = hasNorth || hasSouth ? Math.min(rawHeight, maxHeight) : crop.height;
  }

  const x = hasWest || hasEast
    ? directionX < 0 ? anchorX - width : anchorX
    : anchorX - width / 2;
  const y = hasNorth || hasSouth
    ? directionY < 0 ? anchorY - height : anchorY
    : anchorY - height / 2;

  return {
    x: Math.max(0, Math.min(x, bounds.width - width)),
    y: Math.max(0, Math.min(y, bounds.height - height)),
    width: Math.max(1, width),
    height: Math.max(1, height),
  };
}

export default function ImageCrop() {
  const [source, setSource] = useState("");
  const [sourceName, setSourceName] = useState("image");
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [previewScale, setPreviewScale] = useState({ x: 1, y: 1 });
  const [crop, setCrop] = useState<CropBox | null>(null);
  const [dragging, setDragging] = useState(false);
  const [interactionMode, setInteractionMode] = useState<InteractionMode>("select");
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState<Transform>({
    rotation: 0,
    flipH: false,
    flipV: false,
  });
  const [ratioValue, setRatioValue] = useState<RatioValue>("free");
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [format, setFormat] = useState<ExportFormat>("image/png");
  const [quality, setQuality] = useState(0.9);
  const [exportUrl, setExportUrl] = useState("");
  const [error, setError] = useState("");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [persistenceReady, setPersistenceReady] = useState(false);
  const [ratioPanelOpen, setRatioPanelOpen] = useState(true);
  const [dimensionsPanelOpen, setDimensionsPanelOpen] = useState(false);
  const [transformPanelOpen, setTransformPanelOpen] = useState(false);
  const [outputPanelOpen, setOutputPanelOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const started = useRef<{
    type: "draw" | "move" | "pan" | "resize" | "pinch";
    x: number;
    y: number;
    crop?: CropBox;
    handle?: ResizeHandle;
    snapshot?: CropSnapshot;
    clientX?: number;
    clientY?: number;
    panX?: number;
    panY?: number;
    startZoom?: number;
    startDistance?: number;
  } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number; type: string }>());
  const history = useRef<CropSnapshot[]>([]);
  const historyIndex = useRef(-1);
  const currentSnapshot = useRef<CropSnapshot>({
    crop: null,
    panOffset: { x: 0, y: 0 },
    transform: { rotation: 0, flipH: false, flipV: false },
    ratioValue: "free",
  });
  const persistenceEnabled = useRef(false);
  const fileReadId = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const t = useTranslations("comp.imageCrop");

  useEffect(() => {
    currentSnapshot.current = { crop, panOffset, transform, ratioValue };
  }, [crop, panOffset, transform, ratioValue]);

  useEffect(() => {
    let cancelled = false;
    readPersistedState()
      .then((saved) => {
        if (cancelled) return;
        if (saved !== undefined) {
          if (!isPersistedEditorState(saved)) {
            persistenceEnabled.current = false;
            setError(t("storageError"));
            setPersistenceReady(true);
            return;
          }
          setSource(saved.source);
          setSourceName(saved.sourceName);
          setCrop(saved.crop);
          setTransform(saved.transform);
          setRatioValue(saved.ratioValue);
          setZoom(saved.zoom);
          setFormat(saved.format);
          setQuality(saved.quality);
          setPanOffset(saved.panOffset);
          setInteractionMode(saved.interactionMode);
          setExportUrl(saved.exportUrl);
          resetHistory({
            crop: saved.crop,
            panOffset: saved.panOffset,
            transform: saved.transform,
            ratioValue: saved.ratioValue,
          });
        }
        persistenceEnabled.current = true;
        setPersistenceReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        persistenceEnabled.current = false;
        setError(t("storageError"));
        setPersistenceReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (!persistenceReady || !persistenceEnabled.current) return;
    const timeout = window.setTimeout(() => {
      void writePersistedState({
        source,
        sourceName,
        crop,
        transform,
        ratioValue,
        zoom,
        format,
        quality,
        panOffset,
        interactionMode,
        exportUrl,
      }).catch(() => setError(t("storageError")));
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [
    persistenceReady,
    source,
    sourceName,
    crop,
    transform,
    ratioValue,
    zoom,
    format,
    quality,
    panOffset,
    interactionMode,
    exportUrl,
    t,
  ]);

  useEffect(() => {
    if (!previewOpen) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setPreviewOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [previewOpen]);

  function recordHistory(snapshot: CropSnapshot) {
    const previous = history.current[historyIndex.current];
    if (
      previous &&
      JSON.stringify(previous) === JSON.stringify(snapshot)
    ) {
      return;
    }
    const nextHistory = history.current.slice(0, historyIndex.current + 1);
    nextHistory.push(snapshot);
    if (nextHistory.length > 50) nextHistory.shift();
    history.current = nextHistory;
    historyIndex.current = nextHistory.length - 1;
    currentSnapshot.current = snapshot;
    setCanUndo(historyIndex.current > 0);
    setCanRedo(false);
  }

  function resetHistory(snapshot: CropSnapshot) {
    history.current = [snapshot];
    historyIndex.current = 0;
    currentSnapshot.current = snapshot;
    setCanUndo(false);
    setCanRedo(false);
  }

  function restoreSnapshot(snapshot: CropSnapshot) {
    currentSnapshot.current = snapshot;
    setCrop(snapshot.crop);
    setPanOffset(snapshot.panOffset);
    setTransform(snapshot.transform);
    setRatioValue(snapshot.ratioValue);
    setExportUrl("");
  }

  function updateDraftSnapshot(patch: Partial<CropSnapshot>) {
    currentSnapshot.current = { ...currentSnapshot.current, ...patch };
  }

  function undo() {
    if (historyIndex.current <= 0) return;
    historyIndex.current -= 1;
    restoreSnapshot(history.current[historyIndex.current]);
    setCanUndo(historyIndex.current > 0);
    setCanRedo(true);
  }

  function redo() {
    if (historyIndex.current >= history.current.length - 1) return;
    historyIndex.current += 1;
    restoreSnapshot(history.current[historyIndex.current]);
    setCanUndo(true);
    setCanRedo(historyIndex.current < history.current.length - 1);
  }

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      const viewport = previewViewportRef.current;
      if (!event.ctrlKey || !viewport || !viewport.contains(event.target as Node)) return;

      event.preventDefault();
      event.stopPropagation();
      const direction = event.deltaY < 0 ? 1 : -1;
      setZoom((current) =>
        Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, Math.round((current + direction * 0.1) * 10) / 10)
        )
      );
    }

    document.addEventListener("wheel", handleWheel, { capture: true, passive: false });
    return () => document.removeEventListener("wheel", handleWheel, true);
  }, []);

  function clearSelection() {
    recordHistory({
      crop: null,
      panOffset: { x: 0, y: 0 },
      transform,
      ratioValue,
    });
    setCrop(null);
    setExportUrl("");
    setPanOffset({ x: 0, y: 0 });
    setInteractionMode("select");
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("error"));
      return;
    }

    const readId = ++fileReadId.current;
    const reader = new FileReader();
    reader.onload = () => {
      if (readId !== fileReadId.current) return;
      setSource(String(reader.result ?? ""));
      setSourceName(file.name.replace(/\.[^.]+$/, "") || "image");
      setNaturalSize({ width: 0, height: 0 });
      setPreviewSize({ width: 0, height: 0 });
      setCrop(null);
      setExportUrl("");
      setError("");
      setTransform({ rotation: 0, flipH: false, flipV: false });
      setRatioValue("free");
      setZoom(INITIAL_ZOOM);
      setFormat("image/png");
      setQuality(0.9);
      setInteractionMode("select");
      setPanOffset({ x: 0, y: 0 });
      resetHistory({
        crop: null,
        panOffset: { x: 0, y: 0 },
        transform: { rotation: 0, flipH: false, flipV: false },
        ratioValue: "free",
      });
    };
    reader.onerror = () => {
      if (readId === fileReadId.current) setError(t("error"));
    };
    reader.readAsDataURL(file);
  }

  function handleLoaded() {
    const image = imageRef.current;
    if (!image) return;
    setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
    setError("");
  }

  function handleImageError() {
    setError(t("error"));
  }

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (
      !source ||
      !image ||
      !canvas ||
      naturalSize.width < 1 ||
      naturalSize.height < 1
    ) {
      return;
    }

    const swapsDimensions = transform.rotation === 90 || transform.rotation === 270;
    const orientedWidth = swapsDimensions ? naturalSize.height : naturalSize.width;
    const orientedHeight = swapsDimensions ? naturalSize.width : naturalSize.height;
    const scale = Math.min(1, Math.sqrt(MAX_CANVAS_PIXELS / (orientedWidth * orientedHeight)));
    const width = Math.max(1, Math.round(orientedWidth * scale));
    const height = Math.max(1, Math.round(orientedHeight * scale));
    const scaleX = width / orientedWidth;
    const scaleY = height / orientedHeight;

    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      setError(t("error"));
      return;
    }

    context.translate(width / 2, height / 2);
    context.scale(scaleX, scaleY);
    context.rotate((transform.rotation * Math.PI) / 180);
    context.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    context.drawImage(image, -naturalSize.width / 2, -naturalSize.height / 2);
    setPreviewSize({ width, height });
    setPreviewScale({ x: scaleX, y: scaleY });
  }, [source, naturalSize, transform, t]);

  function displayToCanvas(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!canvas || !rect || rect.width === 0 || rect.height === 0) {
      return { x: 0, y: 0 };
    }
    return {
      x: Math.min(Math.max((clientX - rect.left) * (canvas.width / rect.width), 0), canvas.width),
      y: Math.min(Math.max((clientY - rect.top) * (canvas.height / rect.height), 0), canvas.height),
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!previewSize.width || !previewSize.height) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = displayToCanvas(event.clientX, event.clientY);
    const target = event.target;
    const handle = target instanceof HTMLElement
      ? target.dataset.cropHandle as ResizeHandle | undefined
      : undefined;
    const snapshot = currentSnapshot.current;

    if (handle && crop) {
      started.current = {
        type: "resize",
        x: point.x,
        y: point.y,
        crop,
        handle,
        snapshot,
      };
      setDragging(true);
      setExportUrl("");
      return;
    }

    if (event.pointerType === "touch") {
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY, type: "touch" });
      const activeTouches = Array.from(pointers.current.values()).filter((pointer) => pointer.type === "touch");
      if (activeTouches.length === 2) {
        const [first, second] = activeTouches;
        started.current = {
          type: "pinch",
          x: 0,
          y: 0,
          startZoom: zoom,
          startDistance: Math.hypot(second.x - first.x, second.y - first.y),
        };
        setDragging(true);
        setExportUrl("");
        return;
      }
    }

    if (interactionMode === "pan") {
      started.current = {
        type: "pan",
        x: point.x,
        y: point.y,
        clientX: event.clientX,
        clientY: event.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
        snapshot,
      };
      setDragging(true);
      return;
    }
    const isInsideCrop =
      crop !== null &&
      point.x >= crop.x &&
      point.x <= crop.x + crop.width &&
      point.y >= crop.y &&
      point.y <= crop.y + crop.height;
    started.current = isInsideCrop && crop
      ? { type: "move", x: point.x, y: point.y, crop, snapshot }
      : { type: "draw", x: point.x, y: point.y, snapshot };
    setExportUrl("");
    setDragging(true);
  }

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging || !started.current) return;
      if (event.pointerType === "touch" && pointers.current.has(event.pointerId)) {
        pointers.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
          type: "touch",
        });
      }
      const point = displayToCanvas(event.clientX, event.clientY);
      const start = started.current;
      if (start.type === "pinch") {
        const activeTouches = Array.from(pointers.current.values()).filter((pointer) => pointer.type === "touch");
        if (activeTouches.length >= 2 && start.startDistance) {
          const [first, second] = activeTouches;
          const distance = Math.hypot(second.x - first.x, second.y - first.y);
          setZoom(
            Math.min(
              MAX_ZOOM,
              Math.max(MIN_ZOOM, Math.round(((start.startZoom ?? INITIAL_ZOOM) * distance / start.startDistance) * 10) / 10)
            )
          );
        }
        return;
      }
      if (start.type === "pan") {
          const nextPanOffset = {
          x: (start.panX ?? 0) + event.clientX - (start.clientX ?? event.clientX),
          y: (start.panY ?? 0) + event.clientY - (start.clientY ?? event.clientY),
          };
          setPanOffset(nextPanOffset);
          updateDraftSnapshot({ panOffset: nextPanOffset });
          return;
        }
        if (start.type === "resize" && start.crop && start.handle) {
          const ratio = RATIOS.find((item) => item.value === ratioValue)?.ratio ?? null;
          const nextCrop = resizeCropFromHandle(start.crop, start.handle, point, previewSize, ratio);
          setCrop(nextCrop);
          updateDraftSnapshot({ crop: nextCrop });
          return;
        }
      const ratio = RATIOS.find((item) => item.value === ratioValue)?.ratio ?? null;

      if (start.type === "move" && start.crop) {
        const nextCrop = {
          ...start.crop,
          x: Math.min(
            Math.max(start.crop.x + point.x - start.x, 0),
            previewSize.width - start.crop.width
          ),
          y: Math.min(
            Math.max(start.crop.y + point.y - start.y, 0),
            previewSize.height - start.crop.height
          ),
        };
        setCrop(nextCrop);
        updateDraftSnapshot({ crop: nextCrop });
        return;
      }

      if (ratio === null) {
        const nextCrop = {
          x: Math.min(start.x, point.x),
          y: Math.min(start.y, point.y),
          width: Math.abs(point.x - start.x),
          height: Math.abs(point.y - start.y),
        };
        setCrop(nextCrop);
        updateDraftSnapshot({ crop: nextCrop });
        return;
      }

      const directionX = point.x < start.x ? -1 : 1;
      const directionY = point.y < start.y ? -1 : 1;
      const availableWidth = directionX > 0 ? previewSize.width - start.x : start.x;
      const availableHeight = directionY > 0 ? previewSize.height - start.y : start.y;
      const draggedWidth = Math.max(
        Math.abs(point.x - start.x),
        Math.abs(point.y - start.y) * ratio
      );
      const width = Math.min(draggedWidth, availableWidth, availableHeight * ratio);
      const height = width / ratio;
      const nextCrop = {
        x: directionX > 0 ? start.x : start.x - width,
        y: directionY > 0 ? start.y : start.y - height,
        width,
        height,
      };
      setCrop(nextCrop);
      updateDraftSnapshot({ crop: nextCrop });
    },
    [dragging, previewSize, ratioValue]
  );

  function stopDragging(event: React.PointerEvent<HTMLDivElement>) {
    const start = started.current;
    if (event.pointerType === "touch") pointers.current.delete(event.pointerId);
    if (start?.type === "pinch") {
      pointers.current.clear();
      setDragging(false);
      started.current = null;
      return;
    }
    if (start?.snapshot) recordHistory(currentSnapshot.current);
    setDragging(false);
    started.current = null;
  }

  function updateTransform(patch: Partial<Transform>) {
    const nextTransform = { ...transform, ...patch };
    const nextSnapshot = {
      crop: null,
      panOffset: { x: 0, y: 0 },
      transform: nextTransform,
      ratioValue,
    };
    recordHistory(nextSnapshot);
    setTransform(nextTransform);
    setPanOffset({ x: 0, y: 0 });
    setCrop(null);
    setExportUrl("");
  }

  function selectRatio(value: RatioValue) {
    const ratio = RATIOS.find((item) => item.value === value)?.ratio ?? null;
    const nextCrop =
      value === "free"
        ? null
        : previewSize.width > 0 && previewSize.height > 0
          ? createRatioCrop(previewSize.width, previewSize.height, ratio)
          : null;
    recordHistory({ crop: nextCrop, panOffset, transform, ratioValue: value });
    setRatioValue(value);
    setExportUrl("");
    setCrop(nextCrop);
  }

  function setCropDimension(dimension: "width" | "height", value: string) {
    if (!crop || !value.trim()) return;
    const requested = Number(value);
    if (!Number.isFinite(requested) || requested < 1) return;

    const maxWidth = Math.floor(previewSize.width / previewScale.x);
    const maxHeight = Math.floor(previewSize.height / previewScale.y);
    const ratio = RATIOS.find((item) => item.value === ratioValue)?.ratio ?? null;
    const centerX = crop.x + crop.width / 2;
    const centerY = crop.y + crop.height / 2;
    let width =
      dimension === "width" ? requested * previewScale.x : crop.width;
    let height =
      dimension === "height" ? requested * previewScale.y : crop.height;

    if (ratio !== null) {
      if (dimension === "width") {
        width = Math.min(width, previewSize.width, previewSize.height * ratio);
        height = width / ratio;
      } else {
        height = Math.min(height, previewSize.height, previewSize.width / ratio);
        width = height * ratio;
      }
    } else {
      width = Math.min(width, maxWidth * previewScale.x);
      height = Math.min(height, maxHeight * previewScale.y);
    }

    const nextCrop = {
      x: Math.max(0, Math.min(centerX - width / 2, previewSize.width - width)),
      y: Math.max(0, Math.min(centerY - height / 2, previewSize.height - height)),
      width: Math.max(1, width),
      height: Math.max(1, height),
    };
    recordHistory({ crop: nextCrop, panOffset, transform, ratioValue });
    setCrop(nextCrop);
    setExportUrl("");
  }

  function centerImage() {
    setPanOffset({ x: 0, y: 0 });
    window.requestAnimationFrame(() => {
      const viewport = previewViewportRef.current;
      const canvas = canvasRef.current;
      if (!viewport || !canvas) return;

      const viewportRect = viewport.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const centeredPanOffset = {
        x: viewportRect.left + viewportRect.width / 2 - (canvasRect.left + canvasRect.width / 2),
        y: viewportRect.top + viewportRect.height / 2 - (canvasRect.top + canvasRect.height / 2),
      };
      recordHistory({ crop, panOffset: centeredPanOffset, transform, ratioValue });
      setPanOffset(centeredPanOffset);
    });
  }

  function reset() {
    const nextTransform = { rotation: 0, flipH: false, flipV: false } as const;
    const nextSnapshot = {
      crop: null,
      panOffset: { x: 0, y: 0 },
      transform: nextTransform,
      ratioValue: "free" as const,
    };
    recordHistory(nextSnapshot);
    setTransform(nextTransform);
    setRatioValue("free");
    setZoom(INITIAL_ZOOM);
    setFormat("image/png");
    setQuality(0.9);
    setPanOffset({ x: 0, y: 0 });
    setInteractionMode("select");
    setCrop(null);
    setExportUrl("");
    setError("");
  }

  function cropImage() {
    setError("");
    setExportUrl("");
    if (
      !crop ||
      crop.width < 1 ||
      crop.height < 1 ||
      !source ||
      !previewScale.x ||
      !previewScale.y
    ) {
      return;
    }

    const outputWidth = Math.round(crop.width / previewScale.x);
    const outputHeight = Math.round(crop.height / previewScale.y);
    if (exceedsCanvasLimit(outputWidth, outputHeight)) {
      setError(t("error"));
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext("2d");
    const image = imageRef.current;
    if (!context || !image) {
      setError(t("error"));
      return;
    }

    if (format === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, outputWidth, outputHeight);
    }
    const swapsDimensions = transform.rotation === 90 || transform.rotation === 270;
    const orientedWidth = swapsDimensions ? naturalSize.height : naturalSize.width;
    const orientedHeight = swapsDimensions ? naturalSize.width : naturalSize.height;
    context.translate(-crop.x / previewScale.x, -crop.y / previewScale.y);
    context.translate(orientedWidth / 2, orientedHeight / 2);
    context.rotate((transform.rotation * Math.PI) / 180);
    context.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    context.drawImage(image, -naturalSize.width / 2, -naturalSize.height / 2);

    try {
      const dataUrl = canvas.toDataURL(format, format === "image/png" ? undefined : quality);
      if (!dataUrl.startsWith(`data:${format};`)) {
        setError(t("formatError"));
        return;
      }
      setExportUrl(dataUrl);
    } catch {
      setError(t("error"));
    }
  }

  function download() {
    if (!exportUrl) return;
    const selectedFormat = FORMATS.find((item) => item.value === format) ?? FORMATS[0];
    const link = document.createElement("a");
    link.href = exportUrl;
    link.download = `${sourceName}-cropped.${selectedFormat.extension}`;
    link.click();
  }

  const selectedRatio = RATIOS.find((item) => item.value === ratioValue);
  const cropWidth = crop ? Math.round(crop.width / previewScale.x) : 0;
  const cropHeight = crop ? Math.round(crop.height / previewScale.y) : 0;
  const cropPath = crop
    ? `M0 0H${previewSize.width}V${previewSize.height}H0Z M${crop.x} ${crop.y}h${crop.width}v${crop.height}h-${crop.width}Z`
    : "";
  const handlePosition: Record<ResizeHandle, { top: string; left: string; cursor: string }> = {
    nw: { top: `${crop ? (crop.y / previewSize.height) * 100 : 0}%`, left: `${crop ? (crop.x / previewSize.width) * 100 : 0}%`, cursor: "cursor-nwse-resize" },
    n: { top: `${crop ? (crop.y / previewSize.height) * 100 : 0}%`, left: `${crop ? ((crop.x + crop.width / 2) / previewSize.width) * 100 : 0}%`, cursor: "cursor-ns-resize" },
    ne: { top: `${crop ? (crop.y / previewSize.height) * 100 : 0}%`, left: `${crop ? ((crop.x + crop.width) / previewSize.width) * 100 : 0}%`, cursor: "cursor-nesw-resize" },
    e: { top: `${crop ? ((crop.y + crop.height / 2) / previewSize.height) * 100 : 0}%`, left: `${crop ? ((crop.x + crop.width) / previewSize.width) * 100 : 0}%`, cursor: "cursor-ew-resize" },
    se: { top: `${crop ? ((crop.y + crop.height) / previewSize.height) * 100 : 0}%`, left: `${crop ? ((crop.x + crop.width) / previewSize.width) * 100 : 0}%`, cursor: "cursor-nwse-resize" },
    s: { top: `${crop ? ((crop.y + crop.height) / previewSize.height) * 100 : 0}%`, left: `${crop ? ((crop.x + crop.width / 2) / previewSize.width) * 100 : 0}%`, cursor: "cursor-ns-resize" },
    sw: { top: `${crop ? ((crop.y + crop.height) / previewSize.height) * 100 : 0}%`, left: `${crop ? (crop.x / previewSize.width) * 100 : 0}%`, cursor: "cursor-nesw-resize" },
    w: { top: `${crop ? ((crop.y + crop.height / 2) / previewSize.height) * 100 : 0}%`, left: `${crop ? (crop.x / previewSize.width) * 100 : 0}%`, cursor: "cursor-ew-resize" },
  };

  return (
    <div className="min-w-0 space-y-5">
      <label
        htmlFor="image-crop-upload"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files[0]);
        }}
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-7 text-center transition-colors sm:flex-row sm:justify-between sm:text-left ${
          source
            ? "border-border bg-surface"
            : "border-accent/40 bg-accent/5 hover:border-accent hover:bg-accent/10"
        }`}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xl text-accent" aria-hidden="true">
            {source ? "↗" : "+"}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-text">
              {source ? t("replace") : t("dropHint")}
            </span>
            <span className="mt-1 block text-xs text-muted">{t("dropSupport")}</span>
          </span>
        </span>
        <input
          id="image-crop-upload"
          type="file"
          accept="image/*"
          onChange={(event) => {
            handleFile(event.currentTarget.files?.[0]);
            event.currentTarget.value = "";
          }}
          className="mt-4 block w-full max-w-xs cursor-pointer rounded-lg border border-border bg-bg px-3 py-2 text-xs text-muted file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-accent sm:mt-0 sm:w-auto"
        />
      </label>

      {source ? (
        <div className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={source}
            alt=""
            aria-hidden="true"
            onLoad={handleLoaded}
            onError={handleImageError}
            className="hidden"
          />

          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-text">{t("workspaceTitle")}</h2>
              <p className="mt-1 text-xs text-muted">{t("workspaceSubtitle")}</p>
            </div>
            {naturalSize.width > 0 ? (
              <span className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium tabular-nums text-muted">
                {t("originalSize", {
                  width: naturalSize.width,
                  height: naturalSize.height,
                })}
              </span>
            ) : null}
          </header>

          <div
            className={`grid items-start gap-4 lg:gap-5 ${
              exportUrl
                ? "lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_300px]"
                : "lg:grid-cols-[320px_minmax(0,1fr)]"
            }`}
          >
            <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface lg:col-start-2 lg:row-start-1">
              <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2.5 sm:px-4">
                <p className="text-xs font-medium text-muted">{t("tooltip")}</p>
                <div className="flex items-center gap-2">
                  {crop ? (
                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
                      {t("size", { width: cropWidth, height: cropHeight })}
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted">
                      {t("chooseCropHint")}
                    </span>
                  )}
                  <div className="flex items-center gap-1 border-l border-border pl-2">
                    <button
                      type="button"
                      onClick={undo}
                      disabled={!canUndo}
                      aria-label={t("undo")}
                      title={t("undo")}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FontAwesomeIcon icon={faArrowRotateLeft} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={redo}
                      disabled={!canRedo}
                      aria-label={t("redo")}
                      title={t("redo")}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <FontAwesomeIcon icon={faArrowRotateRight} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 sm:px-4">
                <div className="flex gap-1 rounded-lg bg-surface-2 p-1">
                  {(["select", "pan"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={interactionMode === mode}
                      onClick={() => setInteractionMode(mode)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        interactionMode === mode
                          ? "bg-surface text-accent shadow-sm"
                          : "text-muted hover:text-text"
                      }`}
                    >
                      {t(mode === "select" ? "selectMode" : "moveMode")}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={centerImage}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-text"
                >
                  {t("centerImage")}
                </button>
              </div>
              <div
                ref={previewViewportRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopDragging}
                onPointerCancel={stopDragging}
                className="h-[420px] touch-none overflow-auto bg-bg sm:h-[520px]"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, var(--surface-2) 25%, transparent 25%), linear-gradient(-45deg, var(--surface-2) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--surface-2) 75%), linear-gradient(-45deg, transparent 75%, var(--surface-2) 75%)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
                }}
              >
                <div
                  className="relative mx-auto min-w-0 align-top"
                  style={{
                    width: `${zoom * 100}%`,
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    role="img"
                    aria-label={t("altImage")}
                    className={`block h-auto w-full select-none touch-none ${
                      interactionMode === "pan"
                        ? dragging
                          ? "cursor-grabbing"
                          : "cursor-grab"
                        : "cursor-crosshair"
                    }`}
                  />
                  {crop ? (
                    <>
                      <svg
                        aria-hidden="true"
                        viewBox={`0 0 ${previewSize.width} ${previewSize.height}`}
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute inset-0 h-full w-full"
                      >
                        <path d={cropPath} fill="black" fillOpacity="0.48" fillRule="evenodd" />
                        <rect
                          x={crop.x}
                          y={crop.y}
                          width={crop.width}
                          height={crop.height}
                          fill="none"
                          stroke="white"
                          strokeWidth={Math.max(previewSize.width, previewSize.height) / 500}
                        />
                      </svg>
                      {interactionMode === "select"
                        ? RESIZE_HANDLES.map((handle) => {
                            const position = handlePosition[handle];
                            return (
                              <button
                                key={handle}
                                type="button"
                                data-crop-handle={handle}
                                aria-label={t("resizeCropHandle", { position: t(`handle${handle.toUpperCase()}`) })}
                                className={`pointer-events-auto absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-white shadow-sm ${position.cursor}`}
                                style={{ top: position.top, left: position.left }}
                              />
                            );
                          })
                        : null}
                    </>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2.5 sm:px-4">
                <p className="text-xs text-muted">{t("zoomHint")}</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={t("zoomOut")}
                    disabled={zoom <= MIN_ZOOM}
                    onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - 0.1))}
                    className="h-8 w-8 rounded-lg border border-border bg-surface text-sm font-semibold text-text hover:border-accent disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="min-w-14 text-center text-xs font-medium tabular-nums text-text">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    aria-label={t("zoomIn")}
                    disabled={zoom >= MAX_ZOOM}
                    onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + 0.1))}
                    className="h-8 w-8 rounded-lg border border-border bg-surface text-sm font-semibold text-text hover:border-accent disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            {exportUrl ? (
              <section className="overflow-hidden rounded-2xl border border-accent/25 bg-surface shadow-card lg:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1">
                <div className="border-b border-border bg-accent/5 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-lg font-semibold text-accent"
                    >
                      ✓
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-text">{t("outputPreview")}</h3>
                      <p className="mt-0.5 text-xs text-muted">
                        {FORMATS.find((item) => item.value === format)?.label} · {cropWidth} × {cropHeight} px
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="group/result relative flex h-56 items-center justify-center overflow-hidden rounded-xl border border-border bg-bg p-3">
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      aria-label={t("openPreview")}
                      className="flex h-full w-full cursor-zoom-in items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exportUrl}
                        alt={t("altResult")}
                        className="max-h-full max-w-full rounded-lg object-contain"
                      />
                    </button>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none fixed inset-0 z-50 invisible flex items-center justify-center bg-black/65 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover/result:visible group-hover/result:opacity-100 group-focus-within/result:visible group-focus-within/result:opacity-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exportUrl}
                        alt=""
                        className="max-h-[85vh] max-w-[85vw] rounded-xl border border-white/20 bg-bg object-contain shadow-2xl"
                      />
                    </div>
                  </div>
                  {previewOpen ? (
                    <div
                      role="dialog"
                      aria-modal="true"
                      aria-label={t("altResult")}
                      onClick={() => setPreviewOpen(false)}
                      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-8"
                    >
                      <button
                        type="button"
                        autoFocus
                        onClick={() => setPreviewOpen(false)}
                        aria-label={t("closePreview")}
                        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/50 text-2xl text-white hover:bg-black/70"
                      >
                        ×
                      </button>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exportUrl}
                        alt={t("altResult")}
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
                      />
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={download}
                    className="mt-4 w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-on-accent shadow-sm transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
                  >
                    {t("download")}
                  </button>
                </div>
              </section>
            ) : null}

            <aside className="space-y-4 lg:sticky lg:top-4 lg:col-start-1 lg:row-start-1">
              <section className="rounded-2xl border border-border bg-surface p-4">
                <SectionToggle
                  id="crop-ratio-options"
                  label={t("ratio")}
                  open={ratioPanelOpen}
                  onClick={() => setRatioPanelOpen((open) => !open)}
                  trailing={
                    <span className="text-xs text-muted">
                      {selectedRatio?.value === "free" ? "—" : selectedRatio?.value}
                    </span>
                  }
                />
                {ratioPanelOpen ? (
                  <div id="crop-ratio-options" className="mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      {RATIOS.map((item) => {
                        const active = ratioValue === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() => selectRatio(item.value)}
                            className={`flex min-h-12 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                              active
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border bg-bg text-muted hover:border-strong hover:text-text"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mx-0.5 block shrink-0 rounded-[3px] border ${
                                active ? "border-accent" : "border-muted"
                              }`}
                              style={{
                                width:
                                  item.ratio === null
                                    ? 17
                                    : item.ratio > 1
                                      ? 20
                                      : Math.max(10, Math.round(16 * item.ratio)),
                                height:
                                  item.ratio === null
                                    ? 15
                                    : item.ratio < 1
                                      ? 20
                                      : Math.max(10, Math.round(16 / item.ratio)),
                              }}
                            />
                            <span className="min-w-0">
                              <span className="block truncate text-xs font-medium">{t(item.label)}</span>
                              {item.ratio !== null ? (
                                <span className="mt-0.5 block text-[10px] opacity-75">{item.value}</span>
                              ) : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 border-t border-border pt-3">
                  <SectionToggle
                    id="crop-dimension-options"
                    label={t("exactDimensions")}
                    open={dimensionsPanelOpen}
                    onClick={() => setDimensionsPanelOpen((open) => !open)}
                    trailing={
                      selectedRatio?.ratio ? (
                        <span className="text-[10px] text-muted">{t("ratioLocked")}</span>
                      ) : null
                    }
                  />
                  {dimensionsPanelOpen ? (
                    <div id="crop-dimension-options" className="mt-2 grid grid-cols-2 gap-2">
                      <label className="text-xs text-muted">
                        {t("widthPx")}
                        <input
                          type="number"
                          min={1}
                          max={Math.floor(previewSize.width / previewScale.x)}
                          step={1}
                          value={crop ? cropWidth : ""}
                          disabled={!crop}
                          onChange={(event) => setCropDimension("width", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-border bg-bg px-2.5 py-2 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                        />
                      </label>
                      <label className="text-xs text-muted">
                        {t("heightPx")}
                        <input
                          type="number"
                          min={1}
                          max={Math.floor(previewSize.height / previewScale.y)}
                          step={1}
                          value={crop ? cropHeight : ""}
                          disabled={!crop}
                          onChange={(event) => setCropDimension("height", event.target.value)}
                          className="mt-1 w-full rounded-lg border border-border bg-bg px-2.5 py-2 text-sm tabular-nums text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                        />
                      </label>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-surface p-4">
                <SectionToggle
                  id="crop-transform-options"
                  label={t("transform")}
                  open={transformPanelOpen}
                  onClick={() => setTransformPanelOpen((open) => !open)}
                />
                {transformPanelOpen ? <div id="crop-transform-options" className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateTransform({
                        rotation: (((transform.rotation + 270) % 360) as Transform["rotation"]),
                      })
                    }
                    className={buttonClass}
                  >
                    <span aria-hidden="true" className="mr-1.5 text-base">↶</span>
                    {t("rotateLeft")}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateTransform({
                        rotation: (((transform.rotation + 90) % 360) as Transform["rotation"]),
                      })
                    }
                    className={buttonClass}
                  >
                    <span aria-hidden="true" className="mr-1.5 text-base">↷</span>
                    {t("rotateRight")}
                  </button>
                  <button
                    type="button"
                    aria-pressed={transform.flipH}
                    onClick={() => updateTransform({ flipH: !transform.flipH })}
                    className={`${buttonClass} ${transform.flipH ? "border-accent bg-accent/10 text-accent" : ""}`}
                  >
                    ⇔ {t("flipH")}
                  </button>
                  <button
                    type="button"
                    aria-pressed={transform.flipV}
                    onClick={() => updateTransform({ flipV: !transform.flipV })}
                    className={`${buttonClass} ${transform.flipV ? "border-accent bg-accent/10 text-accent" : ""}`}
                  >
                    ⇵ {t("flipV")}
                  </button>
                </div> : null}
              </section>

              <section className="rounded-2xl border border-border bg-surface p-4">
                <SectionToggle
                  id="crop-output-options"
                  label={t("outputSettings")}
                  open={outputPanelOpen}
                  onClick={() => setOutputPanelOpen((open) => !open)}
                  trailing={<span className="text-xs text-muted">{FORMATS.find((item) => item.value === format)?.label}</span>}
                />
                {outputPanelOpen ? <div id="crop-output-options">
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
                  {FORMATS.map((item) => {
                    const active = format === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setFormat(item.value);
                          setExportUrl("");
                        }}
                        className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                          active
                            ? "bg-surface text-accent shadow-sm"
                            : "text-muted hover:text-text"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                {format !== "image/png" ? (
                  <label
                    htmlFor="image-crop-quality"
                    className="mt-4 block text-xs font-medium text-muted"
                  >
                    <span className="flex items-center justify-between">
                      {t("quality")}
                      <span className="tabular-nums text-text">{Math.round(quality * 100)}%</span>
                    </span>
                    <input
                      id="image-crop-quality"
                      type="range"
                      min={0.1}
                      max={1}
                      step={0.05}
                      value={quality}
                      onChange={(event) => {
                        setQuality(Number(event.target.value));
                        setExportUrl("");
                      }}
                      className="mt-2 w-full accent-accent"
                    />
                  </label>
                ) : null}
                </div> : null}
              </section>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={cropImage}
                  disabled={!cropWidth || !cropHeight}
                  className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-on-accent shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {t("crop")}
                  {cropWidth && cropHeight ? (
                    <span className="ml-2 font-normal opacity-80">
                      {cropWidth} × {cropHeight}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-strong hover:text-text"
                >
                  {t("reset")}
                </button>
              </div>
            </aside>
          </div>

          {crop ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-text">{t("selectionReady")}</p>
                <p className="mt-0.5 text-xs tabular-nums text-muted">
                  {t("size", { width: cropWidth, height: cropHeight })}
                  {selectedRatio?.ratio ? ` · ${selectedRatio.value}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-text"
              >
                {t("clearSelection")}
              </button>
            </div>
          ) : null}

        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-muted">{t("note")}</p>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
