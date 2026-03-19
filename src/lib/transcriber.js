// Browser-based transcription using HuggingFace Transformers (Whisper)
// Extracts audio from video via OfflineAudioContext, runs Whisper model

import { pipeline } from "@huggingface/transformers";

let transcriber = null;

export async function loadModel(onProgress) {
  if (transcriber) return transcriber;
  transcriber = await pipeline(
    "automatic-speech-recognition",
    "onnx-community/whisper-tiny.en",
    {
      dtype: "q8",
      device: "wasm",
      progress_callback: onProgress || undefined,
    }
  );
  return transcriber;
}

// Extract audio by playing video into a capture stream
export function extractAudioFromVideo(videoFile) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = false;
    video.playsInline = true;
    video.preload = "auto";

    const url = URL.createObjectURL(videoFile);
    video.src = url;

    video.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load video file"));
    });

    video.addEventListener("loadedmetadata", async () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not determine video duration"));
        return;
      }

      const sampleRate = 16000;
      const totalSamples = Math.ceil(duration * sampleRate);
      const offlineCtx = new OfflineAudioContext(1, totalSamples, sampleRate);

      try {
        // Decode the raw file bytes as audio
        const arrayBuffer = await videoFile.arrayBuffer();
        const audioBuffer = await offlineCtx.decodeAudioData(arrayBuffer);

        const source = offlineCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(offlineCtx.destination);
        source.start(0);

        const rendered = await offlineCtx.startRendering();
        const monoData = rendered.getChannelData(0);

        URL.revokeObjectURL(url);
        resolve(monoData);
      } catch (decodeErr) {
        // Fallback: try with regular AudioContext
        URL.revokeObjectURL(url);
        try {
          const fallbackData = await extractAudioFallback(videoFile, sampleRate);
          resolve(fallbackData);
        } catch (fallbackErr) {
          reject(
            new Error(
              "Could not extract audio from this video format. Try a different file or paste the transcript."
            )
          );
        }
      }
    });
  });
}

// Fallback: basic AudioContext decode
async function extractAudioFallback(videoFile, targetSampleRate) {
  const audioContext = new AudioContext({ sampleRate: targetSampleRate });
  const arrayBuffer = await videoFile.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const numChannels = audioBuffer.numberOfChannels;
  // Resample if needed
  const length = Math.ceil(audioBuffer.duration * targetSampleRate);
  const offlineCtx = new OfflineAudioContext(1, length, targetSampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start(0);

  const rendered = await offlineCtx.startRendering();
  await audioContext.close();
  return rendered.getChannelData(0);
}

export async function transcribeVideo(videoFile, onProgress) {
  onProgress?.({ status: "progress", progress: 0 });
  const model = await loadModel(onProgress);

  onProgress?.({ status: "done" });
  const audioData = await extractAudioFromVideo(videoFile);

  const result = await model(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: false,
  });

  return result.text.trim();
}
