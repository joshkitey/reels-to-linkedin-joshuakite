import { useState, useRef } from "react";

export default function VideoInput({ onVideoLoaded, onTranscriptReady }) {
  const [mode, setMode] = useState("upload"); // upload | paste

  const [dragOver, setDragOver] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [transcript, setTranscript] = useState("");
  const fileRef = useRef();
  const videoRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith("video/")) {
      alert("Please upload a video file (MP4, MOV, etc.)");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setVideoSrc(objectUrl);
    onVideoLoaded?.(objectUrl, videoRef);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

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
            onClick={() => setMode(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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
      {mode === "upload" && (
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

      {/* Video preview */}
      {videoSrc && (
        <div className="space-y-3">
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            muted
            playsInline
            preload="metadata"
            className="w-full max-w-md mx-auto rounded-xl"
          />
          <p className="text-sm text-gray-400 text-center">
            Video uploaded. Now paste the transcript to convert it.
          </p>
          <button
            onClick={() => setMode("paste")}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            Paste Transcript to Convert
          </button>
        </div>
      )}
    </div>
  );
}
