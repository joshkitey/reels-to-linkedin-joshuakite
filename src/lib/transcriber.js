// Browser-based transcription using HuggingFace Transformers (Whisper)
// Extracts audio from video, resamples to 16kHz mono, runs Whisper model

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

export async function extractAudioFromVideo(videoFile) {
  const audioContext = new AudioContext({ sampleRate: 16000 });
  const arrayBuffer = await videoFile.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Mix down to mono at 16kHz
  const monoData = new Float32Array(audioBuffer.length);
  const numChannels = audioBuffer.numberOfChannels;
  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = audioBuffer.getChannelData(ch);
    for (let i = 0; i < audioBuffer.length; i++) {
      monoData[i] += channelData[i] / numChannels;
    }
  }

  await audioContext.close();
  return monoData;
}

export async function transcribeVideo(videoFile, onProgress) {
  const model = await loadModel(onProgress);
  const audioData = await extractAudioFromVideo(videoFile);

  const result = await model(audioData, {
    chunk_length_s: 30,
    stride_length_s: 5,
    return_timestamps: false,
  });

  return result.text.trim();
}
