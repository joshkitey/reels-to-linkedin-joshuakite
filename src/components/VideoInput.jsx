import { useState, useRef } from "react";
import { transcribeVideo } from "../lib/transcriber";

export default function VideoInput({ onTranscriptReady }) {
  const [mode, setMode] = useState("upload"); // upload | paste
  const [dragOver, setDragOver] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [status, setStatus] = useState(""); // "" | "loading-model" | "extracting" | "transcribing" | "error"
  const [progress, setProgress] = useState("");
  const fileRef = useRef();
  const videoFileRef = useRef(null);

  async function handleFile(file) {
    if (!file || !file.type.startsWith("video/")) {
      alert("Please upload a video file (MP4, MOV, etc.)");
      return;
    }
    videoFileRef.current = file;
    setStatus("loading-model");
    setProgress("Downloading transcription model (first time only)...");

    try {
      const text = await transcribeVideo(file, (event) => {
        if (event.status === "download" || event.status === "progress") {
          const pct = event.progress ? Math.round(event.progress) : 0;
          setProgress(`Loading model... ${pct}%`);
          setStatus("loading-model");
        } else if (event.status === "done") {
          setStatus("transcribing");
          setProgress("Transcribing audio...");
        }
      });

      if (text && text.trim()) {
        setStatus("");
        setProgress("");
        onTranscriptReady?.(text.trim());
      } else {
        setStatus("error");
        setProgress(
          "Could not detect speech in this video. Try pasting the transcript instead."
        );
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setStatus("error");
      setProgress(
        `Transcription failed: ${err.message}. Try pasting the transcript instead.`
      );
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  const isProcessing =
    status === "loading-model" ||
    status === "extracting" ||
    status === "transcribing";

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex gap-2 justify-center">
        {[
          { key: "upload", label: "Upload Video" },
          { key: "paste", label: "Paste Transcript" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => !isProcessing && setMode(tab.key)}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              mode === tab.key
                ? "bg-emerald-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload mode */}
      {mode === "upload" && !isProcessing && status !== "error" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-gray-700 hover:border-gray-500 hover:bg-gray-900/50"
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="text-4xl mb-3">📱</div>
          <p className="text-lg font-medium text-gray-300">
            Drop your reel video here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or click to browse (MP4, MOV, WebM)
          </p>
          <p className="text-xs text-gray-600 mt-3">
            Audio will be automatically transcribed and converted
          </p>
        </div>
      )}

      {/* Processing state */}
      {isProcessing && (
        <div className="border border-gray-700 rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-lg text-white font-medium">
            {status === "loading-model" && "Loading AI model..."}
            {status === "extracting" && "Extracting audio..."}
            {status === "transcribing" && "Transcribing..."}
          </p>
          <p className="text-sm text-gray-400">{progress}</p>
          <p className="text-xs text-gray-600">
            First time takes ~30s to download the model. After that it's cached.
          </p>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="border border-red-800 bg-red-900/20 rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm text-red-300">{progress}</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => {
                setStatus("");
                setProgress("");
              }}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setStatus("");
                setProgress("");
                setMode("paste");
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-500 cursor-pointer"
            >
              Paste Transcript Instead
            </button>
          </div>
        </div>
      )}

      {/* Paste transcript mode */}
      {mode === "paste" && (
        <div className="space-y-3">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your reel transcript or script here...&#10;&#10;Example: Today I'm going to show you my favorite smoothie recipe that gives me energy all day long. First, grab some spinach, a banana, some almond butter..."
            rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
          />
          <button
            onClick={() => {
              if (transcript.trim()) {
                onTranscriptReady?.(transcript.trim());
              }
            }}
            disabled={!transcript.trim()}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Convert to LinkedIn Content
          </button>
        </div>
      )}
    </div>
  );
}
